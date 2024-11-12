import React, { useState } from 'react';

export default function GradingTable() {
  // Helper function to generate random content
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

  // Set initial state with random content in each cell
  const [grades, setGrades] = useState({
    research: { 4: getRandomContent(), 3: getRandomContent(), 2: getRandomContent(), 1: getRandomContent() },
    presentation: { 4: getRandomContent(), 3: getRandomContent(), 2: getRandomContent(), 1: getRandomContent() },
    content: { 4: getRandomContent(), 3: getRandomContent(), 2: getRandomContent(), 1: getRandomContent() },
    design: { 4: getRandomContent(), 3: getRandomContent(), 2: getRandomContent(), 1: getRandomContent() },
    function: { 4: getRandomContent(), 3: getRandomContent(), 2: getRandomContent(), 1: getRandomContent() },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [percentageResult, setPercentageResult] = useState(null);

  const handleEdit = (category, score, value) => {
    setGrades((prevGrades) => ({
      ...prevGrades,
      [category]: {
        ...prevGrades[category],
        [score]: value,
      },
    }));
  };

  const handleToggleEdit = () => {
    setIsEditing((prev) => !prev); // Toggle editing mode
  };

  const categories = ['research', 'presentation', 'content', 'design', 'function'];
  const scores = ['4', '3', '2', '1'];

  // Function to set background color for score headers
  const getScoreBgColor = (score) => {
    switch (score) {
      case '4': return 'bg-green-600';
      case '3': return 'bg-blue-600';
      case '2': return 'bg-purple-600';
      case '1': return 'bg-red-600';
      default: return '';
    }
  };

  return (
    <div className="text-[14px] p-4 w-[1400px] h-[600px] ml-[400px] mt-[380px]">
      <div className="flex justify-between items-center mb-4">
      <img className=" ml-[12px] mb-10 " src="/src/assets/view-grade.png" alt="View Grade" />
      </div>

   

      <div className="grid grid-cols-5 gap-2 text-white text-center">
        {/* Header */}
        <div className="bg-[#575757] font-bold p-4">Category</div>
        {scores.map((score) => (
          <div
            key={score}
            className={`p-4 font-bold ${getScoreBgColor(score)}`}
          >
            {score}
          </div>
        ))}

        {/* Categories and Editable Scores */}
        {categories.map((category) => (
          <React.Fragment key={category}>
            <div className="bg-[#2B2B2B] text-[25px] font-bold p-10 capitalize ">{category}</div>
            {scores.map((score) => (
              <div
                key={score}
                className="p-4 bg-[#575757] cursor-pointer relative"
              >
                {/* Editable Textarea */}
                <textarea
                  className="bg-transparent text-white border-none outline-none w-auto h-[110px] resize-none focus:outline-none"
                  value={grades[category][score]}
                  onChange={(e) => handleEdit(category, score, e.target.value)}
                  disabled={!isEditing} // Disable the textarea if not in editing mode
                />
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
