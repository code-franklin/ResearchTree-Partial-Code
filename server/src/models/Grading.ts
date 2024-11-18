import mongoose, { Schema, Document, model } from 'mongoose';


export interface IGrade {
    criterion: string;
    gradeLabel: 'Excellent' | 'Good' | 'Satisfactory' | 'Needs Improvement';
    gradeValue: number;
  }
  
// Grading Document Interface
export interface IGrading extends Document {
  studentId: mongoose.Types.ObjectId;
  panelistId: mongoose.Types.ObjectId;
  rubricId: mongoose.Types.ObjectId;
  grades: IGrade[];
  gradedAt: Date;
  totalGradeValue: number; // Total of all gradeValues
  overallGradeLabel: 'Excellent' | 'Good' | 'Satisfactory' | 'Needs Improvement'; // Derived label
}

const gradingSchema: Schema<IGrading> = new Schema<IGrading>({
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  panelistId: { type: Schema.Types.ObjectId, ref: 'User', required: true},
  rubricId: { type: Schema.Types.ObjectId, ref: 'Rubric', required: true },
  grades: [
    {
      criterion: { type: String, required: true },
      gradeLabel: {
        type: String,
        enum: ['Excellent', 'Good', 'Satisfactory', 'Needs Improvement'],
        required: true,
      },
      gradeValue: { type: Number, required: true },
    },
  ],
  totalGradeValue: { type: Number, required: true },
  overallGradeLabel: { type: String, required: true },
  gradedAt: { type: Date, default: Date.now },
//   submittedBy: { type: Schema.Types.ObjectId, ref: 'Admin' }, // Reference to admin
});

const Grading = model<IGrading>('Grading', gradingSchema);

export default Grading;
