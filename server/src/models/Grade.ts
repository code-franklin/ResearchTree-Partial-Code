// models/Grade.ts
import mongoose, { Document, Schema } from 'mongoose';

// Interface for the Grade document
export interface IGrade extends Document {
  studentId: mongoose.Schema.Types.ObjectId;
  panelistId: mongoose.Schema.Types.ObjectId;
  grades: {
    research: Record<'4' | '3' | '2' | '1', string>;
    presentation: Record<'4' | '3' | '2' | '1', string>;
    content: Record<'4' | '3' | '2' | '1', string>;
    design: Record<'4' | '3' | '2' | '1', string>;
    function: Record<'4' | '3' | '2' | '1', string>;
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
  grades: {
    research: { 4: { type: String, default: '' }, 3: { type: String, default: '' }, 2: { type: String, default: '' }, 1: { type: String, default: '' } },
    presentation: { 4: { type: String, default: '' }, 3: { type: String, default: '' }, 2: { type: String, default: '' }, 1: { type: String, default: '' } },
    content: { 4: { type: String, default: '' }, 3: { type: String, default: '' }, 2: { type: String, default: '' }, 1: { type: String, default: '' } },
    design: { 4: { type: String, default: '' }, 3: { type: String, default: '' }, 2: { type: String, default: '' }, 1: { type: String, default: '' } },
    function: { 4: { type: String, default: '' }, 3: { type: String, default: '' }, 2: { type: String, default: '' }, 1: { type: String, default: '' } },
  },
  dateGraded: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IGrade>('Grade', gradeSchema);
