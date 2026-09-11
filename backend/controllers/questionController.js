import Question from '../models/Question.js';
import UserProgress from '../models/UserProgress.js';

export const getQuestions = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { search, topic, difficulty, company, status, favorite, platform, sort } = req.query;

    const [allQuestions, userProgress] = await Promise.all([
      Question.find().lean(),
      UserProgress.find({ user: userId }).populate('question').lean(),
    ]);

    const progressMap = new Map();
    userProgress.forEach((p) => {
      const qId = p.question?._id ? p.question._id.toString() : p.question.toString();
      progressMap.set(qId, p);
    });

    let questionsWithStatus = allQuestions.map((q) => {
      const prog = progressMap.get(q._id.toString());
      return {
        ...q,
        userProgressId: prog?._id || null,
        status: prog?.status || 'Not Started',
        favorite: prog?.favorite || false,
        notes: prog?.notes || '',
        revisionStage: prog?.revisionStage || 0,
        lastRevisedAt: prog?.lastRevisedAt || null,
        nextRevisionDate: prog?.nextRevisionDate || null,
        completedAt: prog?.completedAt || null,
      };
    });

    if (search && search.trim()) {
      const s = search.toLowerCase().trim();
      questionsWithStatus = questionsWithStatus.filter(
        (q) =>
          q.title.toLowerCase().includes(s) ||
          q.topic.toLowerCase().includes(s) ||
          (q.companyTags && q.companyTags.some((c) => c.toLowerCase().includes(s)))
      );
    }

    if (topic && topic !== 'All') {
      questionsWithStatus = questionsWithStatus.filter((q) => q.topic.toLowerCase() === topic.toLowerCase());
    }

    if (difficulty && difficulty !== 'All') {
      questionsWithStatus = questionsWithStatus.filter(
        (q) => q.difficulty.toLowerCase() === difficulty.toLowerCase()
      );
    }

    if (company && company !== 'All') {
      questionsWithStatus = questionsWithStatus.filter(
        (q) => q.companyTags && q.companyTags.some((c) => c.toLowerCase() === company.toLowerCase())
      );
    }

    if (status && status !== 'All') {
      questionsWithStatus = questionsWithStatus.filter(
        (q) => q.status.toLowerCase() === status.toLowerCase()
      );
    }

    if (favorite === 'true') {
      questionsWithStatus = questionsWithStatus.filter((q) => q.favorite === true);
    }

    if (platform && platform !== 'All') {
      questionsWithStatus = questionsWithStatus.filter(
        (q) => q.platform && q.platform.toLowerCase() === platform.toLowerCase()
      );
    }

    if (sort === 'difficulty') {
      const diffOrder = { Easy: 1, Medium: 2, Hard: 3 };
      questionsWithStatus.sort((a, b) => (diffOrder[a.difficulty] || 0) - (diffOrder[b.difficulty] || 0));
    } else if (sort === 'recentlyCompleted') {
      questionsWithStatus.sort((a, b) => {
        if (!a.completedAt) return 1;
        if (!b.completedAt) return -1;
        return new Date(b.completedAt) - new Date(a.completedAt);
      });
    } else {
      questionsWithStatus.sort((a, b) => a.title.localeCompare(b.title));
    }

    const totalCount = allQuestions.length;
    const completedCount = questionsWithStatus.filter((q) => q.status === 'Completed').length;
    const inProgressCount = questionsWithStatus.filter((q) => q.status === 'In Progress').length;
    const notStartedCount = questionsWithStatus.filter((q) => q.status === 'Not Started').length;

    res.status(200).json({
      success: true,
      count: questionsWithStatus.length,
      stats: {
        total: totalCount,
        completed: completedCount,
        inProgress: inProgressCount,
        notStarted: notStartedCount,
      },
      questions: questionsWithStatus,
    });
  } catch (error) {
    next(error);
  }
};

export const getQuestionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const question = await Question.findById(id).lean();
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found.',
      });
    }

    const prog = await UserProgress.findOne({ user: userId, question: id });

    res.status(200).json({
      success: true,
      question: {
        ...question,
        status: prog?.status || 'Not Started',
        favorite: prog?.favorite || false,
        notes: prog?.notes || '',
        revisionStage: prog?.revisionStage || 0,
        lastRevisedAt: prog?.lastRevisedAt || null,
        nextRevisionDate: prog?.nextRevisionDate || null,
        completedAt: prog?.completedAt || null,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createQuestion = async (req, res, next) => {
  try {
    const { title, topic, difficulty, platform, link, companyTags, description } = req.body;

    if (!title || !topic || !difficulty) {
      return res.status(400).json({
        success: false,
        message: 'Title, topic, and difficulty are required.',
      });
    }

    const newQuestion = await Question.create({
      title: title.trim(),
      topic: topic.trim(),
      difficulty,
      platform: platform || 'LeetCode',
      link: link || '',
      companyTags: Array.isArray(companyTags) ? companyTags : (companyTags ? companyTags.split(',').map((t) => t.trim()) : []),
      description: description || '',
    });

    res.status(201).json({
      success: true,
      message: 'Question created successfully.',
      question: newQuestion,
    });
  } catch (error) {
    next(error);
  }
};

export const updateQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await Question.findByIdAndUpdate(id, req.body, { new: true });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Question not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Question updated successfully.',
      question: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Question.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Question deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export const updateProgress = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const { status } = req.body;
    const userId = req.user._id;

    if (!['Not Started', 'In Progress', 'Completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value.',
      });
    }

    const currentProg = await UserProgress.findOne({ user: userId, question: questionId });

    const updateData = {
      status,
    };

    if (status === 'Completed') {
      updateData.completedAt = currentProg?.completedAt || new Date();
      if (!currentProg?.nextRevisionDate) {
        updateData.revisionStage = 1;
        updateData.lastRevisedAt = new Date();
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + 1);
        updateData.nextRevisionDate = nextDate;
      }
    }

    const updated = await UserProgress.findOneAndUpdate(
      { user: userId, question: questionId },
      { $set: updateData },
      { new: true, upsert: true }
    ).populate('question');

    res.status(200).json({
      success: true,
      message: `Status updated to ${status}.`,
      progress: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const updateNotes = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const { notes } = req.body;
    const userId = req.user._id;

    const updated = await UserProgress.findOneAndUpdate(
      { user: userId, question: questionId },
      { $set: { notes: notes || '' } },
      { new: true, upsert: true }
    ).populate('question');

    res.status(200).json({
      success: true,
      message: 'Notes saved successfully.',
      progress: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const toggleFavorite = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const userId = req.user._id;

    const currentProg = await UserProgress.findOne({ user: userId, question: questionId });
    const newFav = !(currentProg?.favorite || false);

    const updated = await UserProgress.findOneAndUpdate(
      { user: userId, question: questionId },
      { $set: { favorite: newFav } },
      { new: true, upsert: true }
    ).populate('question');

    res.status(200).json({
      success: true,
      message: newFav ? 'Added to favorites.' : 'Removed from favorites.',
      favorite: newFav,
      progress: updated,
    });
  } catch (error) {
    next(error);
  }
};
