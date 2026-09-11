import User from '../models/User.js';
import Question from '../models/Question.js';
import UserProgress from '../models/UserProgress.js';
import Placement from '../models/Placement.js';

export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select('-password -targetCompanies');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.',
      });
    }

    const [allQuestions, userProgress, placements] = await Promise.all([
      Question.find().lean(),
      UserProgress.find({ user: userId }).lean(),
      Placement.find({ user: userId }).lean(),
    ]);

    const completedDSA = userProgress.filter((p) => p.status === 'Completed').length;
    const totalQuestions = allQuestions.length;
    const totalApplications = placements.length;
    const offers = placements.filter((p) => p.status === 'Offer').length;

    res.status(200).json({
      success: true,
      profile: user,
      stats: {
        totalQuestions,
        completedDSA,
        prepPercentage: totalQuestions > 0 ? Math.round((completedDSA / totalQuestions) * 100) : 0,
        totalApplications,
        offers,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { name, targetRole, skills, github, linkedin, leetcode, portfolio } = req.body;

    const updateData = {};
    if (name) updateData.name = name.trim();
    if (targetRole !== undefined) updateData.targetRole = targetRole.trim();
    if (skills !== undefined) {
      updateData.skills = Array.isArray(skills)
        ? skills
        : skills.split(',').map((s) => s.trim()).filter(Boolean);
    }
    if (github !== undefined) updateData.github = github.trim();
    if (linkedin !== undefined) updateData.linkedin = linkedin.trim();
    if (leetcode !== undefined) updateData.leetcode = leetcode.trim();
    if (portfolio !== undefined) updateData.portfolio = portfolio.trim();

    const updated = await User.findByIdAndUpdate(userId, updateData, { new: true })
      .select('-password -targetCompanies');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      profile: updated,
    });
  } catch (error) {
    next(error);
  }
};
