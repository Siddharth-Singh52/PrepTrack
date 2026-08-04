const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        company: {
            type: String,
            required: true,
        },

        role: {
            type: String,
            required: true,
        },

        location: {
            type: String,
            default: "",
        },

        ctc: {
            type: String,
            default: "",
        },

        applicationDate: {
            type: Date,
            default: Date.now,
        },

        deadline: {
            type: Date,
        },

        status: {
            type: String,
            enum: [
                "Applied",
                "OA",
                "Interview",
                "HR",
                "Offer",
                "Rejected",
            ],
            default: "Applied",
        },

        priority: {
            type: Boolean,
            default: false,
        },

        currentRound: {
            type: String,
            default: "",
        },

        jobLink: {
            type: String,
            default: "",
        },

        notes: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Application", applicationSchema);