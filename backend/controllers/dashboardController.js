const Question = require("../models/question");
const UserProgress = require("../models/userProgress");

const getDashboardStats = async (req, res) => {

    try {

        const totalQuestions = await Question.countDocuments();

        const completed = await UserProgress.countDocuments({
            user: req.user.id,
            status: "Completed",
        });

        const inProgress = await UserProgress.countDocuments({
            user: req.user.id,
            status: "In Progress",
        });

        const favorites = await UserProgress.countDocuments({
            user: req.user.id,
            favorite: true,
        });

        const notStarted = totalQuestions - completed - inProgress;

        const completionPercentage = totalQuestions === 0 ? 0 : Math.round((completed / totalQuestions) * 100);

        res.status(200).json({
            success: true,

            stats: {
                totalQuestions,
                completed,
                inProgress,
                notStarted,
                favorites,
                completionPercentage,
            },
        });

    } 
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    getDashboardStats,
};