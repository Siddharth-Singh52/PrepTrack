const InterviewExperience = require("../models/interviewExperience");

const getExperiences = async (req, res) => {
    try {

        const { applicationId } = req.params;

        const experiences = await InterviewExperience.find({
            application: applicationId,
        }).sort({ createdAt: 1 });

        res.status(200).json({
            success: true,
            experiences,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

const createExperience = async (req, res) => {
    try {

        const experience = await InterviewExperience.create(req.body);

        res.status(201).json({
            success: true,
            experience,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

const updateExperience = async (req, res) => {
    try {

        const experience = await InterviewExperience.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json({
            success: true,
            experience,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

const deleteExperience = async (req, res) => {
    try {

        await InterviewExperience.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Experience Deleted",
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

module.exports = {
    getExperiences,
    createExperience,
    updateExperience,
    deleteExperience,
};