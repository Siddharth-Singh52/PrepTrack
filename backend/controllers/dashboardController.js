import Question from '../models/Question.js';
import UserProgress from '../models/UserProgress.js';
import Placement from '../models/Placement.js';
import Goal from '../models/Goal.js';
import { calculateInsights } from '../services/analyticsService.js';

export const getDashboardSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [allQuestions, userProgress, placements, goals] = await Promise.all([
      Question.find().lean(),
      UserProgress.find({ user: userId }).populate('question').lean(),
      Placement.find({ user: userId }).sort({ createdAt: -1 }).lean(),
      Goal.find({ user: userId }).sort({ createdAt: -1 }).lean(),
    ]);

    const progressMap = new Map();
    userProgress.forEach((p) => {
      const qId = p.question?._id ? p.question._id.toString() : p.question.toString();
      progressMap.set(qId, p);
    });

    let completedCount = 0;
    let inProgressCount = 0;
    let easySolved = 0;
    let mediumSolved = 0;
    let hardSolved = 0;
    let easyTotal = 0;
    let mediumTotal = 0;
    let hardTotal = 0;

    const now = new Date();
    let dueRevisionCount = 0;

    allQuestions.forEach((q) => {
      const prog = progressMap.get(q._id.toString());
      const isCompleted = prog && prog.status === 'Completed';
      const isInProgress = prog && prog.status === 'In Progress';

      if (q.difficulty === 'Easy') easyTotal++;
      if (q.difficulty === 'Medium') mediumTotal++;
      if (q.difficulty === 'Hard') hardTotal++;

      if (isCompleted) {
        completedCount++;
        if (q.difficulty === 'Easy') easySolved++;
        if (q.difficulty === 'Medium') mediumSolved++;
        if (q.difficulty === 'Hard') hardSolved++;
      } else if (isInProgress) {
        inProgressCount++;
      }

      if (prog && prog.nextRevisionDate && new Date(prog.nextRevisionDate) <= now) {
        dueRevisionCount++;
      }
    });

    const totalQuestions = allQuestions.length;
    const overallPercentage = totalQuestions > 0 ? Math.round((completedCount / totalQuestions) * 100) : 0;

    // Placement metrics
    const totalApplications = placements.length;
    const activeApplications = placements.filter(
      (p) => !['Rejected', 'Withdrawn', 'Offer'].includes(p.status)
    ).length;
    const interviewCount = placements.filter((p) =>
      ['Interview Scheduled', 'Technical Interview', 'HR Interview'].includes(p.status)
    ).length;
    const offerCount = placements.filter((p) => p.status === 'Offer').length;

    // Goals summary
    const totalGoals = goals.length;
    const completedGoals = goals.filter((g) => g.completed || (g.targetValue > 0 && g.currentValue >= g.targetValue)).length;

    // Recent activity (recently completed questions, recent revisions, recent job applications)
    const recentActivity = [];

    userProgress
      .filter((p) => p.completedAt)
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
      .slice(0, 5)
      .forEach((p) => {
        recentActivity.push({
          type: 'dsa_solved',
          title: `Solved ${p.question?.title || 'DSA Problem'}`,
          detail: `${p.question?.topic || 'DSA'} • ${p.question?.difficulty || 'Medium'}`,
          timestamp: p.completedAt,
        });
      });

    userProgress
      .filter((p) => p.lastRevisedAt)
      .sort((a, b) => new Date(b.lastRevisedAt) - new Date(a.lastRevisedAt))
      .slice(0, 3)
      .forEach((p) => {
        recentActivity.push({
          type: 'revision',
          title: `Revised ${p.question?.title || 'Problem'}`,
          detail: `Advanced to Stage ${p.revisionStage || 1} of 5`,
          timestamp: p.lastRevisedAt,
        });
      });

    placements.slice(0, 4).forEach((p) => {
      recentActivity.push({
        type: 'placement',
        title: `Applied to ${p.company}`,
        detail: `${p.role} • ${p.status}`,
        timestamp: p.applicationDate || p.createdAt,
      });
    });

    recentActivity.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Full analytics for smart teaser
    const insights = calculateInsights(allQuestions, userProgress, placements, goals);

    res.status(200).json({
      success: true,
      summary: {
        dsa: {
          totalQuestions,
          solved: completedCount,
          inProgress: inProgressCount,
          notStarted: totalQuestions - completedCount - inProgressCount,
          overallPercentage,
          easy: { solved: easySolved, total: easyTotal },
          medium: { solved: mediumSolved, total: mediumTotal },
          hard: { solved: hardSolved, total: hardTotal },
        },
        placement: {
          totalApplications,
          activeApplications,
          interviews: interviewCount,
          offers: offerCount,
        },
        revision: {
          dueCount: dueRevisionCount,
          totalInRotation: userProgress.filter((p) => p.revisionStage > 0).length,
        },
        goals: {
          total: totalGoals,
          completed: completedGoals,
          percentage: totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0,
        },
        insightsPreview: insights.keyInsights.slice(0, 3),
        topTopics: insights.topicInsights.topics.slice(0, 5),
        recentActivity: recentActivity.slice(0, 6),
      },
    });
  } catch (error) {
    next(error);
  }
};
