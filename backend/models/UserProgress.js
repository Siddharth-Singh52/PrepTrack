import mongoose from 'mongoose';

const userProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['Not Started', 'In Progress', 'Completed'],
      default: 'Not Started',
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      default: '',
    },
    revisionStage: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    lastRevisedAt: {
      type: Date,
    },
    nextRevisionDate: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

userProgressSchema.index({ user: 1, question: 1 }, { unique: true });

const UserProgress = mongoose.models.UserProgress || mongoose.model('UserProgress', userProgressSchema);
export default UserProgress;
