const UserProgress = require("../models/userProgress");

const updateProgress = async (req, res) => {

    try {

        const { questionId, status } = req.body;

        let progress = await UserProgress.findOne({
            user: req.user.id,
            question: questionId,
        });

        if (progress) {

            progress.status = status;
            await progress.save();

        } 
        else {
            progress = await UserProgress.create({
                user: req.user.id,
                question: questionId,
                status,
            });
        }

        res.status(200).json({
            success: true,
            progress,
        });

    } catch (error) {

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

        let progress = await UserProgress.findOne({
            user: req.user.id,
            question: questionId,
        });

        if (progress) {

            progress.notes = notes;
            await progress.save();

        } else {

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

    } catch (error) {

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
        });

        res.status(200).json({
            success: true,
            progress,
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
}