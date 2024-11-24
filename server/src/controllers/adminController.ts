import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin';
import User from '../models/User'
import Specialization from '../models/Specialization';  
import PdfDetails from "../models/pdfDetails";
import Rubric from "../models/Rubric";
import path from 'path';
import fs from 'fs';
import Grading from '../models/Grading';


const JWT_SECRET = 'your_jwt_secret';


export const fetchGrades = async (req: Request, res: Response) => {
  const { studentId } = req.params; // Fetch studentId from route params

  try {
    // Check if the student exists
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    // Fetch all grades for the student, graded by different panelists
    const grading = await Grading.find({ studentId }) // Query grades for the student
      .populate('studentId', 'name email profileImage') // Populate student details
      .populate('panelistId', 'name email profileImage') // Populate panelist/adviser details
      .populate('rubricId', 'rubricName criteria') // Populate rubric details
      .exec();

    // If no grades are found
    if (grading.length === 0) {
      return res.status(404).json({ message: 'No grades found for this student.' });
    }

    // Compute total grades and overall grade labels for each grade record
    const enrichedGrades = grading.map((grade) => {
      const totalGradeValue = grade.grades.reduce(
        (sum: number, g: { gradeValue: number }) => sum + g.gradeValue,
        0
      );

      let overallGradeLabel = '';
      if (totalGradeValue >= 16 && totalGradeValue <= 20) {
        overallGradeLabel = 'Excellent';
      } else if (totalGradeValue >= 11 && totalGradeValue <= 15) {
        overallGradeLabel = 'Good';
      } else if (totalGradeValue >= 6 && totalGradeValue <= 10) {
        overallGradeLabel = 'Satisfactory';
      } else if (totalGradeValue >= 1 && totalGradeValue <= 5) {
        overallGradeLabel = 'Needs Improvement';
      }

      return {
        ...grade.toObject(),
        totalGradeValue,
        overallGradeLabel,
      };
    });

    // Return enriched grades with all panelist contributions
    res.status(200).json(enrichedGrades);
  } catch (error) {
    console.error('Error fetching grades:', error);
    res.status(500).json({ error: 'Failed to fetch grades.' });
  }
};

// Backup for Adviser view student grade
export const fetchAdviseStudentGrades = async (req: Request, res: Response) => {
  const { panelistId } = req.params; // Fetch adviserId from route params

  try {
    // Check if the adviser exists
    const adviser = await User.findById(panelistId);
    if (!adviser) {
      return res.status(404).json({ message: 'Panel not found.' });
    }

    // Fetch grades for students graded by this adviser
    const grading = await Grading.find({ panelistId: panelistId }) // Query based on adviserId
      .populate('studentId', 'name email profileImage') // Populate student details
      .populate('panelistId', 'name email profileImage') // Populate adviser details
      .populate('rubricId', 'title criteria')
      .exec();

    // If no grades are found
    if (grading.length === 0) {
      return res.status(404).json({ message: 'No grades found for this panel.' });
    }

    // Compute total grades and overall grade labels
    const enrichedGrades = grading.map((grade) => {
      const totalGradeValue = grade.grades.reduce(
        (sum: number, g: { gradeValue: number }) => sum + g.gradeValue,
        0
      );

      let overallGradeLabel = '';
      if (totalGradeValue >= 16 && totalGradeValue <= 20) {
        overallGradeLabel = 'Excellent';
      } else if (totalGradeValue >= 11 && totalGradeValue <= 15) {
        overallGradeLabel = 'Good';
      } else if (totalGradeValue >= 6 && totalGradeValue <= 10) {
        overallGradeLabel = 'Satisfactory';
      } else if (totalGradeValue >= 1 && totalGradeValue <= 5) {
        overallGradeLabel = 'Needs Improvement';
      }

      return {
        ...grade.toObject(),
        totalGradeValue,
        overallGradeLabel,
      };
    });

    // Return enriched grades
    res.status(200).json(enrichedGrades);
  } catch (error) {
    console.error('Error fetching grades:', error);
    res.status(500).json({ error: 'Failed to fetch grades.' });
  }
};

export const fetchFinalStudentGrades = async (req: Request, res: Response) => {
  const { studentId } = req.params;

  try {
    // Check if the student exists
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    // Fetch all grades for the student, graded by different panelists
    const grades = await Grading.find({ studentId })
      .populate('studentId', 'name email profileImage')
      .populate('panelistId', 'name email profileImage')
      .populate('rubricId', 'title criteria') // Assuming rubric details with criteria are populated here
      .exec();

    // If no grades are found
    if (grades.length === 0) {
      return res.status(404).json({ message: 'No grades found for this student.' });
    }

    // Organize grades by criterion and compute totals
    const criteriaScores: Record<string, { total: number; count: number }> = {};

    grades.forEach((grade) => {
      grade.grades.forEach((gradeItem) => {
        if (!criteriaScores[gradeItem.criterion]) {
          criteriaScores[gradeItem.criterion] = { total: 0, count: 0 };
        }
        criteriaScores[gradeItem.criterion].total += gradeItem.gradeValue;
        criteriaScores[gradeItem.criterion].count += 1;
      });
    });

    // Compute average grades for each criterion and calculate totalGradeValue
    let totalGradeValue = 0;
    const finalGrades = Object.entries(criteriaScores).map(([criterion, data]) => {
      const averageGrade = data.total / data.count;
      totalGradeValue += averageGrade;
      return { criterion, averageGrade };
    });

    // Determine overallGradeLabel based on totalGradeValue
    let overallGradeLabel = '';
    if (totalGradeValue >= 16 && totalGradeValue <= 20) {
      overallGradeLabel = 'Excellent';
    } else if (totalGradeValue >= 11 && totalGradeValue <= 15) {
      overallGradeLabel = 'Good';
    } else if (totalGradeValue >= 6 && totalGradeValue <= 10) {
      overallGradeLabel = 'Satisfactory';
    } else if (totalGradeValue >= 1 && totalGradeValue <= 5) {
      overallGradeLabel = 'Needs Improvement';
    }

    // Format the response
    const response = {
      student: grades[0].studentId, // Details of the student
      panelists: grades.map((g) => g.panelistId), // Details of the panelists
      rubric: grades[0].rubricId, // Rubric details
      finalGrades, // Final grades for each criterion
      totalGradeValue, // Sum of averaged criterion scores
      overallGradeLabel, // Grade label based on totalGradeValue
    };

    // Respond with the computed final grades
    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching final grade:', error);
    res.status(500).json({ error: 'Failed to fetch final grade.' });
  }
};

export const fetchAllGrades = async (req: Request, res: Response) => {
  try {
    // Fetch all grades from the database
    const grades = await Grading.find()
      .populate('studentId', 'name email profileImage') // Populate student details
      .populate('panelistId', 'name email profileImage') // Populate panelist details
      .populate('rubricId', 'rubricName criteria') // Populate rubric details
      .exec();

    // Check if no grades were found
    if (grades.length === 0) {
      return res.status(404).json({ message: 'No grades found.' });
    }

    // Enrich grades with computed fields (if required)
    const enrichedGrades = grades.map((grade) => {
      const totalGradeValue = grade.grades.reduce(
        (sum: number, g: { gradeValue: number }) => sum + g.gradeValue,
        0
      );

      let overallGradeLabel = '';
      if (totalGradeValue >= 16 && totalGradeValue <= 20) {
        overallGradeLabel = 'Excellent';
      } else if (totalGradeValue >= 11 && totalGradeValue <= 15) {
        overallGradeLabel = 'Good';
      } else if (totalGradeValue >= 6 && totalGradeValue <= 10) {
        overallGradeLabel = 'Satisfactory';
      } else if (totalGradeValue >= 1 && totalGradeValue <= 5) {
        overallGradeLabel = 'Needs Improvement';
      }

      return {
        ...grade.toObject(),
        totalGradeValue,
        overallGradeLabel,
      };
    });

    // Respond with all grades
    res.status(200).json(enrichedGrades);
  } catch (error) {
    console.error('Error fetching all grades:', error);
    res.status(500).json({ error: 'Failed to fetch all grades.' });
  }
};

/* export const postAdminGrades = async (req: Request, res: Response) => {
  const { adminId, studentId, rubricId, grades } = req.body;

  try {
    // Validate admin existence
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(403).json({ error: 'Only admins can post grades' });
    }

    // Validate student existence
    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Validate rubric existence
    const rubric = await Rubric.findById(rubricId);
    if (!rubric) {
      return res.status(404).json({ error: 'Rubric not found' });
    }

    // Check if grades already exist for the student and rubric
    const existingGrade = await Grading.findOne({ studentId, rubricId });
    if (existingGrade) {
      return res.status(400).json({ error: 'Grades have already been submitted for this student with this rubric.' });
    }

    // Create new grade entry
    const newGrade = new Grading({
      studentId,
      adminId,
      rubricId,
      grades,
    });

    await newGrade.save();
    return res.status(201).json({ message: 'Grades submitted successfully', grading: newGrade });
  } catch (error) {
    console.error('Error posting grades:', error);
    res.status(500).json({ error: 'Failed to post grades' });
  }
}; */

// Get all rubrics
export const getRubrics = async (req: Request, res: Response) => {
  try {
    const rubrics = await Rubric.find();
    res.status(200).json(rubrics);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch rubrics", error });
  }
};

// Create a new rubric
export const createRubric = async (req: Request, res: Response) => {
  try {
    const { title, criteria } = req.body;

    // Ensure numeric scores are not editable
    criteria.forEach((item: any) => {
      item.excellentScore = 4;
      item.goodScore = 3;
      item.satisfactoryScore = 2;
      item.needsImprovementScore = 1;
    });

    const newRubric = new Rubric({ title, criteria });
    await newRubric.save();

    res.status(201).json(newRubric);
  } catch (error) {
    res.status(500).json({ message: "Failed to create rubric", error });
  }
};

// Update a rubric (only string labels and category are editable)
export const updateRubric = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, criteria } = req.body;

    const rubric = await Rubric.findById(id);
    if (!rubric) return res.status(404).json({ message: "Rubric not found" });

    // Prevent numeric score editing
    criteria.forEach((item: any) => {
      item.excellentScore = 4;
      item.goodScore = 3;
      item.satisfactoryScore = 2;
      item.needsImprovementScore = 1;
    });

    rubric.title = title;
    rubric.criteria = criteria;
    const updatedRubric = await rubric.save();

    res.status(200).json(updatedRubric);
  } catch (error) {
    res.status(500).json({ message: "Failed to update rubric", error });
  }
};

// Delete a rubric
export const deleteRubric = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedRubric = await Rubric.findByIdAndDelete(id);

    if (!deletedRubric) {
      return res.status(404).json({ message: "Rubric not found" });
    }

    res.status(200).json({ message: "Rubric deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete rubric", error });
  }
};

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

    const updatedAdmin = await Admin.findByIdAndUpdate(id, updateData, { new: true }).lean();
    res.json({ 
      message: "Admin profile updated successfully", 
      admin: updatedAdmin ? { ...updatedAdmin, id: updatedAdmin._id } : null // Add `id` if necessary
    });
    
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

export const getAllAdvicers = async (req: Request, res: Response) => {
  try {
    // Count total students who are not approved
    const totalStudentsPending = await User.countDocuments({ isApproved: false, role: 'student' });
    const totalAdvicerPending = await User.countDocuments({ isApproved: false, role: 'adviser' });

    const totalStudentsApproved = await User.countDocuments({ isApproved: true, role: 'student' });
    const totalAdvicersApproved = await User.countDocuments({ isApproved: true, role: 'adviser' });

    res.json({ 
      totalStudentsPending, 
      totalAdvicerPending, 
      totalStudentsApproved, 
      totalAdvicersApproved 
    });
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
    const users = await User.find({ isApproved: false, role: 'student' });

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

export const getAllUsersStudent = async (req: Request, res: Response) => {
  try {
    // Fetch all students who are approved
    const users = await User.find({ role: 'student', isApproved: true })
      .populate({
        path: 'panelists', // Populating the panelists field to fetch their details
        select: 'name' // Selecting only the 'name' field of panelists
      });

      const updatedUsers = users.map((user) => ({
        ...user.toObject(),
        panelists: user.panelists.map((panelist) => ({
          _id: panelist._id, // Include panelist ID
          name: panelist.name, // Include panelist name
        })),
      }));

    res.json(updatedUsers);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};



export const fetchPanelists = async (req: Request, res: Response) => {
  try {
    // Fetch advisors with the specified design
    const panelists = await User.find({ role: 'adviser' })
      .select('name profileImage design email') // Select specific fields to return
      .exec();

    res.status(200).json(panelists);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching advisors', error });
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

    const panelists = Array.isArray(req.body.panelists) 
    ? req.body.panelists 
    : JSON.parse(req.body.panelists || "[]");
    
    // Prepare the update object conditionally
    const updateData: any = {
      name,
      email,
      course,
      groupMembers,
      panelists // Ensure panelists is always an array
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

export const countStudentsWithPanelists = async (req: Request, res: Response) => {
  try {
    // Use aggregation to count students who have panelists
    const result = await User.aggregate([
      {
        $match: {
          role: 'student', // Ensure we are counting students
          panelists: { $ne: [] }, // Check if panelists array is not empty
        },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 }, // Count the total number of students with panelists
        },
      },
    ]);

    const count = result.length > 0 ? result[0].count : 0; // Extract the count or default to 0 if no matches

    res.status(200).json({ count }); // Send the count in the response
  } catch (error) {
    console.error('Error counting students with panelists:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



export const countStudentsByCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    // Count students enrolled in BSIT
    const totalBSITStudents = await User.countDocuments({
      role: 'student',
      course: 'BSIT', // Filter by BSIT course
    });

    // Count students enrolled in BSCS
    const totalBSCSStudents = await User.countDocuments({
      role: 'student',
      course: 'BSCS', // Filter by BSCS course
    });

    res.status(200).json({
      totalBSITStudents,
      totalBSCSStudents,
    });
  } catch (error) {
    console.error('Error counting students by course:', error);
    res.status(500).json({ message: 'Server error while counting students by course' });
  }
};

export const countStudentsWithoutAdvisors = async (req: Request, res: Response): Promise<void> => {
  try {
    // Query to count students with no chosen advisor
    const count = await User.countDocuments({
      role: 'student', // Only students
      chosenAdvisor: null, // No advisor assigned
    });

    res.status(200).json({ totalStudentsWithoutAdvisors: count });
  } catch (error) {
    console.error('Error counting students without advisors:', error);
    res.status(500).json({ message: 'Server error while counting students without advisors' });
  }
};

export const countAcceptedStudentsForAdvisors = async (req: Request, res: Response): Promise<void> => {
  try {
    // Query all advisors and sum up the size of their acceptedStudents arrays
    const advisors = await User.find({ role: 'adviser' }, 'acceptedStudents');
    
    // Calculate the total count of acceptedStudents
    const totalAcceptedStudents = advisors.reduce(
      (sum, advisor) => sum + (advisor.acceptedStudents?.length || 0),
      0
    );

    res.status(200).json({ totalAcceptedStudents });
  } catch (error) {
    console.error('Error counting accepted students for advisors:', error);
    res.status(500).json({ message: 'Server error while counting accepted students' });
  }
};

export const countNoStatusManuscripts = async (req: Request, res: Response): Promise<void> => {
  try {
    // Query to count documents with manuscriptStatus set to null and role as student
    const count = await User.countDocuments({
      manuscriptStatus: null,
      role: 'student', // Filter for students only
    });
    res.status(200).json({ totalNoStatusManuscripts: count });
  } catch (error) {
    console.error('Error counting manuscripts with no status:', error);
    res.status(500).json({ message: 'Server error while counting manuscripts' });
  }
};


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
      'name groupMembers channelId panelists chosenAdvisor course profileImage manuscriptStatus proposals tasks advisorStatus'
    ).populate('chosenAdvisor', 'name profileImage').lean();

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
        chosenAdvisor: student.chosenAdvisor, // Fetch name of chosenAdvisor
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
      ).populate('chosenAdvisor', 'name profileImage').lean();

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