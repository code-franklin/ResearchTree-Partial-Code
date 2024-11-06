import express, { Router } from 'express';

// Profile Management
import { 
    registerAdmin, 
    loginAdmin, 
    getPendingUsersAdvicer, 
    getPendingUsersStudent, 
    approveUser, 
    declineUser, 
    getAllUsersStudent, 
    getAllUsersAdvicer, 
    deleteUser 
} from '../controllers/adminController';

// Specialization Management
import { 
    getSpecializations, 
    addSpecialization, 
    updateSpecialization, 
    deleteSpecialization 
} from '../controllers/adminController';

// View Analytics
import { 
    countReadyToDefenseManuscripts, 
    countReviseOnAdvicerManuscripts, 
    countReviseOnAPanelManuscripts,
    countApprovedOnPanelManuscripts
} from '../controllers/adminController';

// Advicer Info w/ Handle Manu
import { 
    fetchAdviserInfoWithStudents,
    fetchPanelistInfoWithStudents
} from '../controllers/adminController';

import upload from '../middleware/upload';
const router: Router = express.Router();

// Authentication
router.post('/register', upload.single('profileImage'), registerAdmin);
router.post('/login', loginAdmin);

// User Management
router.get('/advicer-pending', getPendingUsersAdvicer);
router.get('/student-pending', getPendingUsersStudent);
router.get('/student-users', getAllUsersStudent);
router.get('/advicer-users', getAllUsersAdvicer);
router.delete('/users/:id', deleteUser);
router.put('/approve/:userId', approveUser);
router.put('/decline/:userId', declineUser);

// Specialization Management
router.get('/specializations', getSpecializations);
router.post('/specializations', addSpecialization);
router.put('/specializations/:id', updateSpecialization);
router.delete('/specializations/:id', deleteSpecialization);

// View Analytics
router.get('/manuscripts/readyToDefense/count', countReadyToDefenseManuscripts);
router.get('/manuscripts/reviseOnAdvicer/count', countReviseOnAdvicerManuscripts);
router.get('/manuscripts/reviseOnPanel/count', countReviseOnAPanelManuscripts);
router.get('/manuscripts/approvedOnPanel/count', countApprovedOnPanelManuscripts);

// Advicer Handle Manuscript
router.get('/advicer/handle/manuscript', fetchAdviserInfoWithStudents);
router.get('/panelist/handle/manuscript', fetchPanelistInfoWithStudents);


export default router;