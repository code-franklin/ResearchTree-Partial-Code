import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Button } from '@mui/material';
import { Modal, ModalDialog } from '@mui/joy';
import { BookOutlined } from '@ant-design/icons';

export default function GradingTable({ studentId }) {
  const [rubrics, setRubrics] = useState([]);
  const [selectedRubricId, setSelectedRubricId] = useState(null);
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
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [isFinalGradeModalOpen, setIsFinalGradeModalOpen] = useState(false); // New state for final grade modal

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await axios.get(
          `http://localhost:7000/api/advicer/fetch/adviser-student/grades/${user._id}`
        );
        const gradesData = response.data;

        if (gradesData.length > 0) {
          const uniqueRubrics = Array.from(
            new Set(gradesData.map((g) => g.rubricId?._id))
          ).map((id) => gradesData.find((g) => g.rubricId?._id === id).rubricId);

          setRubrics(uniqueRubrics);
          setGradesData(gradesData);

          if (uniqueRubrics.length > 0) {
            setSelectedRubricId(uniqueRubrics[0]._id);
          }
        }
      } catch (error) {
        console.error('Error fetching grades:', error);
      }
    };

    fetchGrades();
  }, [user._id]);

  useEffect(() => {
    if (selectedRubricId && gradesData.length > 0) {
      const rubricGrades = gradesData.filter(
        (grade) => grade.rubricId?._id === selectedRubricId
      );

      if (rubricGrades.length > 0) {
        const rubric = rubricGrades[0].rubricId || {};
        setTitle(rubric.title);

        const parsedCategories = rubric.criteria?.map((c) => c.category) || [];
        setCategories(parsedCategories);

        const parsedGradeLabels = rubric.criteria?.reduce((acc, c) => {
          acc[c.category] = c.gradeLabels || {};
          return acc;
        }, {}) || {};
        setGradeLabels(parsedGradeLabels);

        const panelistIds = rubricGrades.map((g) => g.panelistId);
        setPanelists(panelistIds);

        if (panelistIds.length > 0) {
          handlePanelistClick(panelistIds[0]._id, rubricGrades);
        }
      }
    }
  }, [selectedRubricId, gradesData]);

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
      setGradeSummary(null);
    }
  };

  const fetchFinalGrade = async () => {
    try {
      const response = await axios.get(
        `http://localhost:7000/api/advicer/fetch/adviser-FinalGrades/grades/${user._id}/${selectedRubricId}` // Include selectedRubricId in the endpoint
      );
      setFinalGradeData(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching final grade:', error);
    }
  };

  // const calculateFinalGrade = () => {
  //   if (!gradesData || gradesData.length === 0) return 0;

  //   const rubricGrades = gradesData.filter(
  //     (grade) => grade.rubricId?._id === selectedRubricId
  //   );

  //   const total = rubricGrades.reduce((acc, grade) => {
  //     const panelGrade = grade.grades?.reduce((sum, g) => sum + g.value, 0) || 0;
  //     return acc + panelGrade;
  //   }, 0);

  //   const totalPanelists = rubricGrades.length;
  //   const averageGrade = total / totalPanelists;

  //   return averageGrade;
  // };
  
  console.log("Advicer ID : ", user)

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        style={{
          width: '50px',
          backgroundColor: 'gray', // Purple for 'grading'
          color: '#fff', // White text
        }}
      >
        {<BookOutlined />}
      </Button>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalDialog
          aria-labelledby="grading-modal-title"
          aria-describedby="grading-modal-description"
          sx={{ maxWidth: 1000, width: '90%', p: 3, background: '#1E1E1E', color: 'white' }}
        >
          <Typography id="grading-modal-title" level="h4" textAlign="center">
            Grading Table
          </Typography>

          {/* Rubric Selector */}
          <div className="flex justify-center mb-4">
            {rubrics.map((rubric) => (
              <Button
                key={rubric._id}
                variant={selectedRubricId === rubric._id ? 'contained' : 'outlined'}
                onClick={() => setSelectedRubricId(rubric._id)}
              >
                {rubric.title}
              </Button>
            ))}
          </div>

          {/* Rubric Title */}
          <Typography level="h5" textAlign="center" sx={{ mb: 2 }}>
            {title || 'Waiting for your manuscript to be graded'}
          </Typography>

          {/* Panelist Buttons */}
          <div className="flex justify-center mb-4">
            {panelists.map((panelist) => (
              <Button
                key={panelist._id}
                variant={selectedPanelist === panelist._id ? 'contained' : 'outlined'}
                onClick={() => handlePanelistClick(panelist._id, gradesData)}
              >
                {panelist.name}
              </Button>
            ))}
          <Button
            variant="contained"
            color="primary"
            // onClick={() => setIsFinalGradeModalOpen(true)} // Open the final grade modal
            onClick={fetchFinalGrade}
          >
            Final Grade
          </Button>

          <Button
            variant="contained"
            color="success"
            onClick={() => setIsGradeModalOpen(true)} // Open the final grade modal
          >
            Grade
          </Button>
          </div>

          {/* Grade Table */}
          <div className="grid grid-cols-5 gap-2 text-center mt-4 text-[black]">
            <div className="bg-gray-200 font-bold p-4">Criterion</div>
            {['4', '3', '2', '1'].map((score) => (
              <div key={score} className="bg-gray-100 font-bold p-4">
                {score}
              </div>
            ))}

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
  
                  return (
                    <div
                      key={score}
                      className={`p-4 ${
                        panelistGrade && panelistGrade.gradeValue === parseInt(score)
                          ? 'bg-green-500'
                          : 'bg-gray-600'
                      }`}
                    >
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

          {/* Grade Summary */}
          {gradeSummary && (
            <div className="mt-4 p-4 bg-gray-100 rounded">
              <Typography>
                <strong>Total Grade:</strong> {gradeSummary.totalGradeValue}
              </Typography>
              <br />
              <Typography>
                <strong>Overall Grade:</strong> {gradeSummary.overallGradeLabel}
              </Typography>
              <br />
              <Typography>
                <strong>Graded At:</strong>{' '}
                {new Date(gradeSummary.gradedAt).toLocaleString()}
              </Typography>
            </div>
          )}
        </ModalDialog>
      </Modal>

      <Modal open={isGradeModalOpen} onClose={() => setIsGradeModalOpen(false)}>
        <ModalDialog
          aria-labelledby="final-grade-modal-title"
          aria-describedby="final-grade-modal-description"
          sx={{ height: '100%', width: '100%', p: 3, background: '#1E1E1E', color: 'white' }}
        >
          

                  {/* PWEDE MO NA LAGYAN NG KAHIT ANO ITO */}


          <Button sx={{marginTop: '800px'}} onClick={() => setIsGradeModalOpen(false)} variant="contained" color="primary">
            Close
          </Button>
        </ModalDialog>
      </Modal>

      {/* Final Grade Modal */}
      <Modal open={isFinalGradeModalOpen} onClose={() => setIsFinalGradeModalOpen(false)}>
        <ModalDialog
          aria-labelledby="final-grade-modal-title"
          aria-describedby="final-grade-modal-description"
          sx={{ maxWidth: 600, width: '90%', p: 3, background: '#1E1E1E', color: 'white' }}
        >
          <Typography id="final-grade-modal-title" level="h4" textAlign="center">
            Final Grade 
          </Typography>
          {/* <Typography level="h5" textAlign="center" sx={{ mb: 2 }}>
            {finalGradeData ? finalGradeData.grade : 'No final grade yet'}
          </Typography> */}

          {finalGradeData ? (
            <>
              <Typography>
                <strong>Student:</strong> {finalGradeData.student.name}
              </Typography>
              {finalGradeData.rubrics.map((rubric) => (
                <div key={rubric.rubricId} className="mb-2">
                  <Typography variant="h6">{rubric.rubricTitle}</Typography>
                  <Typography>
                    Final Grade: {rubric.totalGradeValue} ({rubric.overallGradeLabel})
                  </Typography>
                </div>
              ))}
            </>
          ) : (
            <Typography>No final grade data available.</Typography>
          )}

          <Button onClick={() => setIsFinalGradeModalOpen(false)} variant="contained" color="primary">
            Close
          </Button>
        </ModalDialog>
      </Modal>

      
    </>
  );
}
