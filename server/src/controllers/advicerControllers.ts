import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User';
import Admin from '../models/Admin';
import Specialization from '../models/Specialization';
import path from 'path';
import fs from 'fs';
import Grade, { IGrade } from '../models/Grade';
import ArticlePDF from '../models/pdfDetails';

import dotenv from 'dotenv';

import { LanguageServiceClient } from '@google-cloud/language';

export const registration = async (req: Request, res: Response) => {
  const { name, email, password, role, course, year, handleNumber, groupMembers, design } = req.body;
  const specializations = JSON.parse(req.body.specializations);
  const profileImage = (req as any).file?.filename;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      profileImage,
      specializations,
      course, 
      year,  
      handleNumber, 
      groupMembers: JSON.parse(groupMembers), 
      design, 
      isApproved: false,
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully. Awaiting admin approval.' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error });
  }
};



export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      if (!user.isApproved) {
          return res.status(403).json({ message: 'Your account has not been approved by the admin yet.' });
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
          return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Create the token with user info
      const token = jwt.sign(
          { id: user._id, email: user.email, role: user.role },
          process.env.JWT_SECRET as string,
          { expiresIn: '1h' }
      );

      // Send the token and user information
      res.status(200).json({ token, user });
  } catch (error) {
      console.error('Login Error:', error);
      res.status(500).json({ message: 'Something went wrong', error: (error as Error).message });
  }
};

export const editAdvicerProfile = async (req: Request, res: Response) => {
  const { id } = req.params; // Admin ID
  const { name, email, handleNumber, deleteProfileImage } = req.body; // Data from request body

  const specializations = Array.isArray(req.body.specializations) 
  ? req.body.specializations 
  : JSON.parse(req.body.specializations || "[]");

  const profileImage = (req as any).file?.filename; // Get new profile image if exists

  try {
    // Find the admin by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Advicer not found" });
    }

    // Prepare the update object conditionally
    const updateData: any = {
      name,
      email,
      handleNumber,
      specializations
    };

    if (deleteProfileImage) {
      // Check if profile image exists before deleting it
      if (user.profileImage) {
        const imagePath = path.join(__dirname, "../public/uploads", user.profileImage);
        // Remove the old image if it exists
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath); // Delete the old image file
        }
      }

      updateData.profileImage = ""; // Remove image from database
    }

    if (profileImage) {
      // If a new image is provided, update it
      updateData.profileImage = profileImage;
    }

    // Find the admin and update with new details
    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });

    res.json({ message: "User profile updated successfully", user: updatedUser });
    
  } catch (error) {
    console.error("Error updating User profile:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const resetAdvicerPassword = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({ message: "New password is required." });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User Student not found" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the password
    user.password = hashedPassword;

    // Save the updated admin
    await user.save();
    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
  };


/* ckeditor API */
export const getToken = async (req: Request, res: Response) => {
  const accessKey = process.env.ACCESS_KEY || 'OxD87DrWZyfxdTVpe4C0SA0BoHINXaKvHmnoBtwpNguQJP0e71DdVkwx3BUD';
  const environmentId = process.env.ENVIRONMENT_ID || 'WDEpU5WDnTLVaiP5CRd6';

  try {
    const userId = req.params.userId;
    console.log('Fetching user with ID:', userId);

    // Search for the user in both User and Admin collections
    const user = await User.findById(userId).exec();
    let userInfo;

    if (user) {
      // User found in the User collection
      userInfo = {
        email: user.email,
        name: user.name,
        role: user.role,
      };
    } else {
      // Search in the Admin collection if not found in User
      const admin = await Admin.findById(userId).exec();
      if (admin) {
        userInfo = {
          email: admin.email,
          name: admin.name,
        };
      } else {
        return res.status(404).send('User or Admin not found');
      }
    }

    const payload = {
      aud: environmentId,
      sub: userId,
      user: userInfo,
      auth: {
        collaboration: {
          '*': {
            role: 'writer',
          },
        },
      },
    };

    console.log('Payload for JWT:', payload);

    const token = jwt.sign(payload, accessKey, { algorithm: 'HS256', expiresIn: '24h' });
    res.send(token);
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).send('Error generating token');
  }
};


/* admin & advicer */
  export const listStudentsManage = async (req: Request, res: Response) => {
  const { advisorId } = req.params;

  try {
    const students = await User.find({ chosenAdvisor: advisorId, advisorStatus: { $exists: false } });
    res.status(200).json({ students });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/* admin & advicer */
export const updateStatusStudent = async (req: Request, res: Response) => {
  const { studentId, status } = req.body;

  if (!studentId || !status) {
    return res.status(400).json({ message: 'studentId and status are required' });
  }

  try {
    await User.findByIdAndUpdate(studentId, { advisorStatus: status });
    res.status(200).json({ message: 'Student status updated successfully' });
  } catch (error) {
    console.error('Error updating student status:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/* Specialization to choose */
export const getSpecializations = async (req: Request, res: Response) => {
  try {
    const specializations = await Specialization.find();
    res.status(200).json(specializations);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error });
  }
};


export const getAdviserStudents = async (req: Request, res: Response) => {
  const { advisorId } = req.params;

  try {
    // Fetch accepted students
    const acceptedStudents = await User.find(
      { chosenAdvisor: advisorId, advisorStatus: 'accepted', role: 'student' },
      'name groupMembers channelId panelists course profileImage manuscriptStatus proposals tasks'
    ).lean();

    // Map accepted students to include the latest proposal
    const studentData = await Promise.all(
      acceptedStudents.map(async (student) => {
        // Fetch panelist names
        const panelistNames = await User.find({ _id: { $in: student.panelists } }, 'name').lean();
        const panelistNameList = panelistNames.map((panelist) => panelist.name);

        const latestProposal = student.proposals.length > 0 ? student.proposals[student.proposals.length - 1] : null;

        return {
          _id: student._id,
          name: student.name,
          groupMembers: student.groupMembers,
          channelId: student.channelId,
          panelists: panelistNameList,
          course: student.course,
          profileImage: student.profileImage,
          manuscriptStatus: student.manuscriptStatus,
          chosenAdvisor: student.chosenAdvisor,
          proposalTitle: latestProposal ? latestProposal.proposalTitle : 'No proposal submitted',
          proposalText: latestProposal ? latestProposal.proposalText : 'No proposal submitted',
          submittedAt: latestProposal ? latestProposal.submittedAt : null,
        };
      })
    );

    // Fetch declined students with their proposals
    const declinedStudents = await User.find(
      { chosenAdvisor: advisorId, advisorStatus: 'declined', role: 'student' },
      'name proposals profileImage'
    ).lean();

    // Map declined students to include the latest proposal
    const declinedStudentData = declinedStudents.map((student) => {
      const latestProposal = student.proposals.length > 0 ? student.proposals[student.proposals.length - 1] : null;
      return {
        _id: student._id,
        name: student.name,
        profileImage: student.profileImage,
        proposalTitle: latestProposal ? latestProposal.proposalTitle : 'No proposal submitted',
        proposalText: latestProposal ? latestProposal.proposalText : 'No proposal submitted',
      };
    });

    // Fetch pending students with their proposals
    const studentsToManage = await User.find(
      { chosenAdvisor: advisorId, advisorStatus: 'pending', role: 'student' },
      'name proposals profileImage'
    ).lean();

    // Map pending students to include the latest proposal
    const pendingStudentData = await Promise.all(
      studentsToManage.map(async (student) => {
        const latestProposal = student.proposals.length > 0 ? student.proposals[student.proposals.length - 1] : null;
        return {
          _id: student._id,
          name: student.name,
          profileImage: student.profileImage,
          proposalTitle: latestProposal ? latestProposal.proposalTitle : 'No proposal submitted',
          proposalText: latestProposal ? latestProposal.proposalText : 'No proposal submitted',
        };
      })
    );

    // Send the response back to the client
    res.json({
      acceptedStudents: studentData,
      declinedStudents: declinedStudentData,
      pendingStudents: pendingStudentData,
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getPanelistStudents = async (req: Request, res: Response) => {
  const { advisorId } = req.params;

  try {
    // Fetch students where the advisor is a panelist and their advisorStatus is 'accepted'
    const panelistStudents = await User.find(
      { panelists: advisorId, advisorStatus: 'accepted' },
      'name groupMembers channelId course profileImage chosenAdvisor manuscriptStatus proposals panelists tasks'
    )
    .populate('chosenAdvisor', 'name profileImage') // Populate advisor's name and profile image
    .populate('panelists', 'name'); // Fetch names of panelists
    

    // Map through students and fetch names of the panelists
    const studentData = await Promise.all(
      panelistStudents.map(async (student) => {
        // Fetch panelist names
        const panelistNames = await User.find({ _id: { $in: student.panelists } }, 'name').lean();
        const panelistNameList = panelistNames.map((panelist) => panelist.name);

        const latestProposal = student.proposals.length > 0 ? student.proposals[student.proposals.length - 1] : null;

        return {
          _id: student._id,
          name: student.name,
          groupMembers: student.groupMembers,
          channelId: student.channelId,
          course: student.course,
          profileImage: student.profileImage,
          chosenAdvisor: student.chosenAdvisor,
          manuscriptStatus: student.manuscriptStatus,
          panelists: panelistNameList, // Return panelist names instead of IDs
          proposalTitle: latestProposal ? latestProposal.proposalTitle : 'No proposal submitted',
          submittedAt: latestProposal ? latestProposal.submittedAt : null,
          tasks: student.tasks,
        };
      })
    );

    res.status(200).json({ panelistStudents: studentData });
  } catch (error) {
    console.error('Error fetching panelist students:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Add a task for a student
export const postAddTaskMyAdvicee = async (req: Request, res: Response) => {
  const { studentId } = req.params;
  const { taskTitle } = req.body;

  try {
    // Find the student by ID
    const student = await User.findById(studentId);
    
    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Add the new task to the student's tasks array
    student.tasks.push({ taskTitle, isCompleted: false });
    
    // Save the updated student
    await student.save();

    res.status(200).json({ message: 'Task added successfully', tasks: student.tasks });
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTasksMyAdvicee = async (req: Request, res: Response) => {
  const { studentId } = req.params;

  try {
    // Log studentId for debugging
    console.log(`Fetching tasks for studentId: ${studentId}`);

    // Find the student by ID
    const student = await User.findById(studentId).select('tasks role');

    if (!student) {
      return res.status(404).json({ message: 'Student not found in the database' });
    }

    if (student.role !== 'student') {
      return res.status(403).json({ message: 'User is not a student' });
    }

    // Send the tasks as the response
    res.status(200).json({ tasks: student.tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTasksProgressStudent = async (req: Request, res: Response) => {
  const { studentId } = req.params;

  try {
    // Find the student by ID and select tasks and role fields
    const student = await User.findById(studentId).select('tasks role');

    // Check if student exists and has the role of 'student'
    if (!student) {
      return res.status(404).json({ message: 'Student not found in the database' });
    }

    if (student.role !== 'student') {
      return res.status(403).json({ message: 'User is not a student' });
    }

    // Calculate task completion progress
    const totalTasks = student.tasks.length;
    const completedTasks = student.tasks.filter(task => task.isCompleted).length;

    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Send the progress percentage as the response
    res.status(200).json({ progress });
  } catch (error) {
    console.error('Error fetching task progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
};




export const deleteTaskFromStudent = async (req: Request, res: Response) => {
  const { studentId, taskId } = req.params;

  try {
    // Find the student by ID
    const student = await User.findById(studentId);

    // Check if student exists
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Find the task by `taskId`
    const taskIndex = student.tasks.findIndex((task) => task._id.toString() === taskId);
    if (taskIndex === -1) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Remove the task
    student.tasks.splice(taskIndex, 1);
    await student.save();

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Failed to delete task' });
  }
};



  
// Function to update manuscript status for a student
export const updateManuscriptStatus = async (req: Request, res: Response) => {
  const { channelId, manuscriptStatus } = req.body;  // Frontend sends `channelId` of the student and new manuscript status

  try {
    // Find the student by channelId and update their manuscriptStatus
    const student = await User.findOneAndUpdate(
      { _id: channelId },  // `channelId` should be the student's ID
      { manuscriptStatus },
      { new: true }  // Return the updated document
    );

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Respond with success and the updated student data
    res.status(200).json({
      message: 'Manuscript status updated successfully',
      student,
    });

    console.log('Received ManuscriptStatus:', manuscriptStatus);

  } catch (error) {
    console.error('Error updating manuscript status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updatePanelManuscriptStatus = async (req: Request, res: Response) => {
  const { channelId, manuscriptStatus, userId } = req.body;

  try {
    const student = await User.findById(channelId);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    let remainingVotes;

    if (manuscriptStatus === 'Revise on Panelist') {
      // Check if user has already voted in panelistVotes
      if (student.panelistVotes.includes(userId)) {
        return res.status(400).json({ message: 'You have already voted for revise on panelist' });
      }

      // Add userId to panelistVotes and calculate remaining votes
      student.panelistVotes.push(userId);
      remainingVotes = 4 - student.panelistVotes.length;

      // Update status if 3 unique panelists have voted for 'Revise on Panelist'
      if (student.panelistVotes.length === 4) {
        student.manuscriptStatus = 'Revise on Panelist';
      }

    } else if (manuscriptStatus === 'Approved on Panel') {
      // Check if user has already voted in publishingVotes
      if (student.publishingVotes.includes(userId)) {
        return res.status(400).json({ message: 'You have already voted for approval on panel' });
      }

      // Add userId to publishingVotes and calculate remaining votes
      student.publishingVotes.push(userId);
      remainingVotes = 5 - student.publishingVotes.length;

      // Update status if 4 unique panelists have voted for 'Approved on Panel'
      if (student.publishingVotes.length === 5) {
        student.manuscriptStatus = 'Approved on Panel';
      }

    } else {
      // Directly update manuscript status for non-voting actions
      student.manuscriptStatus = manuscriptStatus;
    }

    await student.save();

    res.status(200).json({
      message: 'Manuscript status updated successfully',
      student,
      remainingVotes,
    });

  } catch (error) {
    console.error('Error updating manuscript status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


/* accepted opr declined the student */

export const respondToStudent = async (req: Request, res: Response) => {
  const { studentId, advisorId, status } = req.body;

  if (!studentId || !advisorId || !status) {
    return res.status(400).json({ message: 'studentId, advisorId, and status are required' });
  }

  try {
    const student = await User.findById(studentId);
    if (!student || !student.chosenAdvisor || student.chosenAdvisor.toString() !== advisorId) {
      return res.status(404).json({ message: 'Student not found or advisor mismatch' });
    }
    
    student.advisorStatus = status;
    await student.save();
    
    res.status(200).json({ message: `Student ${status} successfully` });
  } catch (error) {
    console.error('Error responding to student:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Function to grade a student
export const gradePanelToStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId, panelistId, gradingRubric } = req.body;

    // Ensure that the rubric contains the full set of grading criteria
    const grade = new Grade({
      studentId,
      panelistId,
      grades: gradingRubric, // gradingRubric should contain research, presentation, content, etc.
      dateGraded: new Date(),
    });

    await grade.save();
    res.status(200).json({ message: 'Grading submitted successfully' });
  } catch (error) {
    console.error('Error grading student:', error);
    res.status(500).json({ message: 'Failed to submit grading' });
  }
};


dotenv.config(); // This loads the variables from your .env file

const client = new LanguageServiceClient({
  // If you have an API key, you can provide it here
  apiKey: 'AIzaSyBqx-4PSSfP-vZBhBBgmu4uxmftsHLfTfE',
});





export const getAllArticles = async (req: Request, res: Response): Promise<void> => {
  try {
      const articles = await ArticlePDF.find({}, 'title authors dateUploaded datePublished pdf');
      res.status(200).json(articles);
  } catch (error) {
      if (error instanceof Error) {
          res.status(500).json({ message: error.message });
      } else {
          res.status(500).json({ message: 'An unknown error occurred.' });
      }
  }
};

// Synonym Schema
const searchSynonymSchema = new mongoose.Schema({
  searchTerm: { type: String, required: true },
  searchSynonyms: [String],
});

interface SearchSynonymDocument extends mongoose.Document {
  searchTerm: string;
  searchSynonyms: string[];
}

const Synonym = mongoose.model<SearchSynonymDocument>('SynonymSearch', searchSynonymSchema);

// POST route to add new synonyms training
export const postSynonyms = async (req: Request, res: Response) => {
  const { searchTerm, searchSynonyms } = req.body;

  if (!searchTerm || !searchSynonyms) {
    return res.status(400).json({ message: 'Both Search Term and Search Synonyms are required.' });
  }

  try {
    let synonymEntry = await Synonym.findOne({ searchTerm });

    if (synonymEntry) {
      synonymEntry.searchSynonyms = Array.from(new Set([...synonymEntry.searchSynonyms, ...searchSynonyms]));
      await synonymEntry.save();
    } else {
      synonymEntry = new Synonym({ searchTerm, searchSynonyms });
      await synonymEntry.save();
    }

    res.status(201).json({ message: 'Search Synonyms added successfully', data: synonymEntry });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getSynonymsTerm = async (req: Request, res: Response) => {
  try {
    const { searchTerm } = req.params;
    const synonymEntry = await Synonym.findOne({ searchTerm });

    if (synonymEntry) {
      res.json(synonymEntry.searchSynonyms);
    } else {
      res.status(404).json({ message: 'No Search Synonyms found for this Search Term' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Helper function to get synonyms for entities
async function expandEntitiesWithSynonyms(entities: string[]): Promise<string[]> {
  const expandedTerms = new Set<string>();

  for (const searchTerm of entities) {
    expandedTerms.add(searchTerm);
    const synonymEntry = await Synonym.findOne({ searchTerm });
    if (synonymEntry) {
      synonymEntry.searchSynonyms.forEach((synonym: string) => expandedTerms.add(synonym));
    }
  }

  return Array.from(expandedTerms);
}
export const postSearch = async (req: Request, res: Response) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).send("Query is required for search.");
  }

  try {
    const document = { content: query, type: "PLAIN_TEXT" as const };
    const [result] = await client.analyzeEntities({ document });

    // Safely handle entities array and ensure no undefined values
    const entities = result.entities
      ?.map(entity => entity.name?.toLowerCase())
      .filter((name): name is string => Boolean(name)) || [];

    console.log("Identified entities:", entities);

    // Fetch synonyms for each entity and expand the search terms
    const expandedQueryTerms = await expandEntitiesWithSynonyms(entities);
    console.log("Expanded search terms:", expandedQueryTerms);

    // Search the database for matching terms
    const searchResults = await PdfSchema.find({
      $or: [
        { keywords: { $in: expandedQueryTerms } },
        { title: { $regex: expandedQueryTerms.join("|"), $options: "i" } },
        { authors: { $regex: expandedQueryTerms.join("|"), $options: "i" } }
      ]
    });

    if (searchResults.length > 0) {
      return res.status(200).json({
        status: "ok",
        results: searchResults,
        synonyms: expandedQueryTerms, // Include synonyms in the response
      });
    } else {
      return res.status(404).json({ status: "not found", message: "No documents found." });
    }
  } catch (error) {
    console.error("Error with Google NLP or searching documents:", error);
    return res.status(500).send("Error analyzing or searching documents.");
  }
};

import PdfSchema from '../models/pdfDetails'; 

export const postUploadFiles = async (req: Request, res: Response) => {
  const { title, authors, dateUploaded, datePublished } = req.body;
  const fileName = req.file?.filename;

  try {
    await PdfSchema.create({
      title,
      authors,
      dateUploaded,
      datePublished,
      pdf: fileName,
    });
    res.send({ status: "ok" });
  } catch (error) {
    res.json({ status: (error as Error).message });
  }
};

export const getFiles = async (req: Request, res: Response) => {
  try {
    const data = await PdfSchema.find({});
    res.send({ status: "ok", data });
  } catch (error) {
    res.json({ status: (error as Error).message });
  }
};

// Giving sentimentscore
export const postAnalyze = async (req: Request, res: Response) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).send("Text is required for analysis.");
  }

  try {
    const document = { content: text, type: "PLAIN_TEXT" as const };
    const [result] = await client.analyzeSentiment({ document });
    res.status(200).json({
      sentimentScore: result.documentSentiment?.score,
      sentimentMagnitude: result.documentSentiment?.magnitude,
    });
  } catch (error) {
    console.error("Error analyzing text:", error);
    res.status(500).send("Error analyzing text.");
  }
};