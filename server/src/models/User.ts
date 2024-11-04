import mongoose, { Schema, Document, model } from 'mongoose';

// Define interface for the proposal within the user schema
interface IProposal {
  proposalTitle: string;
  proposalText: string;
  submittedAt: Date;
}

// Define the ITask interface for task structure
interface ITask extends mongoose.Types.Subdocument {
  _id: mongoose.Types.ObjectId;
  taskTitle: string;
  isCompleted: boolean;
}
// Define interface for User document
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'adviser';
  profileImage: string;
  specializations: string[];
  manuscriptStatus: 'reviseOnAdvicer' | 'readyToDefense' | 'reviseOnPanelist' | 'approvedOnPanel' | null;
  panelistVotes: string[]; // Define as an array of strings
  publishingVotes: string[]; // Define as an array of strings
  course?: string;
  year?: number;
  handleNumber?: number;
  isApproved: boolean;
  chosenAdvisor: Schema.Types.ObjectId | null;
  advisorStatus: 'accepted' | 'declined' | 'pending' | null;
  declinedAdvisors: Schema.Types.ObjectId[];
  panelists: Schema.Types.ObjectId[];
  channelId?: string;
  groupMembers: string[];
  proposals: IProposal[];
  tasks: mongoose.Types.DocumentArray<ITask>; // Updated tasks array
}

const userSchema: Schema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['student', 'adviser'] },
  profileImage: { type: String, required: false },
  specializations: { type: [String], required: function() { return this.role === 'adviser'; } },
  manuscriptStatus: {
    type: String,
    enum: ['reviseOnAdvicer', 'readyToDefense', 'reviseOnPanelist', 'approvedOnPanel', null],
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
  isApproved: { type: Boolean, default: false },
  chosenAdvisor: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  advisorStatus: { type: String, enum: ['accepted', 'declined', 'pending', null] },
  declinedAdvisors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  panelists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  channelId: { type: String },
  groupMembers: { type: [String], required: function() { return this.role === 'student'; } },
  proposals: [{
    proposalTitle: { type: String, required: true },
    proposalText: { type: String, required: true },
    submittedAt: { type: Date, default: Date.now },
  }],
  tasks: [
    {
      _id: { type: Schema.Types.ObjectId, auto: true }, // Ensure `_id` is part of the schema
      taskTitle: { type: String, required: true },
      isCompleted: { type: Boolean, default: false },
    },
  ],
});

const User = model<IUser>('User', userSchema);

export default User;
