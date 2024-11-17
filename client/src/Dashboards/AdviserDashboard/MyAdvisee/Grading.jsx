import React, { useState, useEffect } from 'react';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import RubricButton from '../MyAdvisee/RubricsPercentage';

export default function GradingTable() {
  const getRandomContent = () => {
    const randomTexts = [
      'The project shows evidence of adequate research. It includes relevant sources to support the topic.',
      'The project is well-organized with clear, relevant sources.',
      'Research is adequate, but some sources are missing or unclear.',
      'The research is lacking or insufficient in some areas.',
      'The project does not include relevant research or sources.',
    ];
    return randomTexts[Math.floor(Math.random() * randomTexts.length)];
  };

  const [grades, setGrades] = useState({
    research: { 4: getRandomContent(), 3: getRandomContent(), 2: getRandomContent(), 1: getRandomContent() },
    presentation: { 4: getRandomContent(), 3: getRandomContent(), 2: getRandomContent(), 1: getRandomContent() },
    content: { 4: getRandomContent(), 3: getRandomContent(), 2: getRandomContent(), 1: getRandomContent() },
    design: { 4: getRandomContent(), 3: getRandomContent(), 2: getRandomContent(), 1: getRandomContent() },
    function: { 4: getRandomContent(), 3: getRandomContent(), 2: getRandomContent(), 1: getRandomContent() },
  });

  const [selectedColors, setSelectedColors] = useState({
    research: { 4: 'bg-[#575757]', 3: 'bg-[#575757]', 2: 'bg-[#575757]', 1: 'bg-[#575757]' },
    presentation: { 4: 'bg-[#2B2B2B]', 3: 'bg-[#2B2B2B]', 2: 'bg-[#2B2B2B]', 1: 'bg-[#2B2B2B]' },
    content: { 4: 'bg-[#575757]', 3: 'bg-[#575757]', 2: 'bg-[#575757]', 1: 'bg-[#575757]' },
    design: { 4: 'bg-[#2B2B2B]', 3: 'bg-[#2B2B2B]', 2: 'bg-[#2B2B2B]', 1: 'bg-[#2B2B2B]' },
    function: { 4: 'bg-[#575757]', 3: 'bg-[#575757]', 2: 'bg-[#575757]', 1: 'bg-[#575757]' },
  });

  const [checkBoxes, setCheckBoxes] = useState({
    research: { 4: false, 3: false, 2: false, 1: false },
    presentation: { 4: false, 3: false, 2: false, 1: false },
    content: { 4: false, 3: false, 2: false, 1: false },
    design: { 4: false, 3: false, 2: false, 1: false },
    function: { 4: false, 3: false, 2: false, 1: false },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [percentageResult, setPercentageResult] = useState(null);
  const [showCheckboxes, setShowCheckboxes] = useState(false); // New state for checkbox visibility

  const handleEdit = (category, score, value) => {
    setGrades((prevGrades) => ({
      ...prevGrades,
      [category]: {
        ...prevGrades[category],
        [score]: value,
      },
    }));
  };

  const handleCheckBoxChange = (category, score) => {
    setCheckBoxes((prevCheckBoxes) => {
      const newCheckBoxes = { ...prevCheckBoxes };
      newCheckBoxes[category][score] = !newCheckBoxes[category][score];

      // Apply color only if the checkbox is checked
      if (newCheckBoxes[category][score]) {
        setSelectedColors((prevColors) => ({
          ...prevColors,
          [category]: {
            ...prevColors[category],
            [score]: getScoreBgColor(score), // Apply color
          },
        }));
      } else {
        // Reset color if the checkbox is unchecked
        setSelectedColors((prevColors) => ({
          ...prevColors,
          [category]: {
            ...prevColors[category],
            [score]: 'bg-[#575757]', // Reset to grey
          },
        }));
      }

      return newCheckBoxes;
    });
  };

  const handleToggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  const handleShowCheckboxes = () => {
    setShowCheckboxes((prev) => !prev); // Toggle checkbox visibility
  };

  const calculatePercentage = () => {
    let totalScore = 0;
    let count = 0;

    Object.keys(checkBoxes).forEach((category) => {
      Object.keys(checkBoxes[category]).forEach((score) => {
        if (checkBoxes[category][score]) {
          count++;
          totalScore += parseInt(score, 10);
        }
      });
    });

    if (count > 0) {
      const average = (totalScore / count).toFixed(2);
      setPercentageResult(average);
    } else {
      setPercentageResult('No scores selected');
    }
  };

  useEffect(() => {
    calculatePercentage();
  }, [checkBoxes]);

  const categories = ['research', 'presentation', 'content', 'design', 'function'];
  const scores = ['4', '3', '2', '1'];

  const getScoreBgColor = (score) => {
    switch (score) {
      case '4': return 'bg-green-600';
      case '3': return 'bg-blue-600';
      case '2': return 'bg-purple-600';
      case '1': return 'bg-red-600';
      default: return 'bg-[#575757]';
    }
  };

  return (
    <div className="p-4 w-[1600px] h-[600px] ml-[320px] mt-[20px]">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-white text-[40px] font-bold">Grading</h1>
      
        <button
          onClick={handleToggleEdit}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          {isEditing ? 'Save' : 'Edit Criteria'}
        </button>
        <button
          onClick={handleShowCheckboxes}
          className="bg-green-500 text-white p-2 rounded hover:bg-green-700 transition"
        >
          {showCheckboxes ? 'Save Grade' : 'Set Grading'}
        </button>
      </div>

      {percentageResult && (
        <div className="mt-4 p-2 text-white rounded">
          <span className="font-bold">Percentage Result:</span> {percentageResult}%
        </div>
      )}

      {isEditing && (
        <div className="absolute top-[50px] left-[500px] w-[520px] bg-yellow-300 text-black p-2 mb-4 rounded">
          <span className="font-bold">Edit Mode</span> You can now edit/change the content of each category
        </div>
      )}

      <div className="grid grid-cols-5 gap-2 text-white text-center">
        <div className="bg-gray-700 font-bold p-4">Category</div>
        {scores.map((score) => (
          <div key={score} className={`p-4 font-bold ${getScoreBgColor(score)}`}>
            {score}
          </div>
        ))}

        {categories.map((category) => (
          <React.Fragment key={category}>
            <div className="bg-[#2B2B2B] text-[25px] font-bold p-10 capitalize">{category}</div>
            {scores.map((score) => (
              <div key={score} className={`p-4 ${selectedColors[category][score]} cursor-pointer relative`}>
                <textarea
                  className="bg-transparent text-white border-none outline-none w-[286px] h-[110px] resize-none focus:outline-none"
                  value={grades[category][score]}
                  onChange={(e) => handleEdit(category, score, e.target.value)}
                  disabled={!isEditing}
                />
                {showCheckboxes && ( // Render checkboxes based on visibility state
                  <div className="absolute bottom-2 right-2">
                    {checkBoxes[category][score] ? (
                      <img onClick={() => handleCheckBoxChange(category, score)} className="text-3xl text-white cursor-pointer" src="/src/assets/checkFilled.png" />
                    ) : (
                      <img onClick={() => handleCheckBoxChange(category, score)} className="text-3xl text-white cursor-pointer" src="/src/assets/checkOutlined.png" />
                    )}
                  </div>
                )}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
