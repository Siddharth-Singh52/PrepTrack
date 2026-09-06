import mongoose from 'mongoose';

const resumeAnalysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    filename: {
      type: String,
      default: 'resume.pdf',
    },
    atsScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    sectionScores: {
      type: {
        contact: { type: Number, default: 0 },
        summary: { type: Number, default: 0 },
        skills: { type: Number, default: 0 },
        experience: { type: Number, default: 0 },
        education: { type: Number, default: 0 },
        projects: { type: Number, default: 0 },
      },
      default: {
        contact: 0,
        summary: 0,
        skills: 0,
        experience: 0,
        education: 0,
        projects: 0,
      },
    },
    strengths: {
      type: [String],
      default: [],
    },
    weaknesses: {
      type: [String],
      default: [],
    },
    missingKeywords: {
      type: [String],
      default: [],
    },
    suggestions: {
      type: [String],
      default: [],
    },
    extractedText: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const ResumeAnalysis = mongoose.models.ResumeAnalysis || mongoose.model('ResumeAnalysis', resumeAnalysisSchema);
export default ResumeAnalysis;
