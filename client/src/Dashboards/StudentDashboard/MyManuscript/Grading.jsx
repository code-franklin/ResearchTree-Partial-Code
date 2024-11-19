import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function GradingTable({ userId }) {
  const [categories, setCategories] = useState([]); // Rubric categories
  const [grades, setGrades] = useState([]); // Grades for selected panelist
  const [title, setTitle] = useState(''); // Rubric title
  const [panelists, setPanelists] = useState([]); // Panelist data
  const [selectedPanelist, setSelectedPanelist] = useState(null); // Selected panelist ID
  const [gradeLabels, setGradeLabels] = useState({}); // Grade labels per category
  const [gradesData, setGradesData] = useState([]); // All grades data
  const [gradeSummary, setGradeSummary] = useState(null); // Grade summary

  const user = JSON.parse(localStorage.getItem('user')); // User data from localStorage

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await axios.get(
          `http://localhost:7000/api/student/fetch-student/grades/${user._id}`
        );
        const gradesData = response.data;

        if (gradesData.length > 0) {
          const rubric = gradesData[0].rubricId;

          // Set rubric title
          setTitle(rubric.rubricName || 'No Title');

          const parsedCategories = [];
          const parsedGradeLabels = {};

          // Parse rubric criteria
          rubric.criteria.forEach((criterion) => {
            parsedCategories.push(criterion.category);
            parsedGradeLabels[criterion.category] = criterion.gradeLabels || {};
          });

          setCategories(parsedCategories);
          setGradeLabels(parsedGradeLabels);
          setPanelists(gradesData.map((g) => g.panelistId));

          // Set initial grades for the first panelist
          if (gradesData[0].panelistId) {
            handlePanelistClick(gradesData[0].panelistId._id, gradesData);
          }

          setGradesData(gradesData);
        }
      } catch (error) {
        console.error('Error fetching grades:', error);
      }
    };

    fetchGrades();
  }, [user._id]);

  // Handle panelist selection
  const handlePanelistClick = (panelistId, gradesData) => {
    setSelectedPanelist(panelistId);
    const panelistGrades = gradesData.find(
      (g) => g.panelistId._id === panelistId
    );

    if (panelistGrades) {
      setGrades(panelistGrades.grades);
      setGradeSummary({
        totalGradeValue: panelistGrades.totalGradeValue,
        overallGradeLabel: panelistGrades.overallGradeLabel,
        gradedAt: panelistGrades.gradedAt,
      });
    }
  };

  console.log("Grade of Panel : ", grades)

  return (
    <div className="text-[14px] p-4 w-[1400px] h-auto ml-[400px] mt-[380px]">
      {/* Rubric Title */}
      <h2 className="rubric-title text-white bg-[#2B2B2B] text-[25px] font-bold p-10 capitalize">
        {title}
      </h2>

      {/* Panelist Buttons */}
      <div className="flex justify-center mb-4">
        {panelists.map((panelist) => (
          <button
            key={panelist._id}
            className={`px-4 py-2 m-2 text-white ${
              selectedPanelist === panelist._id ? 'bg-green-600' : 'bg-gray-600'
            }`}
            onClick={() => handlePanelistClick(panelist._id, gradesData)}
          >
            {panelist.name}
          </button>
        ))}
      </div>

      {/* Grade Table */}
      <div className="grid grid-cols-5 gap-2 text-white text-center mt-4">
        <div className="bg-[#575757] font-bold p-4">Criterion</div>
        {['4', '3', '2', '1'].map((score) => (
          <div key={score} className={`p-4 font-bold bg-gray-700`}>
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

      {/* Map grade values (1, 2, 3, 4) to grade labels */}
      {['4', '3', '2', '1'].map((score) => {
        const gradeLabel = {
          '4': 'excellent',
          '3': 'good',
          '2': 'satisfactory',
          '1': 'needsImprovement'
        }[score]; // Map score to label
        
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
        <div className="bg-[#2B2B2B] text-white p-4 mt-4">
          <h3 className="text-[20px] font-bold">Grade Summary</h3>
          <p>Total Grade Value: {gradeSummary.totalGradeValue}</p>
          <p>Overall Grade Label: {gradeSummary.overallGradeLabel}</p>
          <p>Graded At: {new Date(gradeSummary.gradedAt).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}
