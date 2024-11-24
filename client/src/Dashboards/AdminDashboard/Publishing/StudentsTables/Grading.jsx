import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

export default function GradingTable({ panelistId, studentId }) {
  const [rubrics, setRubrics] = useState([]); // All rubrics
  const [selectedRubricId, setSelectedRubricId] = useState(null); // Selected rubricId
  const [categories, setCategories] = useState([]);
  const [grades, setGrades] = useState([]);
  const [title, setTitle] = useState('');
  const [panelists, setPanelists] = useState([]);
  const [selectedPanelist, setSelectedPanelist] = useState(null);
  const [gradeLabels, setGradeLabels] = useState({});
  const [gradesData, setGradesData] = useState([]);
  const [gradeSummary, setGradeSummary] = useState(null);
  const [finalGradeData, setFinalGradeData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedPanelistId, setSelectedPanelistId] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  const [isGradeForStudentModalOpen, setGradeForStudentModalOpen] = useState(false);  
  const user = JSON.parse(localStorage.getItem('user'));


  // Fetch grades and initialize rubrics

  const handleGrade = (studentId, panelistId) => {
    setGradeForStudentModalOpen(true);
    setSelectedStudentId(studentId);
    setSelectedPanelistId(panelistId);
  };
  const closeGradingModal = () => {
    setGradeForStudentModalOpen(false); // Close modal
    setSelectedStudentId(null);
    setSelectedPanelistId(null);
  };


  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await axios.get(
          `http://localhost:7000/api/student/fetch-student/grades/${studentId}`
        );
        const gradesData = response.data;

        if (gradesData.length > 0) {
          // Extract unique rubrics
          const uniqueRubrics = Array.from(
            new Set(gradesData.map((g) => g.rubricId?._id))
          ).map((id) => gradesData.find((g) => g.rubricId?._id === id).rubricId);

          setRubrics(uniqueRubrics);
          setGradesData(gradesData);

          // Set the first rubric as selected by default
          if (uniqueRubrics.length > 0) {
            setSelectedRubricId(uniqueRubrics[0]._id);
          }
        } else {
          console.warn('No grades data found for the user.');
        }
      } catch (error) {
        console.error('Error fetching grades:', error);
      }
    };

    fetchGrades();
  }, [studentId]);

  // Update categories, grade labels, and panelists when a rubric is selected
  useEffect(() => {
    if (selectedRubricId && gradesData.length > 0) {
      const rubricGrades = gradesData.filter(
        (grade) => grade.rubricId?._id === selectedRubricId
      );

      if (rubricGrades.length > 0) {
        const rubric = rubricGrades[0].rubricId || {};
        setTitle(rubric.title || 'No Title');

        const parsedCategories = rubric.criteria?.map((c) => c.category) || [];
        setCategories(parsedCategories);

        const parsedGradeLabels = rubric.criteria?.reduce((acc, c) => {
          acc[c.category] = c.gradeLabels || {};
          return acc;
        }, {}) || {};
        setGradeLabels(parsedGradeLabels);

        const panelistIds = rubricGrades.map((g) => g.panelistId);
        setPanelists(panelistIds);

        // Pre-select the first panelist
        if (panelistIds.length > 0) {
          handlePanelistClick(panelistIds[0]._id, rubricGrades);
        }
      } else {
        console.warn('No grades found for selected rubric:', selectedRubricId);
      }
    }
  }, [selectedRubricId, gradesData]);

  // Handle panelist selection and update grades
  const handlePanelistClick = (panelistId, rubricGrades) => {
    setSelectedPanelist(panelistId);

    const panelistGrades = rubricGrades.find(
      (g) => g.panelistId?._id === panelistId
    );

    if (panelistGrades?.grades?.length) {
      setGrades(panelistGrades.grades);
      setGradeSummary({
        totalGradeValue: panelistGrades.totalGradeValue,
        overallGradeLabel: panelistGrades.overallGradeLabel,
        gradedAt: panelistGrades.gradedAt,
      });
    } else {
      // Reset grade summary if no grades available for the panelist
      setGradeSummary(null);
      console.warn('No grades available for panelist:', panelistId);
    }
  };

  const fetchFinalGrade = async () => {
    try {
      const response = await axios.get(
        `http://localhost:7000/api/student/fetch-student/FinalGrades/${studentId}/${selectedRubricId}` // Include selectedRubricId in the endpoint
      );
      setFinalGradeData(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching final grade:', error);
    }
  };

  const gradeColors = {
    excellent: 'bg-green-500',
    good: 'bg-blue-500',
    satisfactory: 'bg-yellow-500',
    needsImprovement: 'bg-red-500',
  };
  




  return (
    <div className="h-[700px] text-[14px] p-4 w-[1400px] ml-[390px] mt-[380px]">

     {/* Panelist Buttons */}
{panelists.length > 0 ? (
  <div className="flex justify-center mb-4">
    {panelists.map((panelist) => (
      <button
        key={panelist._id}
        className={`px-4 py-2 m-2 text-white rounded ${
          selectedPanelist === panelist._id ? 'bg-[#4B4B4B]' : 'bg-[#2B2B2B]'
        }`}
        onClick={() => handlePanelistClick(panelist._id, gradesData)}
      >
        {panelist.name}
      </button>
    ))}
    {grades.length > 0 && (
      <button
        className="bg-blue-600 text-white px-4 py-2 m-2 rounded"
        onClick={fetchFinalGrade}
      >
        Final Grade
      </button>
    )}
  </div>
) : null}

{/* Rubrics Buttons */}
<div className="flex justify-center mb-4">
  {rubrics.map((rubric) => (
    <button
      key={rubric._id}
      className={`h-[50px] w-[1500px] text-[20px] m-2 text-white rounded ${
        selectedRubricId === rubric._id ? 'bg-[#4B4B4B]' : 'bg-[#2B2B2B]'
      }`}
      onClick={() => setSelectedRubricId(rubric._id)}
    >
      {rubric.title}
    </button>
  ))}
</div>



{/* Grading Table */}
{categories.length > 0 && grades.length > 0 ? (
  <div className="grid grid-cols-5 gap-2 text-white text-center mt-4">
    <div className="bg-[#575757] font-bold p-4">Criterion</div>
    {['4', '3', '2', '1'].map((score) => {
      const labelColor = {
        '4': 'bg-green-500', // Excellent
        '3': 'bg-blue-500', // Good
        '2': 'bg-yellow-500', // Satisfactory
        '1': 'bg-red-500', // Needs Improvement
      }[score];

      return (
        <div key={score} className={`p-4 font-bold ${labelColor}`}>
          {score}
        </div>
      );
    })}

    {categories.map((category) => {
      const panelistGrade = grades.find(
        (grade) => grade.criterion === category
      );

      return (
        <React.Fragment key={category}>
          <div className="bg-[#2B2B2B] text-[25px] font-bold p-4 capitalize">
            {category}
          </div>
          {['4', '3', '2', '1'].map((score) => {
            const gradeLabel = {
              '4': 'excellent',
              '3': 'good',
              '2': 'satisfactory',
              '1': 'needsImprovement',
            }[score];

            const gradeColor =
              panelistGrade && panelistGrade.gradeValue === parseInt(score)
                ? gradeColors[gradeLabel] || 'bg-gray-600'
                : 'bg-gray-600';

            return (
              <div key={score} className={`p-4 ${gradeColor}`}>
                {gradeLabels[category] && gradeLabels[category][gradeLabel]
                  ? gradeLabels[category][gradeLabel]
                  : 'N/A'}
              </div>
            );
          })}
        </React.Fragment>
      );
    })}
  </div>
) : (
  <p className=""></p>
)}

{/* Grade Summary */}
{gradeSummary ? (
  <div className="text-white mt-4 p-4 bg-[#2B2B2B] rounded flex flex-col items-center justify-center text-center">
    <h3 className="text-[20px] font-bold mb-2">Grade Summary</h3>
    <p className="text-[16px]">Total Grade: {gradeSummary.totalGradeValue}</p>
    <p className="text-[16px]">Overall Grade: {gradeSummary.overallGradeLabel}</p>
    <p className="text-[14px]">Graded At: {new Date(gradeSummary.gradedAt).toLocaleString()}</p>
  </div>
) : (
  <p className="text-center text-white text-[30px] mt-[260px]">
    <div className=''>
    <l-bouncy

size="45"
speed="1.75"
color="#1e1e" 
></l-bouncy>

<p>No grade yet.</p>
    </div>
</p>
)}
{/* Final Grade Modal */}
<Dialog
  open={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  fullWidth
  maxWidth="sm"
  PaperProps={{
    style: {
      backgroundColor: '#1E1E1E',
      color: 'white',
    },
  }}
>
  <DialogTitle style={{ backgroundColor: '#1E1E1E', color: 'white' }}>
    Final Grades
  </DialogTitle>
  <DialogContent style={{ backgroundColor: '#1E1E1E' }}>
    {finalGradeData ? (
      <>
        {finalGradeData.rubrics.map((rubric) => (
          <div
            key={rubric.rubricId}
            className="mb-4 text-center"
            style={{
              color: 'white',
              border: '1px solid #333',
              borderRadius: '8px',
              padding: '16px',
              margin: '8px auto',
              maxWidth: '500px',
            }}
          >
            <Typography
              variant="h6"
              style={{ fontWeight: 'bold', marginBottom: '8px' }}
            >
              {rubric.rubricTitle}
            </Typography>
            <Typography style={{ marginBottom: '4px' }}>
              <strong>Student:</strong> {finalGradeData.student.name}
            </Typography>
            <Typography>
              <strong>Final Grade:</strong> {rubric.totalGradeValue} (
              {rubric.overallGradeLabel})
            </Typography>
          </div>
        ))}
      </>
    ) : (
      <Typography
        style={{
          color: 'white',
          textAlign: 'center',
          marginTop: '20px',
        }}
      >
        No final grade data available.
      </Typography>
    )}
  </DialogContent>
</Dialog>

      {/* Material UI Modal for Grading */}
      <Dialog
        open={isGradeForStudentModalOpen}
        onClose={closeGradingModal}
        fullWidth
        maxWidth='xl'
      >
        <DialogContent sx={{ height: "1200px", background: '#1E1E1E'}}>
        {selectedStudentId && selectedPanelistId && (
            <GradingProcess
              studentId={selectedStudentId}
              panelistId={selectedPanelistId}
            />
          )}
        </DialogContent>
      
      </Dialog>
    </div>
  );
}
