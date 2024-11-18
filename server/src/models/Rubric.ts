import mongoose, { Schema, Document } from "mongoose";

interface GradeLabels {
  excellent: string; // Editable label for "Excellent" (e.g., "Outstanding Work")
  good: string;      // Editable label for "Good" (e.g., "Above Average")
  satisfactory: string; // Editable label for "Satisfactory"
  needsImprovement: string; // Editable label for "Needs Improvement"
}

interface RubricCriteria {
  category: string; // Example: "Content and Originality"
  gradeLabels: GradeLabels; // String labels for grade levels
  excellentScore: number; // Numeric score for "Excellent" (default: 4)
  goodScore: number;      // Numeric score for "Good" (default: 3)
  satisfactoryScore: number; // Numeric score for "Satisfactory" (default: 2)
  needsImprovementScore: number; // Numeric score for "Needs Improvement" (default: 1)
}

export interface Rubric extends Document {
  title: string; // Example: "Manuscript Evaluation Rubric"
  criteria: RubricCriteria[]; // List of all criteria
}

const GradeLabelsSchema: Schema = new Schema({
  excellent: { type: String, required: true, default: "Excellent" },
  good: { type: String, required: true, default: "Good" },
  satisfactory: { type: String, required: true, default: "Satisfactory" },
  needsImprovement: {
    type: String,
    required: true,
    default: "Needs Improvement",
  },
});

const RubricCriteriaSchema: Schema = new Schema({
  category: { type: String, required: true }, // Category name
  gradeLabels: { type: GradeLabelsSchema, required: true }, // Editable labels
  excellentScore: { type: Number, default: 4, immutable: true }, // Fixed score
  goodScore: { type: Number, default: 3, immutable: true },
  satisfactoryScore: { type: Number, default: 2, immutable: true },
  needsImprovementScore: { type: Number, default: 1, immutable: true },
});

const RubricSchema: Schema = new Schema({
  title: { type: String, required: true },
  criteria: { type: [RubricCriteriaSchema], required: true },
});

export default mongoose.model<Rubric>("Rubric", RubricSchema);
