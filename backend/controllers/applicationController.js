const Application = require("../models/application");

// Create Application
const createApplication = async (req, res) => {
    try {

        const application = await Application.create({
            ...req.body,
            user: req.user.id,
        });

        res.status(201).json({
            success: true,
            application,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

// Get All Applications
const getApplications = async (req, res) => {

    try {

        const applications = await Application.find({
            user: req.user.id,
        }).sort({
            createdAt: -1,
        });

        res.status(200).json({
            success: true,
            applications,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

// Update Application
const updateApplication = async (req, res) => {

    try {

        const application = await Application.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user.id,
            },
            req.body,
            {
                new: true,
            }
        );

        res.status(200).json({
            success: true,
            application,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

// Delete Application
const deleteApplication = async (req, res) => {

    try {

        await Application.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id,
        });

        res.status(200).json({
            success: true,
            message: "Application Deleted",
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

module.exports = {
    createApplication,
    getApplications,
    updateApplication,
    deleteApplication,
};