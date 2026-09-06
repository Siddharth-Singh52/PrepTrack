import mongoose from 'mongoose';

const placementSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Role title is required'],
      trim: true,
    },
    location: {
      type: String,
      default: '',
      trim: true,
    },
    jobType: {
      type: String,
      enum: ['Full-Time', 'Internship', 'Contract', 'Part-Time'],
      default: 'Full-Time',
    },
    applicationDate: {
      type: Date,
      default: Date.now,
    },
    applicationLink: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: [
        'Interested',
        'Applied',
        'Online Assessment',
        'Interview Scheduled',
        'Technical Interview',
        'HR Interview',
        'Offer',
        'Rejected',
        'Withdrawn',
      ],
      default: 'Applied',
    },
    interviewDate: {
      type: Date,
    },
    notes: {
      type: String,
      default: '',
    },
    salary: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Placement = mongoose.models.Placement || mongoose.model('Placement', placementSchema);
export default Placement;
