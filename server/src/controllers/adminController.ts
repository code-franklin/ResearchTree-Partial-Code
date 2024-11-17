import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin';
import User from '../models/User'
import Specialization from '../models/Specialization';  
import PdfDetails from "../models/pdfDetails";
import path from 'path';
import fs from 'fs';


const JWT_SECRET = 'your_jwt_secret';

export const registerAdmin = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const profileImage = req.file ? `/public/uploads/${req.file.filename}` : undefined;

  // Manually check if all required fields are present
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please include all fields' });
  }

  try {
    let admin = await Admin.findOne({ email });

    if (admin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    admin = new Admin({
      name,
      email,
      password: hashedPassword,
      profileImage
    });

    await admin.save();

    const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const loginAdmin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ 
      token, 
      user: { 
        id: admin._id, // Add this line
        name: admin.name, 
        email: admin.email, 
        profileImage: admin.profileImage 
      } 
    });
    
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const editAdminProfile = async (req: Request, res: Response) => {
  const { id } = req.params; // Admin ID
  const { name, email, deleteProfileImage } = req.body; // Data from request body

  const profileImage = (req as any).file?.filename; // Get new profile image if exists

  try {
    // Find the admin by ID
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Prepare the update object conditionally
    const updateData: any = {
      name,
      email,
    };

    if (deleteProfileImage) {
      // Check if profile image exists before deleting it
      if (admin.profileImage) {
        const imagePath = path.join(__dirname, "../public/uploads", admin.profileImage);
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
    const updatedAdmin = await Admin.findByIdAndUpdate(id, updateData, { new: true });

    res.json({ message: "Admin profile updated successfully", admin: updatedAdmin });
    
  } catch (error) {
    console.error("Error updating admin profile:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const resetAdminPassword = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({ message: "New password is required." });
  }

  try {
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the password
    admin.password = hashedPassword;

    // Save the updated admin
    await admin.save();
    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
  };


export const approveUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const user = await User.findByIdAndUpdate(userId, { isApproved: true }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User approved', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const declineUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User declined and removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


export const getPendingUsersAdvicer = async (req: Request, res: Response) => {
  try {
    // Fetch users who are advisers and not approved
    const users = await User.find({ isApproved: false, role: 'adviser' });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getPendingUsersStudent = async (req: Request, res: Response) => {
  try {
    const users = await User.find({ isApproved: false });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getAllUsersStudent = async (req: Request, res: Response) => {
  try {
    const users = await User.find({role: 'student', isApproved: true});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getAllUsersAdvicer = async (req: Request, res: Response) => {
  try {
    const users = await User.find({role: 'adviser', isApproved: true});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update or delete profile image
export const updateUserStudent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, course, groupMembers, deleteProfileImage } = req.body;
  const profileImage = (req as any).file?.filename;

  try {
    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prepare the update object conditionally
    const updateData: any = {
      name,
      email,
      course,
      groupMembers,
    };

    if (deleteProfileImage) {
      // If we need to delete the profile image
      const imagePath = path.join(__dirname, "../public/uploads", user.profileImage);
      // Remove the old image if it exists
      if (user.profileImage && fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      updateData.profileImage = ""; // Remove image from database
    }

    if (profileImage) {
      // If a new image is provided, update it
      updateData.profileImage = profileImage;
    }

    // Find the user and update with new details
    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });

    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateUserAdvicer = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, handleNumber, design, deleteProfileImage } = req.body;

  // Parse specializations safely
  const specializations = Array.isArray(req.body.specializations) 
  ? req.body.specializations 
  : JSON.parse(req.body.specializations || "[]");

  const profileImage = (req as any).file?.filename;

  try {
    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Advicer not found" });
    }

    // Prepare the update object conditionally
    const updateData: any = {
      name,
      email,
      handleNumber,
      design,
      specializations, // Ensure this is an array
    };

    if (deleteProfileImage) {
      // If we need to delete the profile image
      const imagePath = path.join(__dirname, "../public/uploads", user.profileImage);
      // Remove the old image if it exists
      if (user.profileImage && fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      updateData.profileImage = ""; // Remove image from database
    }

    if (profileImage) {
      // If a new image is provided, update it
      updateData.profileImage = profileImage;
    }

    // Find the user and update with new details
    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });

    res.json({ message: "User updated successfully", user: updatedUser });
    
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


export const resetUserPassword = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({ message: "New password is required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await User.findByIdAndUpdate(id, { password: hashedPassword });
    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Server error", error });
  }
};



export const getSpecializations = async (req: Request, res: Response) => {
  try {
    const specializations = await Specialization.find();
    res.status(200).json(specializations);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error });
  }
};

export const addSpecialization = async (req: Request, res: Response) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Specialization name is required' });
  }

  try {
    const newSpecialization = new Specialization({ name });
    await newSpecialization.save();
    res.status(201).json(newSpecialization);
  } catch (error) {
    console.error('Error adding specialization:', error);
    res.status(500).json({ message: 'Something went wrong', error });
  }
};


export const updateSpecialization = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const updatedSpecialization = await Specialization.findByIdAndUpdate(id, { name }, { new: true });
    res.status(200).json(updatedSpecialization);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error });
  }
};

export const deleteSpecialization = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await Specialization.findByIdAndDelete(id);
    res.status(200).json({ message: 'Specialization deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error });
  }
};


// View Analytics

export const countReadyToDefenseManuscripts = async (req: Request, res: Response): Promise<void> => {
  try {
    // Query to count documents with manuscriptStatus set to 'ready to defense'
    const count = await User.countDocuments({ manuscriptStatus: 'Ready to Defense' });
    res.status(200).json({ totalReadyToDefense: count });
  } catch (error) {
    console.error('Error counting Ready to Defense manuscripts:', error);
    res.status(500).json({ message: 'Server error while counting manuscripts' });
  }
};
export const countReviseOnAdvicerManuscripts = async (req: Request, res: Response): Promise<void> => {
  try {
    // Query to count documents with manuscriptStatus set to 'revise on advicer'
    const count = await User.countDocuments({ manuscriptStatus: 'Revise On Advicer' });
    res.status(200).json({ totalReviseOnAdvicer: count });
  } catch (error) {
    console.error('Error counting Revise on Advicer manuscripts:', error);
    res.status(500).json({ message: 'Server error while counting manuscripts' });
  }
};

export const countReviseOnAPanelManuscripts = async (req: Request, res: Response): Promise<void> => {
  try {
    // Query to count documents with manuscriptStatus set to 'revise on panel'
    const count = await User.countDocuments({ manuscriptStatus: 'Revise on Panelist' });
    res.status(200).json({ totalReviseOnPanel: count });
  } catch (error) {
    console.error('Error counting Ready on Panelist manuscripts:', error);
    res.status(500).json({ message: 'Server error while counting manuscripts' });
  }
};

export const countApprovedOnPanelManuscripts = async (req: Request, res: Response): Promise<void> => {
  try {
    // Query to count documents with manuscriptStatus set to 'Ready to Defense'
    const count = await User.countDocuments({ manuscriptStatus: 'Approved on Panel' });
    res.status(200).json({ totalApprovedOnPanel: count });
  } catch (error) {
    console.error('Error counting Approved on Panel manuscripts:', error);
    res.status(500).json({ message: 'Server error while counting manuscripts' });
  }
};

export const fetchAllStudentManuscript = async (req: Request, res: Response) => {
  try {
    // Fetch students with relevant manuscript and proposal data
    const students = await User.find(
      { role: 'student' }, 
      'name groupMembers channelId panelists course profileImage manuscriptStatus proposals tasks advisorStatus'
    ).lean();

    // Process each student to include panelist names and latest proposal details
    const studentData = await Promise.all(students.map(async (student) => {
      const panelistNames = await User.find({ _id: { $in: student.panelists } }, 'name').lean();
      const panelistNameList = panelistNames.map(panelist => panelist.name);
      
      const latestProposal = student.proposals.length > 0 
        ? student.proposals[student.proposals.length - 1] 
        : null;

      return {
        _id: student._id,
        name: student.name,
        groupMembers: student.groupMembers,
        channelId: student.channelId,
        panelists: panelistNameList,
        course: student.course,
        profileImage: student.profileImage,
        manuscriptStatus: student.manuscriptStatus,
        advisorStatus: student.advisorStatus,
        proposalTitle: latestProposal ? latestProposal.proposalTitle : 'No proposal submitted',
        proposalText: latestProposal ? latestProposal.proposalText : 'No proposal submitted',
        submittedAt: latestProposal ? latestProposal.submittedAt : null,
        tasks: student.tasks,
      };
    }));

    res.status(200).json({ success: true, students: studentData });
  } catch (error) {
    console.error("Error fetching student manuscripts:", error);
    res.status(500).json({ success: false, message: "Failed to fetch student manuscripts", error });
  }
};

// Advicer
export const fetchAdviserInfoWithStudents = async (req: Request, res: Response) => {
  try {
    // Find users with role 'adviser'
    const advisers = await User.find({ role: 'adviser' }, 'name profileImage specializations role');

    // Attach students for each adviser
    const advisersWithStudents = await Promise.all(advisers.map(async adviser => {
      const students = await User.find(
        { chosenAdvisor: adviser._id, advisorStatus: 'accepted', role: 'student' },
        'name groupMembers channelId panelists course profileImage manuscriptStatus proposals tasks'
      ).lean();

      // Process student data to include panelist names and proposals
      const studentData = await Promise.all(students.map(async (student) => {
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
          task: student.tasks,
        };
      }));

      return {
        ...adviser.toObject(),
        students: studentData, // Attach the students to the adviser
      };
    }));

    res.status(200).json({ success: true, advisers: advisersWithStudents });
  } catch (error) {
    console.error("Error fetching advisers with students:", error);
    res.status(500).json({ success: false, message: "Failed to fetch advisers" });
  }
};

// Panelist
export const fetchPanelistInfoWithStudents = async (req: Request, res: Response) => {
  try {
    // Step 1: Find all advisors
    const panelist = await User.find({ role: 'adviser' }, 'name profileImage specializations'); // Make sure 'adviser' is the correct role

    // Step 2: Fetch students for each advisor where they are a panelist and advisorStatus is 'accepted'
    const advisorsWithPanelistStudents = await Promise.all(panelist.map(async (panelist) => {
      const panelistStudents = await User.find(
        { panelists: panelist._id, advisorStatus: 'accepted', role: 'student' }, // Check if advisorStatus 'accepted' condition is being met
        'name groupMembers channelId course profileImage chosenAdvisor manuscriptStatus proposals panelists tasks'
      ).lean();

      // Step 3: Process each student to include panelist names and latest proposal information
      const panelistStudentData = await Promise.all(panelistStudents.map(async (student) => {
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
          manuscriptStatus: student.manuscriptStatus,
          chosenAdvisor: student.chosenAdvisor,
          panelists: panelistNameList, // Return panelist names instead of IDs
          proposalTitle: latestProposal ? latestProposal.proposalTitle : 'No proposal submitted',
          submittedAt: latestProposal ? latestProposal.submittedAt : null,
          tasks: student.tasks,
        };
      }));

      return {
        ...panelist.toObject(),
        panelistStudents: panelistStudentData // Attach panelist students to each advisor
      };
    }));
    
    res.status(200).json({ success: true, advisors: advisorsWithPanelistStudents });
  } catch (error) {
    console.error("Error fetching panelist information with students:", error);
    res.status(500).json({ success: false, message: "Failed to fetch panelist information" });
  }
};

// Data Visualization

// Controller function to get the count of PdfDetails
export const getPdfDetailsCount = async (req: Request, res: Response) => {
  try {
    // Count the total number of PdfDetails documents in the collection
    const count = await PdfDetails.countDocuments();
    
    // Send the count in the response
    res.status(200).json({ count });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error fetching PdfDetails count:", error);
    res.status(500).json({ error: "Failed to fetch PdfDetails count" });
  }
};