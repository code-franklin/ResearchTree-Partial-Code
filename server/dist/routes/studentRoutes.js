"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const studentControllers_1 = require("../controllers/studentControllers");
const studentControllers_2 = require("../controllers/studentControllers");
// Grading
const studentControllers_3 = require("../controllers/studentControllers");
const router = express_1.default.Router();
const uploadProfile_1 = __importDefault(require("../middleware/uploadProfile"));
router.post('/submit-proposal', studentControllers_2.createNewProposal);
router.post('/choose-advisor', studentControllers_2.chooseNewAdvisor);
// Update Data and Reset Password
router.put('/student-user/:id', uploadProfile_1.default.single('profileImage'), studentControllers_2.editUserProfile);
router.put('/student-user/:id/reset-password', studentControllers_2.resetUserPassword);
// Task for Advicer 
router.get('/tasks/:userId', studentControllers_2.getTasks);
router.patch('/mark-task/:taskId', studentControllers_2.markTaskAsCompleted);
router.get('/tasks/progress/:userId', studentControllers_2.getTaskProgress);
router.get('/advisor-info-StudProposal/:userId', studentControllers_2.getStudentInfoAndProposal);
router.put('/update-proposal-title/:userId', studentControllers_2.updateProposalTitle);
router.post('/train-model', studentControllers_2.trainingProposal);
// Grading
router.get("/fetch-rubrics", studentControllers_3.fetchRubrics);
router.get('/fetch-student/grades/:userId', studentControllers_3.fetchGrades);
router.get('/fetch-student/FinalGrades/:userId/:rubricId', studentControllers_3.fetchFinalGrade);
router.get('/articles', studentControllers_2.getAllArticles);
router.get('/articles/search', studentControllers_2.searchArticles);
/* router.post('/upload-manuscript', postUploadManuscript); */
// Route to add a new keyword
router.post("/keywords", studentControllers_1.addKeywords);
// Route to get all keywords
router.get("/CountKeywords", studentControllers_1.getKeywords);
router.get("/PdfKeywordsCount", studentControllers_1.getPdfKeywordsCount);
exports.default = router;
