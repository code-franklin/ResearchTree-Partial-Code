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
    // gradePanelToStudent,
    editAdvicerProfile,
    resetAdvicerPassword
} from '../controllers/advicerControllers';

// Reset Voting
import { 
  resetVotes
} from '../controllers/advicerControllers';

// Grading
import { 
  fetchRubrics,
  submitGrades,
  fetchGrades,
  fetchFinalStudentGrades
} from '../controllers/advicerControllers';

import { 
    postSynonyms,
    getSynonymsTerm,
    postSearch,
    postUploadFiles,
    getFiles,
    postAnalyze
  } from '../controllers/advicerControllers';

  // Data Analytics
  import {
    getPanelistStudentsAccepted,
    getBSITBSCStudentsByAdviser,
    getNewUploadsByAdviser,
    getReadyToReviseOnAdvicerByAdviser,
    getReadyToDefenseStudentByAdviser,

    getPanelistStudentsReadyToDefense,
    getPanelistStudentsReviseOnPanel,
    getPanelistStudentsApprovedOnPanel
  } from '../controllers/advicerControllers';

import uploadProfile from '../middleware/uploadProfile';
import uploadPdf from '../middleware/uploadPdf';

const router: Router = express.Router();

router.post('/register', uploadProfile.single('profileImage'), registration);
router.post('/login', login);

// Edit Profile
router.put('/advicer-user/:id', uploadProfile.single('profileImage'),editAdvicerProfile);
router.put('/advicer-user/:id/reset-password', resetAdvicerPassword);

// Add the route for CKEditor token
router.get('/get-ckeditor-token/:userId', getToken);

router.get('/specializations', getSpecializations);

// Data Analytics
router.get('/:adviserId/panelist-accepted-count', getPanelistStudentsAccepted);
router.get('/:adviserId/course-count', getBSITBSCStudentsByAdviser);

router.get('/:adviserId/newUploads-count', getNewUploadsByAdviser);
router.get('/:adviserId/reviseOnAdvicer-count', getReadyToReviseOnAdvicerByAdviser);
router.get('/:adviserId/readyToDefense-count', getReadyToDefenseStudentByAdviser);

router.get('/:adviserId/approvedOnAdvicer-count', getPanelistStudentsReadyToDefense);
router.get('/:adviserId/reivseOnAdvicer-count', getPanelistStudentsReviseOnPanel);
router.get('/:adviserId/approvedOnPanel-count', getPanelistStudentsApprovedOnPanel);

/* Adviser routes */
router.get('/advisor-students/:advisorId', getAdviserStudents);

// Searching Upload
router.post('/synonyms', postSynonyms); // done
router.get('/synonyms/:term', getSynonymsTerm); // done
router.post('/search', postSearch); // done
router.post('/upload-files', uploadPdf.single('file'), postUploadFiles); // done
router.get('/get-files', getFiles); // done

router.post('/analyze', postAnalyze); // done

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
router.post('/respondTostudent', respondToStudent);

// Grading for student
router.get("/fetch-rubrics", fetchRubrics);
router.post('/submit-student/grade', submitGrades);
router.get('/fetch/adviser-student/grades/:studentId', fetchGrades);
router.get('/fetch/adviser-FinalGrades/grades/:studentId/:rubricId', fetchFinalStudentGrades);

// router.post('/grade-student', gradePanelToStudent);

// admin
router.get('/students-manage/:advisorId', listStudentsManage);
router.put('/update-student-status', updateStatusStudent);

// Reset Voting
router.post('/reset-manuscript-status/:userId', resetVotes);



export default router;