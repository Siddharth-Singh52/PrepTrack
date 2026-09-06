import { DB } from '../services/dbStore.js';

export const getGoals = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const rawGoals = await DB.getGoals(userId);
    const userProgress = await DB.getUserProgress(userId);
    const placements = await DB.getPlacements(userId);
    const resumeAnalyses = await DB.getResumeAnalyses(userId);

    const completedDSA = userProgress.filter((p) => p.status === 'Completed').length;
    const completedRevisions = userProgress.filter((p) => (p.revisionStage || 0) >= 1 && p.lastRevisedAt).length;
    const totalApplications = placements.length;
    const hasResume = resumeAnalyses.length > 0;

    // Dynamically update goal values based on real user actions
    const syncedGoals = await Promise.all(
      rawGoals.map(async (g) => {
        let current = g.currentValue;

        if (g.category === 'DSA') {
          // If title mentions a specific topic like "Solve 20 Graph questions"
          const titleLower = g.title.toLowerCase();
          const matchedTopic = ['array', 'string', 'tree', 'graph', 'dynamic programming', 'linked list', 'binary search'].find(
            (t) => titleLower.includes(t)
          );
          if (matchedTopic) {
            current = userProgress.filter(
              (p) => p.status === 'Completed' && p.question?.topic?.toLowerCase().includes(matchedTopic)
            ).length;
          } else {
            current = completedDSA;
          }
        } else if (g.category === 'Revision') {
          current = completedRevisions;
        } else if (g.category === 'Applications') {
          current = totalApplications;
        } else if (g.category === 'Resume') {
          current = hasResume ? g.targetValue : 0;
        }

        const isCompleted = g.completed || (g.targetValue > 0 && current >= g.targetValue);

        // Update in DB if changed
        if (current !== g.currentValue || isCompleted !== g.completed) {
          await DB.updateGoal(userId, g._id, { currentValue: current, completed: isCompleted });
        }

        return {
          ...g,
          currentValue: current,
          completed: isCompleted,
          percentage: g.targetValue > 0 ? Math.min(100, Math.round((current / g.targetValue) * 100)) : 0,
        };
      })
    );

    const total = syncedGoals.length;
    const completedCount = syncedGoals.filter((g) => g.completed).length;

    res.status(200).json({
      success: true,
      stats: {
        total,
        completedCount,
        inProgressCount: total - completedCount,
        completionRate: total > 0 ? Math.round((completedCount / total) * 100) : 0,
      },
      goals: syncedGoals,
    });
  } catch (error) {
    next(error);
  }
};

export const createGoal = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { title, description, category, targetValue, deadline } = req.body;

    if (!title || !targetValue) {
      return res.status(400).json({
        success: false,
        message: 'Goal title and target value are required.',
      });
    }

    const numTarget = parseInt(targetValue, 10);
    if (isNaN(numTarget) || numTarget <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Target value must be a positive number.',
      });
    }

    const newGoal = await DB.createGoal(userId, {
      title: title.trim(),
      description: description || '',
      category: category || 'DSA',
      targetValue: numTarget,
      currentValue: 0,
      deadline: deadline ? new Date(deadline) : null,
      completed: false,
    });

    res.status(201).json({
      success: true,
      message: 'Goal created successfully.',
      goal: newGoal,
    });
  } catch (error) {
    next(error);
  }
};

export const updateGoal = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const { title, description, category, targetValue, currentValue, deadline, completed } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (targetValue !== undefined) updateData.targetValue = parseInt(targetValue, 10);
    if (currentValue !== undefined) updateData.currentValue = parseInt(currentValue, 10);
    if (deadline !== undefined) updateData.deadline = deadline ? new Date(deadline) : null;
    if (completed !== undefined) updateData.completed = completed;

    const updated = await DB.updateGoal(userId, id, updateData);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Goal updated successfully.',
      goal: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteGoal = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const deleted = await DB.deleteGoal(userId, id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Goal deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
