const Question = require("../models/question");
const UserProgress = require("../models/userProgress");
const PlacementApplication = require("../models/application");

const getDashboardAnalytics = async (req, res) => {

    try {

        // Question Analytics
        const totalQuestions = await Question.countDocuments();

        const completedQuestions = await UserProgress.countDocuments({
            user: req.user.id,
            status: "Completed",
        });

        const inProgressQuestions = await UserProgress.countDocuments({
            user: req.user.id,
            status: "In Progress",
        });

        const notStartedQuestions =
            totalQuestions -
            completedQuestions -
            inProgressQuestions;

        // Placement Analytics
        const totalApplications =
            await PlacementApplication.countDocuments({
                user: req.user.id,
            });

        const interviews =
            await PlacementApplication.countDocuments({
                user: req.user.id,
                status: "Interview",
            });

        const offers =
            await PlacementApplication.countDocuments({
                user: req.user.id,
                status: "Offer",
            });

        const oa =
            await PlacementApplication.countDocuments({
                user: req.user.id,
                status: "OA",
            });

        const rejected =
            await PlacementApplication.countDocuments({
                user: req.user.id,
                status: "Rejected",
            });

        const priorityCompanies =
            await PlacementApplication.countDocuments({
                user: req.user.id,
                priority: true,
            });

        const today = new Date();

        const upcomingDeadlines =
            await PlacementApplication.countDocuments({
                user: req.user.id,
                deadline: {
                    $gte: today,
                },
            });

        const successRate =
            totalApplications === 0
                ? 0
                : Math.round((offers / totalApplications) * 100);

        return res.status(200).json({
            success: true,

            analytics: {

                questions: {
                    total: totalQuestions,
                    completed: completedQuestions,
                    inProgress: inProgressQuestions,
                    notStarted: notStartedQuestions,
                },

                placements: {
                    totalApplications,
                    interviews,
                    offers,
                    oa,
                    rejected,
                    priorityCompanies,
                    upcomingDeadlines,
                    successRate,
                },

            },
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

const getUpcomingDeadlines = async (req, res) => {

    try {

        const today = new Date();

        const sevenDaysLater = new Date();

        sevenDaysLater.setDate(today.getDate() + 7);

        const deadlines = await PlacementApplication.find({

            user: req.user.id,

            deadline: {
                $gte: today,
                $lte: sevenDaysLater,
            },

        })
        .sort({ deadline: 1 });

        res.status(200).json({
            success: true,
            deadlines,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

module.exports = {
    getDashboardAnalytics,
    getUpcomingDeadlines,
};