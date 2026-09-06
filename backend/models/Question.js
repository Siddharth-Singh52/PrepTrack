import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Question title is required'],
      trim: true,
    },
    topic: {
      type: String,
      required: [true, 'Topic is required'],
      trim: true,
    },
    difficulty: {
      type: String,
      required: [true, 'Difficulty is required'],
      enum: ['Easy', 'Medium', 'Hard'],
    },
    platform: {
      type: String,
      default: 'LeetCode',
    },
    link: {
      type: String,
      default: '',
    },
    companyTags: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Question = mongoose.models.Question || mongoose.model('Question', questionSchema);
export default Question;
