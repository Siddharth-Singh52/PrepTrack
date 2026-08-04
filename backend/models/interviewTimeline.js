const mongoose = require("mongoose");

const interviewTimelineSchema = new mongoose.Schema(
    {
        application: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "application",
            required: true,
        },

        title: {
            type: String,
            required: true,
        },

        description: {
            type: String,
            default: "",
        },

        eventDate: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "InterviewTimeline",
    interviewTimelineSchema
);