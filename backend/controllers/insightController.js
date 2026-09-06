import { DB } from '../services/dbStore.js';
import { calculateInsights } from '../services/analyticsService.js';

export const getInsights = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const allQuestions = await DB.getAllQuestions();
    const userProgress = await DB.getUserProgress(userId);
    const placements = await DB.getPlacements(userId);
    const goals = await DB.getGoals(userId);

    const insights = calculateInsights(allQuestions, userProgress, placements, goals);

    res.status(200).json({
      success: true,
      insights,
    });
  } catch (error) {
    next(error);
  }
};
