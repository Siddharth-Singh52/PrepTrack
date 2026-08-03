const mongoose = require("mongoose");

const userProgressSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        question: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Question",
            required: true,
        },

        status: {
            type: String,
            enum: ["Not Started", "In Progress", "Completed"],
            default: "Not Started",
        },

        notes: {
            type: String,
            default: "",
        },

        favorite: {
            type: Boolean,
            default: false,
        },

        revisionStage: {
            type: Number,
            default: 0,
        },

        nextRevisionDate: {
            type: Date,
            default: null,
        },

        lastRevisedAt: {
            type: Date,
            default: null,
        },

        completedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("UserProgress", userProgressSchema);