import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Goal title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: ['DSA', 'Company', 'Revision', 'Applications', 'Resume'],
      default: 'DSA',
    },
    targetValue: {
      type: Number,
      required: [true, 'Target value is required'],
      min: 1,
    },
    currentValue: {
      type: Number,
      default: 0,
      min: 0,
    },
    deadline: {
      type: Date,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Goal = mongoose.models.Goal || mongoose.model('Goal', goalSchema);
export default Goal;
