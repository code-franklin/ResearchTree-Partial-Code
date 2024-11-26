"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const gradingSchema = new mongoose_1.Schema({
    studentId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    panelistId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    rubricId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Rubric', required: true },
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
const Grading = (0, mongoose_1.model)('Grading', gradingSchema);
exports.default = Grading;
