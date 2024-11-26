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
const mongoose_1 = __importStar(require("mongoose"));
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['student', 'adviser'] },
    profileImage: { type: String, required: false },
    specializations: { type: [String], required: function () { return this.role === 'adviser'; } },
    manuscriptStatus: {
        type: String,
        enum: ['Revise On Advicer', 'Ready to Defense', 'Revise on Panelist', 'Approved on Panel', null],
        default: null,
    },
    panelistVotes: {
        type: [String], // Explicitly define as an array of strings
        default: [],
    },
    publishingVotes: {
        type: [String], // Explicitly define as an array of strings
        default: [],
    },
    course: { type: String },
    year: { type: Number },
    handleNumber: { type: Number },
    acceptedStudents: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' }], // list of accepted students
    isApproved: { type: Boolean, default: false },
    chosenAdvisor: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', default: null },
    advisorStatus: { type: String, enum: ['accepted', 'declined', 'pending', null] },
    declinedAdvisors: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' }],
    panelists: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' }],
    channelId: { type: String },
    design: { type: String, enum: ['Subject Expert', 'Statistician', 'Technical Expert'] },
    groupMembers: { type: [String], required: function () { return this.role === 'student'; } },
    proposals: [{
            proposalTitle: { type: String, required: true },
            proposalText: { type: String, required: true },
            submittedAt: { type: Date, default: Date.now },
        }],
    tasks: [
        {
            _id: { type: mongoose_1.Schema.Types.ObjectId, auto: true }, // Ensure `_id` is part of the schema
            taskTitle: { type: String, required: true },
            isCompleted: { type: Boolean, default: false },
        },
    ],
});
const User = (0, mongoose_1.model)('User', userSchema);
exports.default = User;
