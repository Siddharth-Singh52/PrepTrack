const UserProgress = require("../models/userProgress");
const Question = require("../models/question");

const ensureValidQuestion = async (questionId) => {
    if (!questionId) {
        return null;
    }

    const question = await Question.findById(questionId);
    return question;
};

const updateProgress = async (req, res) => {

    try {

        const { questionId, status } = req.body;

        const question = await ensureValidQuestion(questionId);

        if (!question) {
            return res.status(404).json({
                success: false,
                message: "Question not found",
            });
        }

        let progress = await UserProgress.findOne({
            user: req.user.id,
            question: questionId,
        });

        // =========================================
        // If progress record already exists
        // =========================================

        if (progress) {

            const previousStatus = progress.status;

            progress.status = status;

            // -----------------------------------------
            // Only increase revision stage when:
            // 1. Question is being completed
            // 2. It was NOT already completed
            // -----------------------------------------

            if (
                status === "Completed" &&
                previousStatus !== "Completed"
            ) {

                const revisionDays = [1, 4, 9, 18, 30];

                // Current stage before increasing
                const currentStage = Math.min(
                    progress.revisionStage || 0,
                    4
                );

                const nextDate = new Date();

                nextDate.setDate(
                    nextDate.getDate() + revisionDays[currentStage]
                );

                // Increase stage only once
                progress.revisionStage = Math.min(
                    (progress.revisionStage || 0) + 1,
                    5
                );

                progress.lastRevisedAt = new Date();

                progress.nextRevisionDate = nextDate;

                progress.completedAt = new Date();
            }

            await progress.save();

        }

        // =========================================
        // If progress record doesn't exist
        // =========================================

        else {

            progress = await UserProgress.create({

                user: req.user.id,

                question: questionId,

                status,

                revisionStage:
                    status === "Completed" ? 1 : 0,

                lastRevisedAt:
                    status === "Completed"
                        ? new Date()
                        : null,

                nextRevisionDate:
                    status === "Completed"
                        ? (() => {

                            const d = new Date();

                            d.setDate(d.getDate() + 1);

                            return d;

                        })()
                        : null,

                completedAt:
                    status === "Completed"
                        ? new Date()
                        : null,

            });

        }

        res.status(200).json({

            success: true,

            progress,

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

const updateNotes = async (req, res) => {

    try {

        const { questionId, notes } = req.body;

        const question = await ensureValidQuestion(questionId);

        if (!question) {
            return res.status(404).json({
                success: false,
                message: "Question not found",
            });
        }

        let progress = await UserProgress.findOne({
            user: req.user.id,
            question: questionId,
        });

        if (progress) {
            progress.notes = notes;
            await progress.save();
        } 
        else {
            progress = await UserProgress.create({
                user: req.user.id,
                question: questionId,
                notes,
            });
        }

        res.status(200).json({
            success: true,
            progress,
        });
    } 
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const toggleFavorite = async (req, res) => {

    try {

        const { questionId } = req.body;

        const question = await ensureValidQuestion(questionId);

        if (!question) {
            return res.status(404).json({
                success: false,
                message: "Question not found",
            });
        }

        let progress = await UserProgress.findOne({
            user: req.user.id,
            question: questionId,
        });

        if (progress) {
            progress.favorite = !progress.favorite;
            await progress.save();
        } 
        else {
            progress = await UserProgress.create({
                user: req.user.id,
                question: questionId,
                favorite: true,
            });
        }
        res.status(200).json({
            success: true,
            progress,
        });

    } 
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getUserProgress = async (req, res) => {

    try {

        const progress = await UserProgress.find({
            user: req.user.id,
        }).populate("question");

        const validProgress = progress.filter((item) => item.question);

        res.status(200).json({
            success: true,
            progress: validProgress,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getTodayRevisions = async (req, res) => {

    try {

        const today = new Date();

        today.setHours(0, 0, 0, 0);

        const revisions = await UserProgress.find({

            user: req.user.id,

            nextRevisionDate: {
                $lte: today,
            },

        }).populate("question");

        const validRevisions = revisions.filter((item) => item.question);

        res.status(200).json({
            success: true,
            revisions: validRevisions,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

module.exports = {
    updateProgress,
    updateNotes,
    getUserProgress,
    toggleFavorite,
    getTodayRevisions,
}