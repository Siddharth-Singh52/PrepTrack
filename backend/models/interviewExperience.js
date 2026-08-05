const mongoose = require("mongoose");

const interviewExperienceSchema = new mongoose.Schema(
{
    application: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
        required: true,
    },

    round: {
        type: String,
        required: true,
    },

    questionsAsked: {
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

module.exports = mongoose.model(
    "InterviewExperience",
    interviewExperienceSchema
);