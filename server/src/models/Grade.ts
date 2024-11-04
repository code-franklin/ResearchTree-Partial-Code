import mongoose, { Document, Schema } from 'mongoose';

// Interface for the Grade document
export interface IGrade extends Document {
  studentId: mongoose.Schema.Types.ObjectId;
  panelistId: mongoose.Schema.Types.ObjectId;
  rubric: {
    criteria1: number;
    criteria2: number;
    criteria3: number;
  };
  dateGraded: Date;
}

const gradeSchema = new Schema<IGrade>({
  studentId: {
    type: Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  panelistId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rubric: {
    criteria1: { type: Number, required: true },
    criteria2: { type: Number, required: true },
    criteria3: { type: Number, required: true },
  },
  dateGraded: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IGrade>('Grade', gradeSchema);
