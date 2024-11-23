import express, { Router } from 'express';

import { addKeywords, getKeywords, getPdfKeywordsCount } from "../controllers/studentControllers";


import { 
    createNewProposal, 
    chooseNewAdvisor,
    getStudentInfoAndProposal,
    updateProposalTitle,
    trainingProposal,
    markTaskAsCompleted,
    getTasks, 
    getTaskProgress,
    getAllArticles,
    searchArticles,
    editUserProfile,
    resetUserPassword
/*     postUploadManuscript */
} from '../controllers/studentControllers';

// Grading

import { 
    fetchRubrics,
    fetchGrades,
    fetchFinalGrade
} from '../controllers/studentControllers';

const router: Router = express.Router();
import uploadProfile from '../middleware/uploadProfile';

router.post('/submit-proposal', createNewProposal);
router.post('/choose-advisor', chooseNewAdvisor);


// Update Data and Reset Password
router.put('/student-user/:id', uploadProfile.single('profileImage'),editUserProfile);
router.put('/student-user/:id/reset-password', resetUserPassword);

// Task for Advicer 
router.get('/tasks/:userId',getTasks);
router.patch('/mark-task/:taskId', markTaskAsCompleted);
router.get('/tasks/progress/:userId', getTaskProgress);

router.get('/advisor-info-StudProposal/:userId', getStudentInfoAndProposal);
router.put('/update-proposal-title/:userId', updateProposalTitle);
router.post('/train-model', trainingProposal);

// Grading
router.get("/fetch-rubrics", fetchRubrics);
router.get('/fetch-student/grades/:userId', fetchGrades);
router.get('/fetch-student/FinalGrades/:userId/:rubricId', fetchFinalGrade);

router.get('/articles', getAllArticles);
router.get('/articles/search', searchArticles);
/* router.post('/upload-manuscript', postUploadManuscript); */

// Route to add a new keyword
router.post("/keywords", addKeywords);

// Route to get all keywords
router.get("/CountKeywords", getKeywords);

router.get("/PdfKeywordsCount", getPdfKeywordsCount);

export default router;
