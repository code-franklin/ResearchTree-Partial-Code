"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// Data Analytics
const adminController_1 = require("../controllers/adminController");
// Profile Management
const adminController_2 = require("../controllers/adminController");
// Fetch Panelist Advicers
const adminController_3 = require("../controllers/adminController");
// Specialization Management
const adminController_4 = require("../controllers/adminController");
// View Analytics
const adminController_5 = require("../controllers/adminController");
// Advicer Info w/ Handle Manu
const adminController_6 = require("../controllers/adminController");
// Grading Management
const adminController_7 = require("../controllers/adminController");
const uploadProfile_1 = __importDefault(require("../middleware/uploadProfile"));
const router = express_1.default.Router();
// Authentication
router.post('/register', uploadProfile_1.default.single('profileImage'), adminController_2.registerAdmin);
router.post('/login', adminController_2.loginAdmin);
// Data Visualization
router.get("/pdfdetails/count", adminController_1.getPdfDetailsCount);
// User Management
router.get('/advicer-pending', adminController_2.getPendingUsersAdvicer);
router.get('/student-pending', adminController_2.getPendingUsersStudent);
// Fetch Panelist Advicers
router.get('/fetch-advisors', adminController_3.fetchPanelists);
router.get('/student-users', adminController_2.getAllUsersStudent);
router.get('/advicer-users', adminController_2.getAllUsersAdvicer);
router.put('/student-users/:id', uploadProfile_1.default.single('profileImage'), adminController_2.updateUserStudent);
router.put('/advicer-users/:id', uploadProfile_1.default.single('profileImage'), adminController_2.updateUserAdvicer);
router.put('/users/:id/reset-password', adminController_2.resetUserPassword);
router.put('/admin-user/:id', uploadProfile_1.default.single('profileImage'), adminController_2.editAdminProfile);
router.put('/admin-user/:id/reset-password', adminController_2.resetAdminPassword);
// router.delete("/users/:id/delete-image", deleteProfileImage);
router.delete('/users/:id', adminController_2.deleteUser);
router.put('/approve/:userId', adminController_2.approveUser);
router.put('/decline/:userId', adminController_2.declineUser);
// Specialization Management
router.get('/specializations', adminController_4.getSpecializations);
router.post('/specializations', adminController_4.addSpecialization);
router.put('/specializations/:id', adminController_4.updateSpecialization);
router.delete('/specializations/:id', adminController_4.deleteSpecialization);
// View AnalyticsS
router.get('/students/Panelist', adminController_5.getAllAdvicers);
router.get('/students/AllPanelist', adminController_5.countStudentsWithPanelists);
router.get('/students/courses', adminController_5.countStudentsByCourse);
router.get('/students/without-advisors', adminController_5.countStudentsWithoutAdvisors);
router.get('/advisors/accepted-students-count', adminController_5.countAcceptedStudentsForAdvisors);
router.get('/manuscripts/noStatusManuscript/count', adminController_5.countNoStatusManuscripts);
router.get('/manuscripts/readyToDefense/count', adminController_5.countReadyToDefenseManuscripts);
router.get('/manuscripts/reviseOnAdvicer/count', adminController_5.countReviseOnAdvicerManuscripts);
router.get('/manuscripts/reviseOnPanel/count', adminController_5.countReviseOnAPanelManuscripts);
router.get('/manuscripts/approvedOnPanel/count', adminController_5.countApprovedOnPanelManuscripts);
// Advicer Handle Manuscript
router.get('/list-student/manuscript', adminController_6.fetchAllStudentManuscript);
router.get('/advicer/handle/manuscript', adminController_6.fetchAdviserInfoWithStudents);
router.get('/panelist/handle/manuscript', adminController_6.fetchPanelistInfoWithStudents);
// Grading Management
router.get("/rubrics", adminController_7.getRubrics);
router.post("/rubrics", adminController_7.createRubric);
router.put("/rubrics/:id", adminController_7.updateRubric);
router.delete("/rubrics/:id", adminController_7.deleteRubric);
// Admin routes grading
router.get('/grades/student/:studentId', adminController_7.fetchGrades);
router.get('/fetch/admin-FinalGrades/grades/:studentId', adminController_7.fetchFinalStudentGrades);
router.get('/rubrics/grades', adminController_7.fetchAllGrades);
// Reset Voting
exports.default = router;
