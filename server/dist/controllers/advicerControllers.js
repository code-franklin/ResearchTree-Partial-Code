"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postAnalyze = exports.getFiles = exports.postUploadFiles = exports.postSearch = exports.getSynonymsTerm = exports.postSynonyms = exports.getAllArticles = exports.respondToStudent = exports.updatePanelManuscriptStatus = exports.resetVotes = exports.updateManuscriptStatus = exports.deleteTaskFromStudent = exports.getTasksProgressStudent = exports.getTasksMyAdvicee = exports.postAddTaskMyAdvicee = exports.getPanelistStudents = exports.getAdviserStudents = exports.getSpecializations = exports.updateStatusStudent = exports.listStudentsManage = exports.getToken = exports.resetAdvicerPassword = exports.editAdvicerProfile = exports.login = exports.registration = exports.getPanelistStudentsApprovedOnPanel = exports.getPanelistStudentsReviseOnPanel = exports.getPanelistStudentsReadyToDefense = exports.getNewUploadsByAdviser = exports.getPanelistStudentsAccepted = exports.getReadyToReviseOnAdvicerByAdviser = exports.getReadyToDefenseStudentByAdviser = exports.getBSITBSCStudentsByAdviser = exports.fetchFinalStudentGrades = exports.fetchGrades = exports.fetchAdviseStudentGrades = exports.submitGrades = exports.fetchRubrics = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("../models/User"));
const Admin_1 = __importDefault(require("../models/Admin"));
const Specialization_1 = __importDefault(require("../models/Specialization"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const pdfDetails_1 = __importDefault(require("../models/pdfDetails"));
const pdfDetails_2 = __importDefault(require("../models/pdfDetails"));
const Rubric_1 = __importDefault(require("../models/Rubric"));
const Grading_1 = __importDefault(require("../models/Grading")); // Import IGrade
const dotenv_1 = __importDefault(require("dotenv"));
const language_1 = require("@google-cloud/language");
const mongodb_1 = require("mongodb");
// Get all rubrics
const fetchRubrics = async (req, res) => {
    try {
        const rubrics = await Rubric_1.default.find();
        res.status(200).json(rubrics);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch rubrics", error });
    }
};
exports.fetchRubrics = fetchRubrics;
const submitGrades = async (req, res) => {
    const { studentId, panelistId, rubricId, grades } = req.body;
    try {
        // Validate student
        const student = await User_1.default.findById(studentId);
        if (!student || student.role !== 'student') {
            return res.status(404).json({ error: 'Student not found' });
        }
        // Validate adviser role
        const adviser = await User_1.default.findById(panelistId);
        if (!adviser || adviser.role !== 'adviser') {
            return res.status(403).json({ error: 'Only panels can grade students' });
        }
        // Check for existing grades
        const existingGrade = await Grading_1.default.findOne({ studentId, panelistId, rubricId });
        if (existingGrade) {
            return res.status(400).json({ error: 'Grades already submitted for this rubric by you' });
        }
        // Calculate grade values and label
        const totalGradeValue = grades.reduce((sum, grade) => sum + grade.gradeValue, 0);
        let overallGradeLabel = 'Needs Improvement';
        if (totalGradeValue >= 16)
            overallGradeLabel = 'Excellent';
        else if (totalGradeValue >= 11)
            overallGradeLabel = 'Good';
        else if (totalGradeValue >= 6)
            overallGradeLabel = 'Satisfactory';
        // Save grade entry
        const newGrade = new Grading_1.default({ studentId, panelistId, rubricId, grades, totalGradeValue, overallGradeLabel });
        await newGrade.save();
        return res.status(201).json({ message: 'Grades submitted successfully' });
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to submit grades BackEnd' });
    }
};
exports.submitGrades = submitGrades;
// Backup for Adviser view student grade
const fetchAdviseStudentGrades = async (req, res) => {
    const { panelistId } = req.params; // Fetch adviserId from route params
    try {
        // Check if the adviser exists
        const adviser = await User_1.default.findById(panelistId);
        if (!adviser) {
            return res.status(404).json({ message: 'Panel not found.' });
        }
        // Fetch grades for students graded by this adviser
        const grading = await Grading_1.default.find({ panelistId: panelistId }) // Query based on adviserId
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
            const totalGradeValue = grade.grades.reduce((sum, g) => sum + g.gradeValue, 0);
            let overallGradeLabel = '';
            if (totalGradeValue >= 16 && totalGradeValue <= 20) {
                overallGradeLabel = 'Excellent';
            }
            else if (totalGradeValue >= 11 && totalGradeValue <= 15) {
                overallGradeLabel = 'Good';
            }
            else if (totalGradeValue >= 6 && totalGradeValue <= 10) {
                overallGradeLabel = 'Satisfactory';
            }
            else if (totalGradeValue >= 1 && totalGradeValue <= 5) {
                overallGradeLabel = 'Needs Improvement';
            }
            return Object.assign(Object.assign({}, grade.toObject()), { totalGradeValue,
                overallGradeLabel });
        });
        // Return enriched grades
        res.status(200).json(enrichedGrades);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch grades.' });
    }
};
exports.fetchAdviseStudentGrades = fetchAdviseStudentGrades;
const fetchGrades = async (req, res) => {
    const { studentId } = req.params; // Fetch studentId from route params
    try {
        // Check if the student exists
        const student = await User_1.default.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found.' });
        }
        // Fetch all grades for the student, graded by different panelists
        const grading = await Grading_1.default.find({ studentId }) // Query grades for the student
            .populate('studentId', 'name email profileImage') // Populate student details
            .populate('panelistId', 'name email profileImage') // Populate panelist/adviser details
            .populate('rubricId', 'title criteria') // Populate rubric details
            .exec();
        // If no grades are found
        if (grading.length === 0) {
            return res.status(404).json({ message: 'No grades found for this student.' });
        }
        // Compute total grades and overall grade labels for each grade record
        const enrichedGrades = grading.map((grade) => {
            const totalGradeValue = grade.grades.reduce((sum, g) => sum + g.gradeValue, 0);
            let overallGradeLabel = '';
            if (totalGradeValue >= 16 && totalGradeValue <= 20) {
                overallGradeLabel = 'Excellent';
            }
            else if (totalGradeValue >= 11 && totalGradeValue <= 15) {
                overallGradeLabel = 'Good';
            }
            else if (totalGradeValue >= 6 && totalGradeValue <= 10) {
                overallGradeLabel = 'Satisfactory';
            }
            else if (totalGradeValue >= 1 && totalGradeValue <= 5) {
                overallGradeLabel = 'Needs Improvement';
            }
            return Object.assign(Object.assign({}, grade.toObject()), { totalGradeValue,
                overallGradeLabel });
        });
        // Return enriched grades with all panelist contributions
        res.status(200).json(enrichedGrades);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch grades.' });
    }
};
exports.fetchGrades = fetchGrades;
const fetchFinalStudentGrades = async (req, res) => {
    const { studentId, rubricId } = req.params;
    try {
        // Check if the student exists
        const student = await User_1.default.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found.' });
        }
        // Ensure rubricId is in ObjectId format
        const rubricObjectId = new mongodb_1.ObjectId(rubricId); // Convert rubricId to ObjectId type if necessary
        // Fetch all grades for the student, graded by different panelists
        const grades = await Grading_1.default.find({ studentId, 'rubricId': rubricObjectId })
            .populate('studentId', 'name email profileImage')
            .populate('panelistId', 'name email profileImage')
            .populate('rubricId', 'title criteria') // Assuming rubric details with criteria are populated here
            .exec();
        // If no grades are found
        if (grades.length === 0) {
            return res.status(404).json({ message: 'No grades found for this student for the selected rubric.' });
        }
        // Organize grades by rubricId and criterion, then compute totals for each rubric
        const rubricScores = {};
        grades.forEach((grade) => {
            const rubricId = grade.rubricId._id.toString(); // Get rubric ID
            grade.grades.forEach((gradeItem) => {
                if (!rubricScores[rubricId]) {
                    rubricScores[rubricId] = {
                        total: 0,
                        panelists: new Set(), // Using Set to track unique panelists
                        rubric: grade.rubricId, // Store the rubric info for later
                    };
                }
                // Add the grade value to the rubric total and track the panelist
                rubricScores[rubricId].total += gradeItem.gradeValue;
                rubricScores[rubricId].panelists.add(grade.panelistId._id.toString()); // Store panelist ID in the Set
            });
        });
        // Now compute total grade and overall grade for the rubric
        const finalRubricGrades = Object.entries(rubricScores).map(([rubricId, data]) => {
            const averageGrade = data.total / data.panelists.size; // Divide total grade by the number of unique panelists
            let overallGradeLabel = '';
            // Calculate overallGradeLabel based on average grade
            if (averageGrade >= 16 && averageGrade <= 20) {
                overallGradeLabel = 'Excellent';
            }
            else if (averageGrade >= 11 && averageGrade <= 15) {
                overallGradeLabel = 'Good';
            }
            else if (averageGrade >= 6 && averageGrade <= 10) {
                overallGradeLabel = 'Satisfactory';
            }
            else if (averageGrade >= 1 && averageGrade <= 5) {
                overallGradeLabel = 'Needs Improvement';
            }
            // Return the grade data for each rubric
            return {
                rubricId: data.rubric._id, // Rubric ID
                rubricTitle: data.rubric.title, // Rubric title
                totalGradeValue: averageGrade, // Total grade value (average per rubric)
                overallGradeLabel, // Overall grade label for this rubric
            };
        });
        // Format the response with rubric details and grades
        const response = {
            student: grades[0].studentId, // Details of the student
            panelists: grades.map((g) => g.panelistId), // Details of the panelists
            rubrics: finalRubricGrades, // Final grades for the rubric
        };
        // Respond with the computed final grades per rubric
        res.status(200).json(response);
    }
    catch (error) {
        console.error('Error fetching final grade:', error);
        res.status(500).json({ error: 'Failed to fetch final grade.' });
    }
};
exports.fetchFinalStudentGrades = fetchFinalStudentGrades;
// Data Analytics
const getBSITBSCStudentsByAdviser = async (req, res) => {
    try {
        const { adviserId } = req.params;
        // Ensure adviserId is provided
        if (!adviserId) {
            return res.status(400).json({ error: 'Adviser ID is required' });
        }
        // Fetch the adviser by ID and populate the acceptedStudents field
        const adviser = await User_1.default.findById(adviserId)
            .populate('acceptedStudents');
        if (!adviser) {
            return res.status(404).json({ error: 'Adviser not found' });
        }
        // Filter the acceptedStudents to count BSIT and BSCS students
        const bsitStudents = adviser.acceptedStudents.filter(student => student.course === 'BSIT');
        const bscsStudents = adviser.acceptedStudents.filter(student => student.course === 'BSCS');
        const acceptedStudentsCount = adviser.acceptedStudents.length;
        // Return the counts for BSIT and BSCS
        res.status(200).json({
            bsitCount: bsitStudents.length,
            bscsCount: bscsStudents.length,
            acceptedStudentsCount,
        });
    }
    catch (error) {
        console.error('Error fetching students by adviser:', error);
        res.status(500).json({ error: 'Failed to fetch students by adviser' });
    }
};
exports.getBSITBSCStudentsByAdviser = getBSITBSCStudentsByAdviser;
// Data Analytics: Count Panelists
const getReadyToDefenseStudentByAdviser = async (req, res) => {
    const { adviserId } = req.params;
    try {
        // Ensure adviserId is a valid ObjectId
        if (!mongoose_1.default.Types.ObjectId.isValid(adviserId)) {
            return res.status(400).json({ message: 'Invalid adviser ID' });
        }
        // Fetch the adviser with their accepted students
        const adviser = await User_1.default.findById(adviserId).populate('acceptedStudents');
        if (!adviser || adviser.role !== 'adviser') {
            return res.status(404).json({ message: 'Adviser not found' });
        }
        // Filter the accepted students who are 'Ready to Defense'
        const readyToDefenseStudents = adviser.acceptedStudents.filter(student => student.manuscriptStatus === 'Ready to Defense');
        // Get the count of students who are 'Ready to Defense'
        const readyToDefenseCount = readyToDefenseStudents.length;
        return res.status(200).json({ readyToDefenseCount });
    }
    catch (error) {
        console.error('Error fetching ready-to-defense students count:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};
exports.getReadyToDefenseStudentByAdviser = getReadyToDefenseStudentByAdviser;
const getReadyToReviseOnAdvicerByAdviser = async (req, res) => {
    const { adviserId } = req.params;
    try {
        // Ensure adviserId is a valid ObjectId
        if (!mongoose_1.default.Types.ObjectId.isValid(adviserId)) {
            return res.status(400).json({ message: 'Invalid adviser ID' });
        }
        // Fetch the adviser with their accepted students
        const adviser = await User_1.default.findById(adviserId).populate('acceptedStudents');
        if (!adviser || adviser.role !== 'adviser') {
            return res.status(404).json({ message: 'Adviser not found' });
        }
        // Filter the accepted students who are 'Ready to Defense'
        const reviseOnAdvicerStudents = adviser.acceptedStudents.filter(student => student.manuscriptStatus === 'Revise On Advicer');
        // Get the count of students who are 'Ready to Defense'
        const reviseOnAdvicerCount = reviseOnAdvicerStudents.length;
        return res.status(200).json({ reviseOnAdvicerCount });
    }
    catch (error) {
        console.error('Error fetching ready-to-defense students count:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};
exports.getReadyToReviseOnAdvicerByAdviser = getReadyToReviseOnAdvicerByAdviser;
const getPanelistStudentsAccepted = async (req, res) => {
    const { adviserId } = req.params;
    try {
        // Use aggregation to count panelist students with advisorStatus 'accepted'
        const result = await User_1.default.aggregate([
            {
                $match: {
                    panelists: new mongoose_1.default.Types.ObjectId(adviserId), // Match students where the advisor is a panelist
                    advisorStatus: 'accepted', // Ensure the advisor's status is 'accepted'
                }
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 } // Count the number of students with advisorStatus 'accepted'
                }
            }
        ]);
        const count = result.length > 0 ? result[0].count : 0; // Get the count of students or 0 if no results
        res.status(200).json({ count }); // Send the count in the response
    }
    catch (error) {
        console.error('Error fetching panelist students with accepted status:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.getPanelistStudentsAccepted = getPanelistStudentsAccepted;
const getNewUploadsByAdviser = async (req, res) => {
    const { adviserId } = req.params;
    try {
        // Ensure adviserId is a valid ObjectId
        if (!mongoose_1.default.Types.ObjectId.isValid(adviserId)) {
            return res.status(400).json({ message: 'Invalid adviser ID' });
        }
        // Fetch the adviser with their accepted students
        const adviser = await User_1.default.findById(adviserId).populate('acceptedStudents');
        if (!adviser || adviser.role !== 'adviser') {
            return res.status(404).json({ message: 'Adviser not found' });
        }
        // Filter the accepted students who are 'Ready to Defense'
        const newUploadsStudents = adviser.acceptedStudents.filter(student => student.manuscriptStatus === null);
        // Get the count of students who are 'Ready to Defense'
        const newUploadsCount = newUploadsStudents.length;
        return res.status(200).json({ newUploadsCount });
    }
    catch (error) {
        console.error('Error fetching ready-to-defense students count:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};
exports.getNewUploadsByAdviser = getNewUploadsByAdviser;
const getPanelistStudentsReadyToDefense = async (req, res) => {
    const { adviserId } = req.params;
    try {
        // Use aggregation to count manuscriptStatus for 'Ready to Defense' students
        const result = await User_1.default.aggregate([
            {
                $match: {
                    panelists: new mongoose_1.default.Types.ObjectId(adviserId), // Find students where the advisor is a panelist
                    advisorStatus: 'accepted', // Ensure the advisor status is 'accepted'
                    manuscriptStatus: 'Ready to Defense' // Filter only those with manuscriptStatus 'Ready to Defense'
                }
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 } // Count the number of students with 'Ready to Defense' status
                }
            }
        ]);
        const count = result.length > 0 ? result[0].count : 0; // Get the count of students or 0 if no results
        res.status(200).json({ count }); // Send the count in the response
    }
    catch (error) {
        console.error('Error fetching panelist students:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.getPanelistStudentsReadyToDefense = getPanelistStudentsReadyToDefense;
const getPanelistStudentsReviseOnPanel = async (req, res) => {
    const { adviserId } = req.params;
    try {
        // Use aggregation to count manuscriptStatus for 'Ready to Defense' students
        const result = await User_1.default.aggregate([
            {
                $match: {
                    panelists: new mongoose_1.default.Types.ObjectId(adviserId), // Find students where the advisor is a panelist
                    advisorStatus: 'accepted', // Ensure the advisor status is 'accepted'
                    manuscriptStatus: 'Revise on Panelist' // Filter only those with manuscriptStatus 'Ready to Defense'
                }
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 } // Count the number of students with 'Ready to Defense' status
                }
            }
        ]);
        const count = result.length > 0 ? result[0].count : 0; // Get the count of students or 0 if no results
        res.status(200).json({ count }); // Send the count in the response
    }
    catch (error) {
        console.error('Error fetching panelist students:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.getPanelistStudentsReviseOnPanel = getPanelistStudentsReviseOnPanel;
const getPanelistStudentsApprovedOnPanel = async (req, res) => {
    const { adviserId } = req.params;
    try {
        // Use aggregation to count manuscriptStatus for 'Ready to Defense' students
        const result = await User_1.default.aggregate([
            {
                $match: {
                    panelists: new mongoose_1.default.Types.ObjectId(adviserId), // Find students where the advisor is a panelist
                    advisorStatus: 'accepted', // Ensure the advisor status is 'accepted'
                    manuscriptStatus: 'Approved on Panel' // Filter only those with manuscriptStatus 'Ready to Defense'
                }
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 } // Count the number of students with 'Ready to Defense' status
                }
            }
        ]);
        const count = result.length > 0 ? result[0].count : 0; // Get the count of students or 0 if no results
        res.status(200).json({ count }); // Send the count in the response
    }
    catch (error) {
        console.error('Error fetching panelist students:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.getPanelistStudentsApprovedOnPanel = getPanelistStudentsApprovedOnPanel;
const registration = async (req, res) => {
    var _a;
    const { name, email, password, role, course, year, handleNumber, groupMembers, design } = req.body;
    const specializations = JSON.parse(req.body.specializations);
    const profileImage = (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename;
    try {
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 12);
        const newUser = new User_1.default({
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
        res.status(201).json({ message: 'User registered successfully. Waiting for Admin Approval' });
    }
    catch (error) {
        res.status(500).json({ message: 'Something went wrong', error });
    }
};
exports.registration = registration;
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!user.isApproved) {
            return res.status(403).json({ message: 'Your account has not been approved by the admin yet.' });
        }
        const isPasswordCorrect = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // Create the token with user info
        const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        // Send the token and user information
        res.status(200).json({ token, user });
    }
    catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
};
exports.login = login;
const editAdvicerProfile = async (req, res) => {
    var _a;
    const { id } = req.params; // Admin ID
    const { name, email, handleNumber, deleteProfileImage } = req.body; // Data from request body
    const specializations = Array.isArray(req.body.specializations)
        ? req.body.specializations
        : JSON.parse(req.body.specializations || "[]");
    const profileImage = (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename; // Get new profile image if exists
    try {
        // Find the admin by ID
        const user = await User_1.default.findById(id);
        if (!user) {
            return res.status(404).json({ message: "Advicer not found" });
        }
        // Prepare the update object conditionally
        const updateData = {
            name,
            email,
            handleNumber,
            specializations
        };
        if (deleteProfileImage) {
            // Check if profile image exists before deleting it
            if (user.profileImage) {
                const imagePath = path_1.default.join(__dirname, "../public/uploads", user.profileImage);
                // Remove the old image if it exists
                if (fs_1.default.existsSync(imagePath)) {
                    fs_1.default.unlinkSync(imagePath); // Delete the old image file
                }
            }
            updateData.profileImage = ""; // Remove image from database
        }
        if (profileImage) {
            // If a new image is provided, update it
            updateData.profileImage = profileImage;
        }
        // Find the admin and update with new details
        const updatedUser = await User_1.default.findByIdAndUpdate(id, updateData, { new: true });
        res.json({ message: "User profile updated successfully", user: updatedUser });
    }
    catch (error) {
        console.error("Error updating User profile:", error);
        res.status(500).json({ message: "Server error", error });
    }
};
exports.editAdvicerProfile = editAdvicerProfile;
const resetAdvicerPassword = async (req, res) => {
    const { id } = req.params;
    const { newPassword } = req.body;
    if (!newPassword) {
        return res.status(400).json({ message: "New password is required." });
    }
    try {
        const user = await User_1.default.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User Student not found" });
        }
        // Hash the new password
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, salt);
        // Update the password
        user.password = hashedPassword;
        // Save the updated admin
        await user.save();
        return res.status(200).json({ message: "Password reset successfully" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", error });
    }
};
exports.resetAdvicerPassword = resetAdvicerPassword;
/* ckeditor API */
const getToken = async (req, res) => {
    const accessKey = process.env.ACCESS_KEY || 'a5dNxn8ql3vvlvgRKUCFpcb8GdWswtwFqHvnAqemFSxeVEaFxL194fHldxMT';
    const environmentId = process.env.ENVIRONMENT_ID || 'IRDnx5LV1pB6eg928INN';
    try {
        const userId = req.params.userId;
        // console.log('Fetching user with ID:', userId);
        // Search for the user in both User and Admin collections
        const user = await User_1.default.findById(userId).exec();
        let userInfo;
        if (user) {
            // User found in the User collection
            userInfo = {
                email: user.email,
                name: user.name,
                role: user.role,
            };
        }
        else {
            // Search in the Admin collection if not found in User
            const admin = await Admin_1.default.findById(userId).exec();
            if (admin) {
                userInfo = {
                    email: admin.email,
                    name: admin.name,
                };
            }
            else {
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
        // console.log('Payload for JWT:', payload);
        const token = jsonwebtoken_1.default.sign(payload, accessKey, { algorithm: 'HS256', expiresIn: '24h' });
        res.send(token);
    }
    catch (error) {
        console.error('Error generating token:', error);
        res.status(500).send('Error generating token');
    }
};
exports.getToken = getToken;
/* admin & advicer */
const listStudentsManage = async (req, res) => {
    const { advisorId } = req.params;
    try {
        const students = await User_1.default.find({ chosenAdvisor: advisorId, advisorStatus: { $exists: false } });
        res.status(200).json({ students });
    }
    catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.listStudentsManage = listStudentsManage;
/* admin & advicer */
const updateStatusStudent = async (req, res) => {
    const { studentId, status } = req.body;
    if (!studentId || !status) {
        return res.status(400).json({ message: 'studentId and status are required' });
    }
    try {
        await User_1.default.findByIdAndUpdate(studentId, { advisorStatus: status });
        res.status(200).json({ message: 'Student status updated successfully' });
    }
    catch (error) {
        console.error('Error updating student status:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.updateStatusStudent = updateStatusStudent;
/* Specialization to choose */
const getSpecializations = async (req, res) => {
    try {
        const specializations = await Specialization_1.default.find();
        res.status(200).json(specializations);
    }
    catch (error) {
        res.status(500).json({ message: 'Something went wrong', error });
    }
};
exports.getSpecializations = getSpecializations;
const getAdviserStudents = async (req, res) => {
    const { advisorId } = req.params;
    try {
        // Fetch accepted students
        const acceptedStudents = await User_1.default.find({ chosenAdvisor: advisorId, advisorStatus: 'accepted', role: 'student' }, 'name groupMembers channelId panelists course profileImage manuscriptStatus proposals tasks').lean();
        // Map accepted students to include the latest proposal
        const studentData = await Promise.all(acceptedStudents.map(async (student) => {
            // Fetch panelist names
            const panelistNames = await User_1.default.find({ _id: { $in: student.panelists } }, 'name').lean();
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
        }));
        // Fetch declined students with their proposals
        const declinedStudents = await User_1.default.find({ chosenAdvisor: advisorId, advisorStatus: 'declined', role: 'student' }, 'name proposals profileImage').lean();
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
        const studentsToManage = await User_1.default.find({ chosenAdvisor: advisorId, advisorStatus: 'pending', role: 'student' }, 'name proposals profileImage').lean();
        // Map pending students to include the latest proposal
        const pendingStudentData = await Promise.all(studentsToManage.map(async (student) => {
            const latestProposal = student.proposals.length > 0 ? student.proposals[student.proposals.length - 1] : null;
            return {
                _id: student._id,
                name: student.name,
                profileImage: student.profileImage,
                proposalTitle: latestProposal ? latestProposal.proposalTitle : 'No proposal submitted',
                proposalText: latestProposal ? latestProposal.proposalText : 'No proposal submitted',
            };
        }));
        // Calculate counts
        const acceptedCount = acceptedStudents.length;
        const declinedCount = declinedStudents.length;
        const pendingCount = studentsToManage.length;
        // Send the response back to the client
        res.json({
            counts: {
                accepted: acceptedCount,
                declined: declinedCount,
                pending: pendingCount,
            },
            acceptedStudents: studentData,
            declinedStudents: declinedStudentData,
            pendingStudents: pendingStudentData,
        });
    }
    catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.getAdviserStudents = getAdviserStudents;
// export const getAdviserStudentsCount = async (req: Request, res: Response) => {
//   const { advisorId } = req.params;
//   try {
//     // Count accepted students
//     const acceptedCount = await User.countDocuments({
//       chosenAdvisor: advisorId,
//       advisorStatus: 'accepted',
//       role: 'student',
//     });
//     // Count declined students
//     const declinedCount = await User.countDocuments({
//       chosenAdvisor: advisorId,
//       advisorStatus: 'declined',
//       role: 'student',
//     });
//     // Count pending students
//     const pendingCount = await User.countDocuments({
//       chosenAdvisor: advisorId,
//       advisorStatus: 'pending',
//       role: 'student',
//     });
//     // Send the counts as the response
//     res.json({
//       accepted: acceptedCount,
//       declined: declinedCount,
//       pending: pendingCount,
//     });
//   } catch (error) {
//     console.error("Error fetching student counts:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };
const getPanelistStudents = async (req, res) => {
    const { advisorId } = req.params;
    try {
        // Fetch students where the advisor is a panelist and their advisorStatus is 'accepted'
        const panelistStudents = await User_1.default.find({ panelists: advisorId, advisorStatus: 'accepted' }, 'name groupMembers channelId course profileImage chosenAdvisor manuscriptStatus proposals panelists tasks')
            .populate('chosenAdvisor', 'name profileImage') // Populate advisor's name and profile image
            .populate('panelists', 'name'); // Fetch names of panelists
        // Map through students and fetch names of the panelists
        const studentData = await Promise.all(panelistStudents.map(async (student) => {
            // Fetch panelist names
            const panelistNames = await User_1.default.find({ _id: { $in: student.panelists } }, 'name').lean();
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
        }));
        res.status(200).json({ panelistStudents: studentData });
    }
    catch (error) {
        console.error('Error fetching panelist students:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.getPanelistStudents = getPanelistStudents;
// Add a task for a student
const postAddTaskMyAdvicee = async (req, res) => {
    const { studentId } = req.params;
    const { taskTitle } = req.body;
    try {
        // Find the student by ID
        const student = await User_1.default.findById(studentId);
        if (!student || student.role !== 'student') {
            return res.status(404).json({ message: 'Student not found' });
        }
        // Add the new task to the student's tasks array
        student.tasks.push({ taskTitle, isCompleted: false });
        // Save the updated student
        await student.save();
        res.status(200).json({ message: 'Task added successfully', tasks: student.tasks });
    }
    catch (error) {
        console.error('Error adding task:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.postAddTaskMyAdvicee = postAddTaskMyAdvicee;
const getTasksMyAdvicee = async (req, res) => {
    const { studentId } = req.params;
    try {
        // Find the student by ID
        const student = await User_1.default.findById(studentId).select('tasks role');
        if (!student) {
            return res.status(404).json({ message: 'Student not found in the database' });
        }
        if (student.role !== 'student') {
            return res.status(403).json({ message: 'User is not a student' });
        }
        // Send the tasks as the response
        res.status(200).json({ tasks: student.tasks });
    }
    catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getTasksMyAdvicee = getTasksMyAdvicee;
const getTasksProgressStudent = async (req, res) => {
    const { studentId } = req.params;
    try {
        // Find the student by ID and select tasks and role fields
        const student = await User_1.default.findById(studentId).select('tasks role');
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
    }
    catch (error) {
        console.error('Error fetching task progress:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getTasksProgressStudent = getTasksProgressStudent;
const deleteTaskFromStudent = async (req, res) => {
    const { studentId, taskId } = req.params;
    try {
        // Find the student by ID
        const student = await User_1.default.findById(studentId);
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
    }
    catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ message: 'Failed to delete task' });
    }
};
exports.deleteTaskFromStudent = deleteTaskFromStudent;
// Function to update manuscript status for a student
const updateManuscriptStatus = async (req, res) => {
    const { channelId, manuscriptStatus } = req.body; // Frontend sends `channelId` of the student and new manuscript status
    try {
        // Find the student by channelId and update their manuscriptStatus
        const student = await User_1.default.findOneAndUpdate({ _id: channelId }, // `channelId` should be the student's ID
        { manuscriptStatus }, { new: true } // Return the updated document
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
    }
    catch (error) {
        console.error('Error updating manuscript status:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateManuscriptStatus = updateManuscriptStatus;
const resetVotes = async (req, res) => {
    const { userId } = req.params;
    try {
        const student = await User_1.default.findById(userId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        // Reset the panelistVotes and publishingVotes
        student.panelistVotes = [];
        student.publishingVotes = [];
        // Optionally, set the manuscriptStatus to a default value or 'null'
        student.manuscriptStatus = "Ready to Defense";
        // Save the changes to the database
        await student.save();
        res.status(200).json({
            message: 'Votes reset successfully',
            student, // Optional: Return the updated student object if needed
        });
    }
    catch (error) {
        console.error('Error resetting votes:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.resetVotes = resetVotes;
const updatePanelManuscriptStatus = async (req, res) => {
    const { channelId, manuscriptStatus, userId } = req.body;
    try {
        const student = await User_1.default.findById(channelId);
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
        }
        else if (manuscriptStatus === 'Approved on Panel') {
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
        }
        else {
            // Directly update manuscript status for non-voting actions
            student.manuscriptStatus = manuscriptStatus;
        }
        await student.save();
        res.status(200).json({
            message: 'Manuscript status updated successfully',
            student,
            remainingVotes,
        });
    }
    catch (error) {
        console.error('Error updating manuscript status:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updatePanelManuscriptStatus = updatePanelManuscriptStatus;
const respondToStudent = async (req, res) => {
    const { advisorId, studentId, status } = req.body;
    try {
        const advisor = await User_1.default.findById(advisorId);
        if (!advisor) {
            return res.status(404).json({ message: 'Advisor not found.' });
        }
        const student = await User_1.default.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found.' });
        }
        if (status === 'accepted') {
            if (advisor.acceptedStudents.length >= (advisor.handleNumber || 0)) {
                return res.status(400).json({
                    message: `Advisor cannot accept more than ${advisor.handleNumber} students.`,
                });
            }
            if (!advisor.acceptedStudents.includes(studentId)) {
                advisor.acceptedStudents.push(studentId);
                student.advisorStatus = 'accepted';
                student.chosenAdvisor = advisorId;
            }
        }
        else if (status === 'declined') {
            if (!advisor.declinedAdvisors.includes(studentId)) {
                advisor.declinedAdvisors.push(studentId);
                student.advisorStatus = 'declined';
            }
        }
        await advisor.save();
        await student.save();
        res.status(200).json({ message: `Student ${status} successfully.` });
    }
    catch (error) {
        console.error('Error responding to student:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};
exports.respondToStudent = respondToStudent;
// Function to grade a student
// export const gradePanelToStudent = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { studentId, panelistId, gradingRubric } = req.body;
//     // Ensure that the rubric contains the full set of grading criteria
//     const grade = new Grade({
//       studentId,
//       panelistId,
//       grades: gradingRubric, // gradingRubric should contain research, presentation, content, etc.
//       dateGraded: new Date(),
//     });
//     await grade.save();
//     res.status(200).json({ message: 'Grading submitted successfully' });
//   } catch (error) {
//     console.error('Error grading student:', error);
//     res.status(500).json({ message: 'Failed to submit grading' });
//   }
// };
dotenv_1.default.config(); // This loads the variables from your .env file
const client = new language_1.LanguageServiceClient({
    // If you have an API key, you can provide it here
    apiKey: 'AIzaSyBqx-4PSSfP-vZBhBBgmu4uxmftsHLfTfE',
});
const getAllArticles = async (req, res) => {
    try {
        const articles = await pdfDetails_1.default.find({}, 'title authors dateUploaded datePublished pdf');
        res.status(200).json(articles);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'An unknown error occurred.' });
        }
    }
};
exports.getAllArticles = getAllArticles;
// Synonym Schema
const searchSynonymSchema = new mongoose_1.default.Schema({
    searchTerm: { type: String, required: true },
    searchSynonyms: [String],
});
const Synonym = mongoose_1.default.model('SynonymSearch', searchSynonymSchema);
// POST route to add new synonyms training
const postSynonyms = async (req, res) => {
    const { searchTerm, searchSynonyms } = req.body;
    if (!searchTerm || !searchSynonyms) {
        return res.status(400).json({ message: 'Both Search Term and Search Synonyms are required.' });
    }
    try {
        let synonymEntry = await Synonym.findOne({ searchTerm });
        if (synonymEntry) {
            synonymEntry.searchSynonyms = Array.from(new Set([...synonymEntry.searchSynonyms, ...searchSynonyms]));
            await synonymEntry.save();
        }
        else {
            synonymEntry = new Synonym({ searchTerm, searchSynonyms });
            await synonymEntry.save();
        }
        res.status(201).json({ message: 'Search Synonyms added successfully', data: synonymEntry });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.postSynonyms = postSynonyms;
const getSynonymsTerm = async (req, res) => {
    try {
        const { searchTerm } = req.params;
        const synonymEntry = await Synonym.findOne({ searchTerm });
        if (synonymEntry) {
            res.json(synonymEntry.searchSynonyms);
        }
        else {
            res.status(404).json({ message: 'No Search Synonyms found for this Search Term' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getSynonymsTerm = getSynonymsTerm;
// Helper function to get synonyms for entities
async function expandEntitiesWithSynonyms(entities) {
    const expandedTerms = new Set();
    for (const searchTerm of entities) {
        expandedTerms.add(searchTerm);
        const synonymEntry = await Synonym.findOne({ searchTerm });
        if (synonymEntry) {
            synonymEntry.searchSynonyms.forEach((synonym) => expandedTerms.add(synonym));
        }
    }
    return Array.from(expandedTerms);
}
const postSearch = async (req, res) => {
    var _a;
    const { query } = req.body;
    if (!query) {
        return res.status(400).send("Query is required for search.");
    }
    try {
        const document = { content: query, type: "PLAIN_TEXT" };
        const [result] = await client.analyzeEntities({ document });
        // Safely handle entities array and ensure no undefined values
        const entities = ((_a = result.entities) === null || _a === void 0 ? void 0 : _a.map(entity => { var _a; return (_a = entity.name) === null || _a === void 0 ? void 0 : _a.toLowerCase(); }).filter((name) => Boolean(name))) || [];
        // console.log("Identified entities:", entities);
        // Fetch synonyms for each entity and expand the search terms
        const expandedQueryTerms = await expandEntitiesWithSynonyms(entities);
        // console.log("Expanded search terms:", expandedQueryTerms);
        // Search the database for matching terms
        const searchResults = await pdfDetails_2.default.find({
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
        }
        else {
            return res.status(404).json({ status: "not found", message: "No documents found." });
        }
    }
    catch (error) {
        console.error("Error with Google NLP or searching documents:", error);
        return res.status(500).send("Error analyzing or searching documents.");
    }
};
exports.postSearch = postSearch;
const postUploadFiles = async (req, res) => {
    var _a;
    const { title, authors, dateUploaded, datePublished } = req.body;
    const fileName = (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename;
    try {
        await pdfDetails_2.default.create({
            title,
            authors,
            dateUploaded,
            datePublished,
            pdf: fileName,
        });
        res.send({ status: "ok" });
    }
    catch (error) {
        res.json({ status: error.message });
    }
};
exports.postUploadFiles = postUploadFiles;
const getFiles = async (req, res) => {
    try {
        const data = await pdfDetails_2.default.find({});
        res.send({ status: "ok", data });
    }
    catch (error) {
        res.json({ status: error.message });
    }
};
exports.getFiles = getFiles;
// Giving sentimentscore
const postAnalyze = async (req, res) => {
    var _a, _b;
    const { text } = req.body;
    if (!text) {
        return res.status(400).send("Text is required for analysis.");
    }
    try {
        const document = { content: text, type: "PLAIN_TEXT" };
        const [result] = await client.analyzeSentiment({ document });
        res.status(200).json({
            sentimentScore: (_a = result.documentSentiment) === null || _a === void 0 ? void 0 : _a.score,
            sentimentMagnitude: (_b = result.documentSentiment) === null || _b === void 0 ? void 0 : _b.magnitude,
        });
    }
    catch (error) {
        console.error("Error analyzing text:", error);
        res.status(500).send("Error analyzing text.");
    }
};
exports.postAnalyze = postAnalyze;
