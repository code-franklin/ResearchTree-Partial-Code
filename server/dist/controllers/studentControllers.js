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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addKeywords = exports.getKeywords = exports.getPdfKeywordsCount = exports.trainModel = exports.updateProposalTitle = exports.getTaskProgress = exports.getTasks = exports.markTaskAsCompleted = exports.searchArticles = exports.getAllArticles = exports.getStudentInfoAndProposal = exports.resetUserPassword = exports.editUserProfile = exports.trainingProposal = exports.chooseNewAdvisor = exports.createNewProposal = exports.fetchGrades = exports.fetchFinalGrade = exports.fetchRubrics = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
const uuid_1 = require("uuid"); // Using UUID to generate a unique channel ID
const path_1 = __importDefault(require("path"));
const Rubric_1 = __importDefault(require("../models/Rubric"));
const Grading_1 = __importDefault(require("../models/Grading"));
const fs_1 = __importDefault(require("fs"));
let NlpManager;
// Function to dynamically load NlpManager
const loadNlpManager = async () => {
    const nlpModule = await Promise.resolve().then(() => __importStar(require('node-nlp')));
    NlpManager = nlpModule.NlpManager;
};
// Load NlpManager at the start
// loadNlpManager().catch(err => console.error('Failed to load NlpManager:', err));
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
const fetchFinalGrade = async (req, res) => {
    const { userId, rubricId } = req.params; // Get both studentId and rubricId
    try {
        // Check if the student exists
        const student = await User_1.default.findById(userId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found.' });
        }
        // Ensure rubricId is in ObjectId format
        const rubricObjectId = new mongodb_1.ObjectId(rubricId); // Convert rubricId to ObjectId type if necessary
        // Fetch grades for the student filtered by rubricId
        const grades = await Grading_1.default.find({
            studentId: userId,
            'rubricId': rubricObjectId // Directly query by rubricId
        })
            .populate('studentId', 'name email profileImage') // Populate student details
            .populate('panelistId', 'name email profileImage') // Populate panelist details
            .populate('rubricId', 'title criteria') // Populate rubric details
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
exports.fetchFinalGrade = fetchFinalGrade;
const fetchGrades = async (req, res) => {
    const { userId } = req.params; // Use req.params for route parameter
    try {
        // Check if the student exists
        const student = await User_1.default.findById(userId);
        if (!student) {
            return res.status(404).json({ message: "Student not found." });
        }
        // Fetch grades for the student
        const grading = await Grading_1.default.find({ studentId: userId }) // Query using studentId
            .populate('studentId', 'name email profileImage') // Populate student details
            .populate('panelistId', 'name email profileImage') // Populate adviser details
            .populate('rubricId', 'title criteria')
            .exec();
        // If no grades are found
        if (grading.length === 0) {
            return res.status(404).json({ message: 'No grades found for this student.' });
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
        console.error('Error fetching grades:', error);
        res.status(500).json({ error: 'Failed to fetch grades.' });
    }
};
exports.fetchGrades = fetchGrades;
const getTopAdvisors = async () => {
    const advisors = await User_1.default.find({ role: 'adviser', isApproved: true }).limit(5);
    return advisors.map(advisor => ({
        id: advisor._id.toString(),
        specializations: advisor.specializations,
    }));
};
// Refine analyzeProposal function for better NLP matching
const analyzeProposal = async (proposalTitle, proposalText, advisors) => {
    if (!NlpManager) {
        throw new Error("NlpManager is not loaded yet.");
    }
    const manager = new NlpManager({ languages: ['en'], forceNER: true });
    // Adding documents based on specializations and proposal title
    advisors.forEach((advisor) => {
        advisor.specializations.forEach((specialization) => {
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
    const classifiedAdvisors = response.classifications.map((classification) => ({
        id: classification.intent,
        score: classification.score,
    }));
    classifiedAdvisors.sort((a, b) => b.score - a.score);
    // Map classifications back to advisor objects and filter top matches
    const topAdvisors = classifiedAdvisors
        .map((classifiedAdvisor) => advisors.find((advisor) => advisor.id === classifiedAdvisor.id))
        .filter((advisor) => advisor !== undefined);
    return topAdvisors.slice(0, 5); // Return top 5 matching advisors
};
const Synonym = mongoose_1.default.model('Synonym', new mongoose_1.Schema({
    terms: { type: [String], required: true }, // Now terms is an array
    synonyms: [String],
}));
// Helper function to expand entities with synonyms
async function expandEntitiesWithSynonyms(entities) {
    const expandedTerms = new Set();
    // Collect all unique words from input entities
    const words = new Set();
    for (const entity of entities) {
        entity.toLowerCase().split(/\s+/).forEach((word) => words.add(word)); // Split by whitespace and lowercase
    }
    // Query the database for all synonyms in one go
    const uniqueWords = Array.from(words); // Convert Set to Array for querying
    const synonymEntries = await Synonym.find({ term: { $in: uniqueWords } }); // Use 'terms' instead of 'term'
    // Build the expanded terms set
    for (const word of uniqueWords) {
        expandedTerms.add(word); // Add the original word
        // Check if the word has a synonym entry and add its synonyms
        const entry = synonymEntries.find((synonym) => synonym.terms.includes(word)); // Check 'terms' array
        if (entry) {
            entry.synonyms.forEach((synonym) => expandedTerms.add(synonym.toLowerCase()));
        }
    }
    return Array.from(expandedTerms); // Convert Set back to Array and return
}
// Proposal submission
const createNewProposal = async (req, res) => {
    const { userId, proposalTitle, proposalText } = req.body;
    if (!userId || !proposalTitle || !proposalText) {
        return res.status(400).send("userId, proposalTitle, and proposalText are required.");
    }
    try {
        const student = await User_1.default.findById(userId);
        if (!student) {
            return res.status(404).send("Student not found.");
        }
        if (student.advisorStatus === "accepted") {
            return res.status(400).json({ message: 'Cannot submit proposal after advisor acceptance' });
        }
        if (student.advisorStatus === 'pending') {
            return res.status(400).json({ message: 'Cannot submit proposal, please wait for approval on advisor.' });
        }
        const channelId = (0, uuid_1.v4)();
        student.channelId = channelId;
        await student.save();
        const newProposal = {
            proposalTitle,
            proposalText,
            submittedAt: new Date(),
        };
        student.proposals.push(newProposal);
        await student.save();
        // Expand keywords and search advisors
        const expandedQueryTerms = await expandEntitiesWithSynonyms([proposalTitle, proposalText]);
        const escapedQueryTerms = expandedQueryTerms.map(term => term.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&"));
        const declinedAdvisors = student.declinedAdvisors || [];
        const advisors = await User_1.default.find({
            role: 'adviser',
            isApproved: true,
            specializations: { $in: escapedQueryTerms.map(term => new RegExp(term, 'i')) },
            _id: { $nin: declinedAdvisors },
        });
        if (advisors.length === 0) {
            return res.status(404).json({ status: "not found", message: "No advisors found matching specializations." });
        }
        // Filter advisors based on their availability
        const availableAdvisors = advisors.filter(advisor => {
            // Ensure handleNumber is defined before using it
            return advisor.handleNumber !== undefined && advisor.acceptedStudents.length < advisor.handleNumber;
        });
        if (availableAdvisors.length === 0) {
            return res.status(404).json({ status: "not found", message: "No available advisors found." });
        }
        // Calculate match percentage for available advisors
        const advisorsWithMatchPercentage = availableAdvisors.map(advisor => {
            const matchedSpecializations = advisor.specializations.filter(specialization => escapedQueryTerms.some(term => new RegExp(term, 'i').test(specialization)));
            const matchPercentage = (matchedSpecializations.length / escapedQueryTerms.length) * 100;
            return { advisor, matchPercentage };
        });
        advisorsWithMatchPercentage.sort((a, b) => b.matchPercentage - a.matchPercentage);
        const top5Advisors = advisorsWithMatchPercentage.slice(0, 5);
        return res.status(200).json({
            status: "ok",
            results: top5Advisors.map(item => ({
                advisor: item.advisor,
                matchPercentage: item.matchPercentage.toFixed(2),
                specializations: item.advisor.specializations,
                channelId: item.advisor.channelId,
            })),
        });
    }
    catch (error) {
        console.error("Error submitting proposal:", error);
        return res.status(500).send("Internal server error.");
    }
};
exports.createNewProposal = createNewProposal;
const chooseNewAdvisor = async (req, res) => {
    var _a;
    const { userId, advisorId } = req.body;
    if (!userId || !advisorId) {
        return res.status(400).json({ message: 'userId and advisorId are required.' });
    }
    try {
        // Fetch the student
        const student = await User_1.default.findById(userId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found.' });
        }
        // Ensure advisor hasn't already been chosen unless declined
        if (student.chosenAdvisor && student.advisorStatus !== 'declined') {
            return res.status(400).json({ message: 'Advisor already chosen.' });
        }
        // Fetch the selected advisor
        const selectedAdvisor = await User_1.default.findById(advisorId);
        if (!selectedAdvisor) {
            return res.status(404).json({ message: 'Advisor not found.' });
        }
        // Validate selected advisor's capacity
        if (selectedAdvisor.handleNumber !== undefined &&
            selectedAdvisor.acceptedStudents.length >= selectedAdvisor.handleNumber) {
            return res.status(400).json({ message: 'This advisor has already accepted the maximum number of students.' });
        }
        // Save the selected advisor
        student.chosenAdvisor = advisorId;
        student.advisorStatus = 'pending';
        // Expand keywords for advisor matching
        const expandedQueryTerms = await expandEntitiesWithSynonyms(((_a = student.proposals.slice(-1)[0]) === null || _a === void 0 ? void 0 : _a.proposalText) || "");
        const escapedQueryTerms = expandedQueryTerms.map(term => term.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&"));
        // Fetch additional advisors for panelist roles
        let advisors = await User_1.default.find({
            role: 'adviser',
            isApproved: true,
            specializations: { $in: escapedQueryTerms.map(term => new RegExp(term, 'i')) },
        });
        // Exclude the chosen advisor from the list
        advisors = advisors.filter(advisor => advisor._id.toString() !== advisorId);
        // Map panelist roles
        const panelistsByRole = {
            'Technical Expert': [],
            'Statistician': [],
            'Subject Expert': [],
        };
        // Assign advisors to roles
        for (const advisor of advisors) {
            if (advisor.design && panelistsByRole[advisor.design] && panelistsByRole[advisor.design].length === 0) {
                panelistsByRole[advisor.design].push(advisor);
            }
        }
        // Fill roles with unlimited advisors if necessary
        for (const [role, panelists] of Object.entries(panelistsByRole)) {
            if (panelists.length === 0) {
                const moreAdvisors = await User_1.default.find({
                    role: 'adviser',
                    isApproved: true,
                    specializations: { $in: escapedQueryTerms.map(term => new RegExp(term, 'i')) },
                }).limit(5); // Dynamically fetch more advisors for panelist roles
                panelistsByRole[role].push(...moreAdvisors);
            }
        }
        // Combine all panelists
        const allPanelists = Object.values(panelistsByRole).flat();
        // Save panelists in the student's record
        student.panelists = allPanelists.map(panelist => panelist._id);
        await student.save();
        return res.status(200).json({
            message: 'Advisor chosen and panelists assigned successfully.',
            advisor: selectedAdvisor,
            panelists: allPanelists,
        });
    }
    catch (error) {
        console.error("Error choosing advisor:", error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};
exports.chooseNewAdvisor = chooseNewAdvisor;
const trainingProposal = async (req, res) => {
    const { terms } = req.body;
    // Ensure terms is an array
    if (!terms || !Array.isArray(terms)) {
        return res.status(400).json({ message: 'A list of terms with synonyms is required.' });
    }
    try {
        // Create a promise for each term entry
        const promises = terms.map(async (entry) => {
            const { terms: entryTerms, synonyms } = entry;
            // Validate the structure of the entry
            if (!Array.isArray(entryTerms) || !Array.isArray(synonyms)) {
                throw new Error(`Invalid entry: ${JSON.stringify(entry)}`);
            }
            // Always create a new synonym entry without checking for existing ones
            const synonymEntry = new Synonym({ terms: entryTerms, synonyms });
            await synonymEntry.save(); // Save the new synonym entry
            return synonymEntry; // Return the newly created entry
        });
        // Wait for all promises to complete
        const results = await Promise.all(promises);
        // Send back the created entries in the response
        res.status(201).json({ message: 'Synonyms added successfully', data: results });
    }
    catch (error) {
        console.error('Error training proposal:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.trainingProposal = trainingProposal;
const editUserProfile = async (req, res) => {
    var _a;
    const { id } = req.params; // Admin ID
    const { name, email, deleteProfileImage } = req.body; // Data from request body
    const profileImage = (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename; // Get new profile image if exists
    try {
        // Find the admin by ID
        const user = await User_1.default.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Prepare the update object conditionally
        const updateData = {
            name,
            email,
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
exports.editUserProfile = editUserProfile;
const resetUserPassword = async (req, res) => {
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
exports.resetUserPassword = resetUserPassword;
const getStudentInfoAndProposal = async (req, res) => {
    try {
        const userId = req.params.userId; // Assuming you're passing the userId as a parameter
        const user = await User_1.default.findById(userId)
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
            channelId: user.channelId,
            manuscriptStatus: user.manuscriptStatus,
            proposal: proposal ? {
                proposalTitle: proposal.proposalTitle,
                proposalText: proposal.proposalText,
                submittedAt: proposal.submittedAt
            } : null
        };
        res.status(200).json(response);
    }
    catch (error) {
        console.error('Error fetching student info and proposal:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.getStudentInfoAndProposal = getStudentInfoAndProposal;
const pdfDetails_1 = __importDefault(require("../models/pdfDetails"));
const mongodb_1 = require("mongodb");
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
const searchArticles = async (req, res) => {
    const { query } = req.query;
    try {
        const articles = await pdfDetails_1.default.find({
            $or: [
                { title: new RegExp(query, 'i') },
                { authors: new RegExp(query, 'i') }
            ]
        }, 'title authors dateUploaded datePublished pdf');
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
exports.searchArticles = searchArticles;
const markTaskAsCompleted = async (req, res) => {
    const { taskId } = req.params;
    try {
        // Find the student with the specific task
        const student = await User_1.default.findOne({ 'tasks._id': taskId });
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
        // console.log('Task before saving:', task); // Log the task state
        await student.save();
        // After saving the student
        res.status(200).json({ message: 'Task marked as completed', task });
    }
    catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.markTaskAsCompleted = markTaskAsCompleted;
const getTasks = async (req, res) => {
    const { userId } = req.params; // Use studentId instead of taskId
    // console.log('Received studentId:', userId); // Log the received studentId
    try {
        // Find the student and populate tasks
        const student = await User_1.default.findById(userId).select('tasks');
        if (!student) {
            // console.log('No student found with studentId:', userId);
            return res.status(404).json({ message: 'Student not found' });
        }
        // Return the tasks
        res.status(200).json({ tasks: student.tasks });
    }
    catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.getTasks = getTasks;
// Endpoint to get task progress
const getTaskProgress = async (req, res) => {
    const { userId } = req.params;
    try {
        const student = await User_1.default.findById(userId).select('tasks');
        if (!student || student.tasks.length === 0) {
            return res.status(404).json({ message: 'No tasks found for this student' });
        }
        // Calculate completed task percentage
        const completedTasks = student.tasks.filter((task) => task.isCompleted).length;
        const totalTasks = student.tasks.length;
        const progress = Math.round((completedTasks / totalTasks) * 100);
        res.status(200).json({ progress });
    }
    catch (error) {
        console.error('Error fetching task progress:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.getTaskProgress = getTaskProgress;
const updateProposalTitle = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { newTitle } = req.body;
        const user = await User_1.default.findById(userId);
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
    }
    catch (error) {
        console.error('Error updating proposal title:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.updateProposalTitle = updateProposalTitle;
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
const trainModel = async (req, res) => {
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
                        // console.log('Adding document:', keywordText);
                        manager.addDocument(language, keywordText, sentiment);
                    });
                }
                else {
                    throw new Error('Invalid input data for a specific training entry.');
                }
            });
        }
        else {
            throw new Error('Invalid input data.');
        }
        await manager.train();
        manager.save();
        res.json({ message: 'Training data with keywords added successfully!' });
    }
    catch (error) {
        console.error('Error training model:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.trainModel = trainModel;
const pdfDetails_2 = __importDefault(require("../models/pdfDetails"));
const getPdfKeywordsCount = async (req, res) => {
    try {
        // Fetch the keywords from the Keywords collection
        const keywords = await Keywords_1.default.find();
        // Ensure there are keywords to search for
        if (keywords.length === 0) {
            return res.status(404).json({ error: "No keywords found" });
        }
        // Count documents that match each keyword in the title
        const counts = await Promise.all(keywords.map(async (keywordDoc) => {
            const keyword = keywordDoc.keyword; // Extract the keyword from the document
            // Count PdfDetails documents that contain the keyword in the title (case-insensitive)
            const count = await pdfDetails_2.default.countDocuments({
                title: { $regex: keyword, $options: 'i' }, // Case-insensitive regex search
            });
            return { category: keyword, value: count }; // Return the category (keyword) and its count
        }));
        // Send the counts as a response
        res.status(200).json(counts);
    }
    catch (error) {
        console.error("Error fetching PdfDetails count:", error);
        res.status(500).json({ error: "Failed to fetch PdfDetails count" });
    }
};
exports.getPdfKeywordsCount = getPdfKeywordsCount;
// GET endpoint to fetch all keywords
const getKeywords = async (req, res) => {
    try {
        const keywords = await Keywords_1.default.find();
        res.status(200).json(keywords);
    }
    catch (error) {
        console.error("Error fetching keywords:", error);
        res.status(500).json({ error: "Failed to fetch keywords" });
    }
};
exports.getKeywords = getKeywords;
const Keywords_1 = __importDefault(require("../models/Keywords")); // Assuming the model is in models/Keyword.ts
// POST endpoint to add multiple keywords to the database
const addKeywords = async (req, res) => {
    try {
        const { keywords } = req.body;
        // Validate that keywords is provided and is an array
        if (!keywords || !Array.isArray(keywords)) {
            return res.status(400).json({ error: "Keywords should be an array" });
        }
        // Ensure each keyword is a string
        const validKeywords = keywords.filter((keyword) => typeof keyword === "string");
        // Create an array of new keyword documents
        const keywordDocs = validKeywords.map((keyword) => new Keywords_1.default({ keyword }));
        // Save all keywords to the database at once
        await Keywords_1.default.insertMany(keywordDocs);
        res.status(201).json({ message: "Keywords added successfully", keywords: validKeywords });
    }
    catch (error) {
        console.error("Error adding keywords:", error);
        res.status(500).json({ error: "Failed to add keywords" });
    }
};
exports.addKeywords = addKeywords;
