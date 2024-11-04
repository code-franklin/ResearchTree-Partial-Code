import { Request, Response } from 'express';
import mongoose, { Document, ObjectId } from 'mongoose';
import User from '../models/User';
import { v4 as uuidv4 } from 'uuid'; // Using UUID to generate a unique channel ID

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

let NlpManager: any;

// Function to dynamically load NlpManager
const loadNlpManager = async () => {
  const nlpModule = await import('node-nlp');
  NlpManager = nlpModule.NlpManager;
};

// Load NlpManager at the start
loadNlpManager().catch(err => console.error('Failed to load NlpManager:', err));

const getTopAdvisors = async (): Promise<IAdvisor[]> => {
  const advisors = await User.find({ role: 'adviser', isApproved: true }).limit(5);
  return advisors.map(advisor => ({
    id: (advisor._id as unknown as string).toString(),
    specializations: advisor.specializations,
  }));
};
// Refine analyzeProposal function for better NLP matching
const analyzeProposal = async (proposalTitle: string, proposalText: string, advisors: IAdvisor[]): Promise<IAdvisor[]> => {
  if (!NlpManager) {
    throw new Error("NlpManager is not loaded yet.");
  }

  const manager = new NlpManager({ languages: ['en'], forceNER: true });

  // Adding documents based on specializations and proposal title
  advisors.forEach((advisor: IAdvisor) => {
    advisor.specializations.forEach((specialization: string) => {
      manager.addDocument('en', `I am researching ${specialization}`, advisor.id);
      manager.addDocument('en', `My research focuses on ${specialization}`, advisor.id);
      manager.addDocument('en', `I need help with ${specialization}`, advisor.id);
      manager.addDocument('en', `${specialization} is my primary research area`, advisor.id);
      // Add documents based on proposal title
      manager.addDocument('en', `My proposal title is ${proposalTitle}`, advisor.id);
    });
  });

  await manager.train();

  const response = await manager.process('en', proposalText);
  const classifiedAdvisors = response.classifications.map((classification: any) => ({
    id: classification.intent,
    score: classification.score,
  }));

  classifiedAdvisors.sort((a: any, b: any) => b.score - a.score);

  // Map classifications back to advisor objects and filter top matches
  const topAdvisors = classifiedAdvisors
    .map((classifiedAdvisor: any) => advisors.find((advisor: IAdvisor) => advisor.id === classifiedAdvisor.id))
    .filter((advisor: IAdvisor | undefined): advisor is IAdvisor => advisor !== undefined);

  return topAdvisors.slice(0, 5); // Return top 5 matching advisors
};

export const createProposal = async (req: Request, res: Response) => {
  const { userId, proposalTitle, proposalText } = req.body;

  if (!userId || !proposalTitle || !proposalText) {
    return res.status(400).json({ message: 'userId, proposalTitle and proposalText are required' });
  }

  try {
    // Ensure NLP manager is loaded
    await loadNlpManager();

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

    // Create a new proposal object
    const newProposal = {
      proposalTitle, // Add proposalTitle to the object
      proposalText,
      submittedAt: new Date()
    };

    // Add the new proposal to the user's proposals array
    student.proposals.push(newProposal);
    await student.save(); // Save the updated student record

    // Fetch advisors excluding those the student has declined
    const declinedAdvisors = student.declinedAdvisors || [];
    const advisors = await User.find({
      role: 'adviser',
      isApproved: true,
      _id: { $nin: declinedAdvisors }
    });

    // Analyze proposal and get top advisors based on specialization matching
    const topAdvisors = await analyzeProposal(proposalTitle, proposalText, advisors as IAdvisor[]);

    // Respond with the top advisors and channelId
    res.status(201).json({ topAdvisors, channelId });

  } catch (error) {
    console.error('Error creating proposal:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getStudentInfoAndProposal = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId; // Assuming you're passing the userId as a parameter

    const user = await User.findById(userId)
      .populate('chosenAdvisor')
      .populate('panelists');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if advisor is accepted before fetching the proposal
    const proposal = user.advisorStatus === 'accepted'
      ? user.proposals[user.proposals.length - 1] // Get the latest proposal
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


export const getTasks = async (req: Request, res: Response) => {
  const { userId } = req.params; // Use studentId instead of taskId

  console.log('Received studentId:', userId); // Log the received studentId

  try {
    // Find the student and populate tasks
    const student = await User.findById(userId).select('tasks');
    
    if (!student) {
      console.log('No student found with studentId:', userId);
      return res.status(404).json({ message: 'Student not found' });
    }

    // Return the tasks
    res.status(200).json({ tasks: student.tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Endpoint to get task progress
export const getTaskProgress = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const student = await User.findById(userId).select('tasks');
    if (!student || student.tasks.length === 0) {
      return res.status(404).json({ message: 'No tasks found for this student' });
    }

    // Calculate completed task percentage
    const completedTasks = student.tasks.filter((task) => task.isCompleted).length;
    const totalTasks = student.tasks.length;
    const progress = Math.round((completedTasks / totalTasks) * 100); 

    res.status(200).json({ progress });
  } catch (error) {
    console.error('Error fetching task progress:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateProposalTitle = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const { newTitle } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.advisorStatus !== 'accepted') {
      return res.status(403).json({ message: 'Proposal cannot be edited' });
    }

    user.proposals[user.proposals.length - 1].proposalTitle = newTitle;
    await user.save();

    res.status(200).json({
      proposalTitle: user.proposals[user.proposals.length - 1].proposalTitle,
    });
  } catch (error) {
    console.error('Error updating proposal title:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const chooseAdvisor = async (req: Request, res: Response) => {
  const { userId, advisorId } = req.body;

  if (!userId || !advisorId) {
    return res.status(400).json({ message: 'userId and advisorId are required' });
  }

  try {
    const student = await User.findById(userId) as IStudent | null;
    if (student?.chosenAdvisor && student.advisorStatus !== 'declined') {
      return res.status(400).json({ message: 'Advisor already chosen' });
    }

    const topAdvisors = await getTopAdvisors();
    const panelists = topAdvisors.filter(advisor => advisor.id !== advisorId).slice(0, 3);

    if (student) {
      student.chosenAdvisor = advisorId;
      student.advisorStatus = 'pending';
      student.panelists = panelists.map(panelist => new mongoose.Types.ObjectId(panelist.id) as unknown as ObjectId);
      await student.save();
    }

    res.status(200).json({ message: 'Advisor chosen and panelists assigned successfully', student });
  } catch (error) {
    console.error('Error choosing advisor:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


// FOR STUDENT FETCHING THERE OWN ADVICER+

/* export const getStudentAdvisorInfo = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const student = await User.findById(userId).populate('chosenAdvisor').populate('panelists');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json({ chosenAdvisor: student.chosenAdvisor, advisorStatus: student.advisorStatus, panelists: student.panelists });
  } catch (error) {
    console.error('Error fetching student advisor info:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}; */

// Training Endpoint
export const trainModel = async (req: Request, res: Response) => {
  const { language, data } = req.body; // Extracting language and data

  try {
    if (!NlpManager) {
      throw new Error("NlpManager is not loaded yet.");
    }

    const manager = new NlpManager({ languages: ['en'], forceNER: true });

    // Check if data is an array and contains training entries
    if (language && Array.isArray(data)) {
      data.forEach(({ text, sentiment, specializations, keywords }) => {
        if (text && sentiment && Array.isArray(specializations) && Array.isArray(keywords)) {
          manager.addDocument(language, text, sentiment);

          specializations.forEach(spec => {
            const keywordText = `This proposal is related to ${spec} and involves ${keywords.join(', ')}`;
            console.log('Adding document:', keywordText);
            manager.addDocument(language, keywordText, sentiment);
          });
        } else {
          throw new Error('Invalid input data for a specific training entry.');
        }
      });
    } else {
      throw new Error('Invalid input data.');
    }

    await manager.train();
    manager.save();

    res.json({ message: 'Training data with keywords added successfully!' });
  } catch (error) {
    console.error('Error training model:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
          