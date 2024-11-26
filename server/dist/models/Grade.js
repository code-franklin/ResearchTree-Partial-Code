"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// models/Grade.ts
const mongoose_1 = __importStar(require("mongoose"));
const gradeSchema = new mongoose_1.Schema({
    studentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
    },
    panelistId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
exports.default = mongoose_1.default.model('Grade', gradeSchema);
