import Question from '../models/Question.js';
import UserProgress from '../models/UserProgress.js';
import Placement from '../models/Placement.js';
import Goal from '../models/Goal.js';
import { calculateInsights } from '../services/analyticsService.js';

export const getInsights = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [allQuestions, userProgress, placements, goals] = await Promise.all([
      Question.find().lean(),
      UserProgress.find({ user: userId }).populate('question').lean(),
      Placement.find({ user: userId }).lean(),
      Goal.find({ user: userId }).lean(),
    ]);

    const insights = calculateInsights(allQuestions, userProgress, placements, goals);

    res.status(200).json({
      success: true,
      insights,
    });
  } catch (error) {
    next(error);
  }
};
