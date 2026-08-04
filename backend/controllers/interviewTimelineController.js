const InterviewTimeline = require("../models/interviewTimeline");

const addTimelineEvent = async (req, res) => {

    try {

        const timeline = await InterviewTimeline.create(req.body);

        res.status(201).json({
            success: true,
            timeline,
        });

    }
    catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

const getTimeline = async (req, res) => {

    try {

        const timeline = await InterviewTimeline.find({
            application: req.params.applicationId,
        }).sort({ eventDate: 1 });

        res.status(200).json({
            success: true,
            timeline,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

const updateTimelineEvent = async (req, res) => {

    try {

        const timeline = await InterviewTimeline.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
            }
        );

        res.status(200).json({
            success: true,
            timeline,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

const deleteTimelineEvent = async (req, res) => {

    try {

        await InterviewTimeline.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Timeline event deleted",
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

module.exports = {
    addTimelineEvent,
    getTimeline,
    updateTimelineEvent,
    deleteTimelineEvent,
};