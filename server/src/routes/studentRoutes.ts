import express, { Router } from 'express';
import { 
    createProposal, 
    chooseAdvisor,
    getStudentInfoAndProposal,
    updateProposalTitle,
    trainModel,
    markTaskAsCompleted,
    getTasks, 
    getTaskProgress,
/*     getAllArticles, */
    searchArticles,
/*     postUploadManuscript */
} from '../controllers/studentControllers';

const router: Router = express.Router();

router.post('/submit-proposal', createProposal);
router.post('/choose-advisor', chooseAdvisor);

// Task for Advicer 
router.get('/tasks/:userId',getTasks);
router.patch('/mark-task/:taskId', markTaskAsCompleted);
router.get('/tasks/progress/:userId', getTaskProgress);

router.get('/advisor-info-StudProposal/:userId', getStudentInfoAndProposal);
router.put('/update-proposal-title/:userId', updateProposalTitle);
router.post('/train-model', trainModel);


/* router.get('/articles', getAllArticles); */
router.get('/articles/search', searchArticles);
/* router.post('/upload-manuscript', postUploadManuscript); */

export default router;
