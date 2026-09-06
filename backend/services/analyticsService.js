export const calculateInsights = (questions = [], userProgress = [], placements = [], goals = []) => {
  const totalQuestions = questions.length;
  const progressMap = new Map();
  userProgress.forEach((p) => {
    const qId = p.question?._id ? p.question._id.toString() : p.question.toString();
    progressMap.set(qId, p);
  });

  let completedCount = 0;
  let inProgressCount = 0;

  // Topic-wise metrics
  const topicStats = {};
  // Difficulty-wise metrics
  const difficultyStats = {
    Easy: { total: 0, completed: 0 },
    Medium: { total: 0, completed: 0 },
    Hard: { total: 0, completed: 0 },
  };

  // Company prep metrics

  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  let weeklySolved = 0;
  let monthlySolved = 0;
  let dueRevisionsCount = 0;
  let overdueRevisionsCount = 0;

  questions.forEach((q) => {
    const qId = q._id.toString();
    const prog = progressMap.get(qId);
    const isCompleted = prog && prog.status === 'Completed';
    const isInProgress = prog && prog.status === 'In Progress';

    if (isCompleted) completedCount++;
    if (isInProgress) inProgressCount++;

    // Topic aggregation
    const topic = q.topic || 'General';
    if (!topicStats[topic]) {
      topicStats[topic] = { total: 0, completed: 0, inProgress: 0 };
    }
    topicStats[topic].total++;
    if (isCompleted) topicStats[topic].completed++;
    if (isInProgress) topicStats[topic].inProgress++;

    // Difficulty aggregation
    if (difficultyStats[q.difficulty]) {
      difficultyStats[q.difficulty].total++;
      if (isCompleted) difficultyStats[q.difficulty].completed++;
    }

    // Company aggregation

    // Revision checks
    if (prog && prog.nextRevisionDate) {
      const nextRev = new Date(prog.nextRevisionDate);
      if (nextRev <= now) {
        dueRevisionsCount++;
        // If more than 24h past due
        if (now.getTime() - nextRev.getTime() > 24 * 60 * 60 * 1000) {
          overdueRevisionsCount++;
        }
      }
    }

    // Solved timestamps
    if (prog && prog.completedAt) {
      const compDate = new Date(prog.completedAt);
      if (compDate >= oneWeekAgo) weeklySolved++;
      if (compDate >= oneMonthAgo) monthlySolved++;
    }
  });

  // Calculate overall preparation percentage
  const overallPrepPercentage = totalQuestions > 0 ? Math.round((completedCount / totalQuestions) * 100) : 0;

  // Identify strongest and weakest topics (among topics with at least 1 question)
  let strongestTopic = { name: 'Arrays', percentage: 0, completed: 0, total: 0 };
  let weakestTopic = { name: 'Graphs', percentage: 100, completed: 0, total: 0 };

  const topicList = Object.entries(topicStats).map(([name, stat]) => {
    const pct = stat.total > 0 ? Math.round((stat.completed / stat.total) * 100) : 0;
    return {
      name,
      total: stat.total,
      completed: stat.completed,
      inProgress: stat.inProgress,
      percentage: pct,
    };
  });

  if (topicList.length > 0) {
    const sortedByPct = [...topicList].sort((a, b) => b.percentage - a.percentage);
    strongestTopic = sortedByPct[0];
    weakestTopic = sortedByPct[sortedByPct.length - 1];
  }

  // Identify difficulty breakdown
  const difficultyList = Object.entries(difficultyStats).map(([diff, stat]) => {
    const pct = stat.total > 0 ? Math.round((stat.completed / stat.total) * 100) : 0;
    return {
      difficulty: diff,
      total: stat.total,
      completed: stat.completed,
      percentage: pct,
    };
  });

  const sortedDiff = [...difficultyList].sort((a, b) => b.percentage - a.percentage);
  const strongestDifficulty = sortedDiff[0] || { difficulty: 'Easy', percentage: 0 };
  const weakestDifficulty = sortedDiff[sortedDiff.length - 1] || { difficulty: 'Hard', percentage: 0 };

  // Placements / Applications analytics
  const totalApplications = placements.length;
  const activeApplications = placements.filter(
    (p) => !['Rejected', 'Withdrawn', 'Offer'].includes(p.status)
  ).length;
  const interviewCount = placements.filter((p) =>
    ['Interview Scheduled', 'Technical Interview', 'HR Interview'].includes(p.status)
  ).length;
  const offerCount = placements.filter((p) => p.status === 'Offer').length;
  const rejectionCount = placements.filter((p) => p.status === 'Rejected').length;
  
  const resolvedApps = offerCount + rejectionCount;
  const applicationSuccessRate = resolvedApps > 0 ? Math.round((offerCount / resolvedApps) * 100) : (offerCount > 0 ? 100 : 0);

  // Goals analytics
  const totalGoals = goals.length;
  const completedGoals = goals.filter((g) => g.completed || (g.targetValue > 0 && g.currentValue >= g.targetValue)).length;
  const goalCompletionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  // Generate dynamic deterministic insight statements
  const keyInsights = [];
  if (completedCount === 0) {
    keyInsights.push('Start solving your first DSA questions to activate intelligent preparation insights.');
    keyInsights.push('Explore curated company question sets for Google, Amazon, and Microsoft.');
  } else {
    keyInsights.push(`Your strongest topic is currently ${strongestTopic.name} (${strongestTopic.percentage}% solved).`);
    keyInsights.push(`${weakestTopic.name} is your weakest area (${weakestTopic.percentage}% completed). Allocate more practice here.`);
    if (dueRevisionsCount > 0) {
      keyInsights.push(`You have ${dueRevisionsCount} question${dueRevisionsCount > 1 ? 's' : ''} due for spaced repetition revision.`);
    } else {
      keyInsights.push('Your revision schedule is up to date! Keep up the momentum.');
    }
    if (weeklySolved > 0) {
      keyInsights.push(`You solved ${weeklySolved} problem${weeklySolved > 1 ? 's' : ''} over the past 7 days.`);
    }
  }

  return {
    overview: {
      totalQuestions,
      completedCount,
      inProgressCount,
      overallPrepPercentage,
      weeklySolved,
      monthlySolved,
      dueRevisionsCount,
      overdueRevisionsCount,
    },
    topicInsights: {
      topics: topicList,
      strongestTopic,
      weakestTopic,
    },
    difficultyInsights: {
      difficulties: difficultyList,
      strongestDifficulty,
      weakestDifficulty,
    },
    placementInsights: {
      totalApplications,
      activeApplications,
      interviewCount,
      offerCount,
      rejectionCount,
      applicationSuccessRate,
    },
    goalInsights: {
      totalGoals,
      completedGoals,
      goalCompletionRate,
    },
    keyInsights,
  };
};
