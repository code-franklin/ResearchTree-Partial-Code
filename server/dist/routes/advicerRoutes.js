"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const advicerControllers_1 = require("../controllers/advicerControllers");
// Reset Voting
const advicerControllers_2 = require("../controllers/advicerControllers");
// Grading
const advicerControllers_3 = require("../controllers/advicerControllers");
const advicerControllers_4 = require("../controllers/advicerControllers");
// Data Analytics
const advicerControllers_5 = require("../controllers/advicerControllers");
const uploadProfile_1 = __importDefault(require("../middleware/uploadProfile"));
const uploadPdf_1 = __importDefault(require("../middleware/uploadPdf"));
const router = express_1.default.Router();
router.post('/register', uploadProfile_1.default.single('profileImage'), advicerControllers_1.registration);
router.post('/login', advicerControllers_1.login);
// Edit Profile
router.put('/advicer-user/:id', uploadProfile_1.default.single('profileImage'), advicerControllers_1.editAdvicerProfile);
router.put('/advicer-user/:id/reset-password', advicerControllers_1.resetAdvicerPassword);
// Add the route for CKEditor token
router.get('/get-ckeditor-token/:userId', advicerControllers_1.getToken);
router.get('/specializations', advicerControllers_1.getSpecializations);
// Data Analytics
router.get('/:adviserId/panelist-accepted-count', advicerControllers_5.getPanelistStudentsAccepted);
router.get('/:adviserId/course-count', advicerControllers_5.getBSITBSCStudentsByAdviser);
router.get('/:adviserId/newUploads-count', advicerControllers_5.getNewUploadsByAdviser);
router.get('/:adviserId/reviseOnAdvicer-count', advicerControllers_5.getReadyToReviseOnAdvicerByAdviser);
router.get('/:adviserId/readyToDefense-count', advicerControllers_5.getReadyToDefenseStudentByAdviser);
router.get('/:adviserId/approvedOnAdvicer-count', advicerControllers_5.getPanelistStudentsReadyToDefense);
router.get('/:adviserId/reivseOnAdvicer-count', advicerControllers_5.getPanelistStudentsReviseOnPanel);
router.get('/:adviserId/approvedOnPanel-count', advicerControllers_5.getPanelistStudentsApprovedOnPanel);
/* Adviser routes */
router.get('/advisor-students/:advisorId', advicerControllers_1.getAdviserStudents);
// Searching Upload
router.post('/synonyms', advicerControllers_4.postSynonyms); // done
router.get('/synonyms/:term', advicerControllers_4.getSynonymsTerm); // done
router.post('/search', advicerControllers_4.postSearch); // done
router.post('/upload-files', uploadPdf_1.default.single('file'), advicerControllers_4.postUploadFiles); // done
router.get('/get-files', advicerControllers_4.getFiles); // done
router.post('/analyze', advicerControllers_4.postAnalyze); // done
// Task for My Advicee
router.post('/add-task/:studentId', advicerControllers_1.postAddTaskMyAdvicee);
router.get('/tasks/:studentId', advicerControllers_1.getTasksMyAdvicee);
router.delete('/delete-task/:studentId/:taskId', advicerControllers_1.deleteTaskFromStudent);
router.get('/tasks/progress/:studentId', advicerControllers_1.getTasksProgressStudent);
// Update Status for Manuscript
router.patch('/thesis/manuscript-status', advicerControllers_1.updateManuscriptStatus);
router.patch('/thesis/panel/manuscript-status', advicerControllers_1.updatePanelManuscriptStatus);
// Get Panelist Students
router.get('/panelist-students/:advisorId', advicerControllers_1.getPanelistStudents);
router.post('/respondTostudent', advicerControllers_1.respondToStudent);
// Grading for student
router.get("/fetch-rubrics", advicerControllers_3.fetchRubrics);
router.post('/submit-student/grade', advicerControllers_3.submitGrades);
router.get('/fetch/adviser-student/grades/:studentId', advicerControllers_3.fetchGrades);
router.get('/fetch/adviser-FinalGrades/grades/:studentId/:rubricId', advicerControllers_3.fetchFinalStudentGrades);
// router.post('/grade-student', gradePanelToStudent);
// admin
router.get('/students-manage/:advisorId', advicerControllers_1.listStudentsManage);
router.put('/update-student-status', advicerControllers_1.updateStatusStudent);
// Reset Voting
router.post('/reset-manuscript-status/:userId', advicerControllers_2.resetVotes);
exports.default = router;
