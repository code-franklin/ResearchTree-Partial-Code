import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function GradingTable() {
  const [categories, setCategories] = useState([]);
  const [grades, setGrades] = useState({});
  const scores = ['4', '3', '2', '1'];
  const [title, setTitle] = useState(''); // To store the rubric title

  // Fetch categories and rubrics from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:7000/api/student/fetch-rubrics'); // Adjust endpoint as needed
        
        const fetchedRubrics = response.data;

        if (fetchedRubrics.length > 0) {
          const rubric = fetchedRubrics[0]; // Assuming you're using the first rubric
          setTitle(rubric.title || 'No Title'); // Set the rubric title
  
          const parsedCategories = [];
          const parsedGrades = {};
  
          rubric.criteria.forEach((criterion) => {
            if (criterion.gradeLabels) {
              parsedCategories.push(criterion.category);
              parsedGrades[criterion.category] = {
                4: criterion.gradeLabels.excellent || 'N/A',
                3: criterion.gradeLabels.good || 'N/A',
                2: criterion.gradeLabels.satisfactory || 'N/A',
                1: criterion.gradeLabels.needsImprovement || 'N/A',
              };
            } else {
              console.warn(`Missing gradeLabels for criterion:`, criterion);
            }
          });
  
          setCategories(parsedCategories);
          setGrades(parsedGrades);
        }
      } catch (error) {
        console.error('Error fetching rubrics:', error);
      }
    };

    fetchData();
  }, []);

  // Function to set background color for score headers
  const getScoreBgColor = (score) => {
    switch (score) {
      case '4':
        return 'bg-green-600';
      case '3':
        return 'bg-blue-600';
      case '2':
        return 'bg-purple-600';
      case '1':
        return 'bg-red-600';
      default:
        return '';
    }
  };

  return (
    <div className="text-[14px] p-4 w-[1400px] h-[600px] ml-[400px] mt-[380px]">
      {/* Title Section */}
      <h2 className="rubric-title text-white bg-[#2B2B2B] text-[25px] font-bold p-10 capitalize">{title}</h2> 
      <div className="flex justify-between items-center mb-4">
        <img className="ml-[12px] mb-10" src="/src/assets/view-grade.png" alt="View Grade" />
      </div>

      <div className="grid grid-cols-5 gap-2 text-white text-center">
        {/* Header */}
        <div className="bg-[#575757] font-bold p-4">Category</div>
        {scores.map((score) => (
          <div key={score} className={`p-4 font-bold ${getScoreBgColor(score)}`}>
            {score}
          </div>
        ))}

        {/* Categories and Editable Scores */}
        {categories.map((category) => (
          <React.Fragment key={category}>
            <div className="bg-[#2B2B2B] text-[25px] font-bold p-10 capitalize">
              {category}
            </div>
            {scores.map((score) => (
              <div key={score} className="p-4 bg-[#575757] cursor-pointer relative">
                <textarea
                  className="bg-transparent text-white border-none outline-none w-auto h-[110px] resize-none focus:outline-none"
                  value={grades[category]?.[score] || ''}
                  readOnly
                />
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
