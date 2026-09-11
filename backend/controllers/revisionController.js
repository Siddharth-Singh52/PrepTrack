import Question from '../models/Question.js';
import UserProgress from '../models/UserProgress.js';

const REVISION_INTERVALS_DAYS = {
  1: 1,
  2: 3,
  3: 7,
  4: 14,
  5: 30,
};

export const getRevisions = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const [progressList, allQuestions] = await Promise.all([
      UserProgress.find({ user: userId }).populate('question').lean(),
      Question.find().lean(),
    ]);

    const qMap = new Map();
    allQuestions.forEach((q) => qMap.set(q._id.toString(), q));

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const dueToday = [];
    const overdue = [];
    const upcoming = [];
    const recentlyRevised = [];

    progressList.forEach((p) => {
      if (p.status !== 'Completed' && p.revisionStage === 0) return;

      const qId = p.question?._id ? p.question._id.toString() : p.question?.toString();
      const questionData = qMap.get(qId);
      if (!questionData) return;

      const stage = p.revisionStage || 1;
      const item = {
        progressId: p._id,
        questionId: questionData._id,
        title: questionData.title,
        topic: questionData.topic,
        difficulty: questionData.difficulty,
        platform: questionData.platform,
        link: questionData.link,
        companyTags: questionData.companyTags || [],
        revisionStage: stage,
        stageLabel: `Stage ${stage} of 5`,
        lastRevisedAt: p.lastRevisedAt,
        nextRevisionDate: p.nextRevisionDate,
        notes: p.notes || '',
      };

      if (p.nextRevisionDate) {
        const nextDate = new Date(p.nextRevisionDate);

        if (nextDate < startOfToday) {
          overdue.push(item);
        } else if (nextDate >= startOfToday && nextDate <= endOfToday) {
          dueToday.push(item);
        } else {
          upcoming.push(item);
        }
      }

      if (p.lastRevisedAt) {
        recentlyRevised.push(item);
      }
    });

    // Sort upcoming by nextRevisionDate ascending
    upcoming.sort((a, b) => new Date(a.nextRevisionDate) - new Date(b.nextRevisionDate));
    // Sort overdue by oldest first
    overdue.sort((a, b) => new Date(a.nextRevisionDate) - new Date(b.nextRevisionDate));
    // Sort recently revised by newest first
    recentlyRevised.sort((a, b) => new Date(b.lastRevisedAt) - new Date(a.lastRevisedAt));

    res.status(200).json({
      success: true,
      stats: {
        dueTodayCount: dueToday.length,
        overdueCount: overdue.length,
        upcomingCount: upcoming.length,
        totalInRevision: dueToday.length + overdue.length + upcoming.length,
      },
      revisions: {
        dueToday,
        overdue,
        upcoming,
        recentlyRevised: recentlyRevised.slice(0, 15),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const completeRevision = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const userId = req.user._id;

    const prog = await UserProgress.findOne({ user: userId, question: questionId });
    if (!prog) {
      return res.status(404).json({
        success: false,
        message: 'Question progress not found.',
      });
    }

    const currentStage = prog.revisionStage || 0;
    const nextStage = Math.min(5, currentStage + 1);
    const intervalDays = REVISION_INTERVALS_DAYS[nextStage] || 30;

    const now = new Date();
    const nextDate = new Date();
    nextDate.setDate(now.getDate() + intervalDays);

    const updated = await UserProgress.findOneAndUpdate(
      { user: userId, question: questionId },
      {
        $set: {
          revisionStage: nextStage,
          lastRevisedAt: now,
          nextRevisionDate: nextDate,
          status: 'Completed',
        },
      },
      { new: true, upsert: true }
    ).populate('question');

    res.status(200).json({
      success: true,
      message: `Revision completed! Advanced to Stage ${nextStage} of 5. Next revision scheduled in ${intervalDays} days.`,
      progress: updated,
    });
  } catch (error) {
    next(error);
  }
};
