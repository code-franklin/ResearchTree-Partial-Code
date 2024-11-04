import express, { Router } from 'express';
import { 
    registration, 
    login, 
    getSpecializations,
    listStudentsManage,
    updateStatusStudent,
    getAdviserStudents,
    getPanelistStudents,
    respondToStudent,
    getToken,
    postAddTaskMyAdvicee,
    getTasksMyAdvicee,
    deleteTaskFromStudent,
    updateManuscriptStatus,
    getTasksProgressStudent,
    updatePanelManuscriptStatus,
    gradePanelToStudent
} from '../controllers/advicerControllers';

import upload from '../middleware/upload';

const router: Router = express.Router();

router.post('/register', upload.single('profileImage'), registration);
router.post('/login', login);

// Add the route for CKEditor token
router.get('/get-ckeditor-token/:userId', getToken);

router.get('/specializations', getSpecializations);

/* Adviser routes */
router.get('/advisor-students/:advisorId', getAdviserStudents);

// Task for My Advicee
router.post('/add-task/:studentId', postAddTaskMyAdvicee);
router.get('/tasks/:studentId', getTasksMyAdvicee);
router.delete('/delete-task/:studentId/:taskId', deleteTaskFromStudent);
router.get('/tasks/progress/:studentId', getTasksProgressStudent);



// Update Status for Manuscript
router.patch('/thesis/manuscript-status', updateManuscriptStatus);
router.patch('/thesis/panel/manuscript-status', updatePanelManuscriptStatus);

// Get Panelist Students
router.get('/panelist-students/:advisorId', getPanelistStudents);
router.post('/respond-student', respondToStudent);
router.post('/grade-student', gradePanelToStudent);


// admin
router.get('/students-manage/:advisorId', listStudentsManage);
router.put('/update-student-status', updateStatusStudent);


export default router;