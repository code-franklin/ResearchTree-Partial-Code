import { Request, Response } from 'express';
import mongoose, { Document, ObjectId } from 'mongoose';
import User from '../models/User';
import { v4 as uuidv4 } from 'uuid'; // Using UUID to generate a unique channel ID
import { LanguageServiceClient } from '@google-cloud/language';

interface IAdvisor {
  id: string;
  specializations: string[];
}

interface IStudent extends Document {
  channelId: string;
  _id: ObjectId;
  advisorStatus: string;
  chosenAdvisor: ObjectId | null;
  declinedAdvisors: ObjectId[];
  panelists: ObjectId[];
}

const client = new LanguageServiceClient({
  keyFilename: process.env.GOOGLE_API_KEY,
});

// Function to analyze proposal text using Google Cloud NLP
const analyzeText = async (text: string) => {
  const document = {
    content: text,
    type: 'PLAIN_TEXT' as const, // Ensure this matches the expected types for Google Cloud NLP
  };

  const [result] = await client.analyzeEntities({ document });
  const entities = result.entities || [];

  return entities.map(entity => ({
    name: entity.name,
    type: entity.type,
    salience: entity.salience,
  }));
};

// Function to create a proposal
export const createProposal = async (req: Request, res: Response) => {
  const { userId, proposalTitle, proposalText } = req.body;

  if (!userId || !proposalTitle || !proposalText) {
    return res.status(400).json({ message: 'userId, proposalTitle, and proposalText are required' });
  }

  try {
    // Find the student by userId
    const student = await User.findById(userId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Prevent proposal submission if the advisor has already accepted
    if (student.advisorStatus === 'accepted') {
      return res.status(400).json({ message: 'Cannot submit proposal after advisor acceptance' });
    }

    // Generate a unique channelId
    const channelId = uuidv4();
    student.channelId = channelId;
    await student.save(); // Save the updated channelId to the student's record

    // Analyze the proposal text using Google NLP API
    const analysisResult = await analyzeText(proposalText);
    console.log('NLP Analysis Result:', analysisResult);

    // Get all approved advisors
    const advisors = await User.find({
      role: 'adviser',
      isApproved: true,
    });

// Updated the first error fix in the proposal matching logic
    const matchedAdvisors = advisors.filter(advisor => {
      return advisor.specializations.some(specialization =>
        analysisResult.some(entity => entity.name && entity.name.toLowerCase().includes(specialization.toLowerCase()))
      );
    });

    // Return the top 3 advisors based on the matching score
    const topAdvisors = matchedAdvisors.slice(0, 3);

    // Respond with the top advisors and channelId
    res.status(201).json({ topAdvisors, channelId });

  } catch (error) {
    console.error('Error creating proposal:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Function to update the proposal title
export const updateProposalTitle = async (req: Request, res: Response) => {
  const { userId, newProposalTitle } = req.body;

  if (!userId || !newProposalTitle) {
    return res.status(400).json({ message: 'userId and newProposalTitle are required' });
  }

  try {
    const student = await User.findById(userId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (!student.proposals || student.proposals.length === 0) {
      return res.status(400).json({ message: 'No proposal found for this student' });
    }

    // Update the title of the latest proposal
    student.proposals[student.proposals.length - 1].proposalTitle = newProposalTitle;
    await student.save();

    res.status(200).json({ message: 'Proposal title updated successfully' });
  } catch (error) {
    console.error('Error updating proposal title:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Function to choose an advisor
export const chooseAdvisor = async (req: Request, res: Response) => {
  const { studentId, advisorId } = req.body;

  if (!studentId || !advisorId) {
    return res.status(400).json({ message: 'studentId and advisorId are required' });
  }

  try {
    // Find the student and advisor
    const student = await User.findById(studentId);
    const advisor = await User.findById(advisorId);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    if (!advisor || advisor.role !== 'adviser') {
      return res.status(404).json({ message: 'Advisor not found' });
    }

    if (
      student.chosenAdvisor || 
      student.declinedAdvisors.includes(advisor._id as unknown as mongoose.Schema.Types.ObjectId)
    ) {
      return res.status(400).json({ message: 'You cannot choose this advisor' });
    }

    // Updated the third error fix in the advisor assignment logic
    student.chosenAdvisor = advisor._id as unknown as mongoose.Schema.Types.ObjectId;
    student.advisorStatus = 'pending'; // Set advisor status to pending
    await student.save();

    res.status(200).json({ message: 'Advisor chosen successfully' });
  } catch (error) {
    console.error('Error choosing advisor:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Fetch student's info and proposal details
export const getStudentInfoAndProposal = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId)
      .populate('chosenAdvisor')
      .populate('panelists');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const proposal = user.advisorStatus === 'accepted'
      ? user.proposals[user.proposals.length - 1] 
      : null;

    const response = {
      chosenAdvisor: user.chosenAdvisor,
      advisorStatus: user.advisorStatus,
      panelists: user.panelists,
      proposal: proposal ? {
        proposalTitle: proposal.proposalTitle,
        proposalText: proposal.proposalText,
        submittedAt: proposal.submittedAt
      } : null
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching student info and proposal:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
export const getTasks = async (req: Request, res: Response) => {
  const { studentId } = req.params; // Use studentId instead of taskId

  console.log('Received studentId:', studentId); // Log the received studentId

  try {
    // Find the student and populate tasks
    const student = await User.findById(studentId).select('tasks');
    
    if (!student) {
      console.log('No student found with studentId:', studentId);
      return res.status(404).json({ message: 'Student not found' });
    }

    // Return the tasks
    res.status(200).json({ tasks: student.tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const markTaskAsCompleted = async (req: Request, res: Response) => {
  const { taskId } = req.params;

  try {
    // Find the student with the specific task
    const student = await User.findOne({ 'tasks._id': taskId });
    if (!student) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Use Mongoose's .id() method to find the task by its _id
    const task = student.tasks.id(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Mark task as completed
    task.isCompleted = true;
    console.log('Task before saving:', task); // Log the task state
    await student.save();

    // After saving the student
    res.status(200).json({ message: 'Task marked as completed', task });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};