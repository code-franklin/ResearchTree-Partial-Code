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
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: 'student' | 'adviser';
  profileImage: string;
  specializations: string[];
  manuscriptStatus: 'Revise On Advicer' | 'Ready to Defense' | 'Revise on Panelist' | 'Approved on Panel' | null;
  panelistVotes: string[]; // Define as an array of strings
  publishingVotes: string[]; // Define as an array of strings
  course?: string;
  year?: number;
  handleNumber?: number;
  acceptedStudents: IUser[];
  isApproved: boolean;
  chosenAdvisor: Schema.Types.ObjectId | null;
  advisorStatus: 'accepted' | 'declined' | 'pending' | null;
  declinedAdvisors: Schema.Types.ObjectId[];
  panelists: IUser[];
  channelId?: string;
  design: 'Subject Expert' | 'Statistician' | 'Technical Expert';
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
  acceptedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // list of accepted students
  isApproved: { type: Boolean, default: false },
  chosenAdvisor: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  advisorStatus: { type: String, enum: ['accepted', 'declined', 'pending', null] },
  declinedAdvisors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  panelists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  channelId: { type: String },
  design: { type: String, enum: ['Subject Expert', 'Statistician', 'Technical Expert'] },
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
