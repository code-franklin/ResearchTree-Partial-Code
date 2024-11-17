import express, { Router } from 'express';
import { 
    createNewProposal, 
    chooseNewAdvisor,
    getStudentInfoAndProposal,
    updateProposalTitle,
    trainingProposal,
    markTaskAsCompleted,
    getTasks, 
    getTaskProgress,
/*     getAllArticles, */
    searchArticles,
    editUserProfile,
    resetUserPassword
/*     postUploadManuscript */
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


/* router.get('/articles', getAllArticles); */
router.get('/articles/search', searchArticles);
/* router.post('/upload-manuscript', postUploadManuscript); */

export default router;
