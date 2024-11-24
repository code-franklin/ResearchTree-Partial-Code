import express, { Router } from 'express';

// Data Analytics
import { 
    getPdfDetailsCount
} from '../controllers/adminController';



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
    deleteUser,
    updateUserStudent,
    resetUserPassword,
    updateUserAdvicer,
    editAdminProfile,
    resetAdminPassword
    // deleteProfileImage
} from '../controllers/adminController';

// Fetch Panelist Advicers
import { fetchPanelists } from '../controllers/adminController';

// Specialization Management
import { 
    getSpecializations, 
    addSpecialization, 
    updateSpecialization, 
    deleteSpecialization 
} from '../controllers/adminController';

// View Analytics
import {
    getAllAdvicers,
    countStudentsWithPanelists,
    countStudentsByCourse,
    countStudentsWithoutAdvisors,
    countAcceptedStudentsForAdvisors,
    countReadyToDefenseManuscripts , 
    countReviseOnAdvicerManuscripts, 
    countReviseOnAPanelManuscripts,
    countApprovedOnPanelManuscripts,
    countNoStatusManuscripts
} from '../controllers/adminController';

// Advicer Info w/ Handle Manu
import {
    fetchAllStudentManuscript,
    fetchAdviserInfoWithStudents,
    fetchPanelistInfoWithStudents
} from '../controllers/adminController';

// Grading Management
import {
    getRubrics,
    createRubric,
    updateRubric,
    deleteRubric,

// Can Grade
    fetchGrades,
    fetchAllGrades,
    fetchFinalStudentGrades
  } from "../controllers/adminController";
  

import uploadProfile from '../middleware/uploadProfile';
const router: Router = express.Router();

// Authentication
router.post('/register', uploadProfile.single('profileImage'), registerAdmin);
router.post('/login', loginAdmin);

// Data Visualization
router.get("/pdfdetails/count", getPdfDetailsCount);

// User Management
router.get('/advicer-pending',  getPendingUsersAdvicer);
router.get('/student-pending', getPendingUsersStudent);

// Fetch Panelist Advicers
router.get('/fetch-advisors', fetchPanelists);
router.get('/student-users', getAllUsersStudent);
router.get('/advicer-users', getAllUsersAdvicer);

router.put('/student-users/:id', uploadProfile.single('profileImage'),updateUserStudent);
router.put('/advicer-users/:id', uploadProfile.single('profileImage'),updateUserAdvicer);
router.put('/users/:id/reset-password', resetUserPassword);

router.put('/admin-user/:id', uploadProfile.single('profileImage'),editAdminProfile);
router.put('/admin-user/:id/reset-password', resetAdminPassword);
// router.delete("/users/:id/delete-image", deleteProfileImage);

router.delete('/users/:id', deleteUser);
router.put('/approve/:userId', approveUser);
router.put('/decline/:userId', declineUser);


// Specialization Management
router.get('/specializations', getSpecializations);
router.post('/specializations', addSpecialization);
router.put('/specializations/:id', updateSpecialization);
router.delete('/specializations/:id', deleteSpecialization);

// View AnalyticsS
router.get('/students/Panelist',getAllAdvicers)
router.get('/students/AllPanelist', countStudentsWithPanelists);
router.get('/students/courses', countStudentsByCourse);
router.get('/students/without-advisors', countStudentsWithoutAdvisors);
router.get('/advisors/accepted-students-count', countAcceptedStudentsForAdvisors);
router.get('/manuscripts/noStatusManuscript/count', countNoStatusManuscripts);
router.get('/manuscripts/readyToDefense/count', countReadyToDefenseManuscripts);

router.get('/manuscripts/reviseOnAdvicer/count', countReviseOnAdvicerManuscripts);
router.get('/manuscripts/reviseOnPanel/count', countReviseOnAPanelManuscripts);
router.get('/manuscripts/approvedOnPanel/count', countApprovedOnPanelManuscripts);

// Advicer Handle Manuscript
router.get('/list-student/manuscript', fetchAllStudentManuscript);
router.get('/advicer/handle/manuscript', fetchAdviserInfoWithStudents);
router.get('/panelist/handle/manuscript', fetchPanelistInfoWithStudents);

// Grading Management
router.get("/rubrics", getRubrics);
router.post("/rubrics", createRubric);
router.put("/rubrics/:id", updateRubric);
router.delete("/rubrics/:id", deleteRubric);

// Admin routes grading
router.get('/grades/student/:studentId', fetchGrades);
router.get('/fetch/admin-FinalGrades/grades/:studentId', fetchFinalStudentGrades);
router.get('/rubrics/grades', fetchAllGrades);

// Reset Voting


export default router;