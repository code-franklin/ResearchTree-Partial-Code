import * as React from 'react';
import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import Sheet from '@mui/joy/Sheet';
import { borderColor } from '@mui/system';
import axios from 'axios';

export default function BasicModal() {
  const [open, setOpen] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [showCheckboxes, setShowCheckboxes] = React.useState(false);
  const [percentageResult, setPercentageResult] = React.useState(0);
  const [categories, setCategories] = React.useState(['Research', 'Presentation', 'Content', 'Design']);
  const [scores, setScores] = React.useState([4, 3, 2, 1]);
  const [checkBoxes, setCheckBoxes] = React.useState({
    Research: { 4: false, 3: false, 2: false, 1: false },
    Presentation: { 4: false, 3: false, 2: false, 1: false },
    Content: { 4: false, 3: false, 2: false, 1: false },
    Design: { 4: false, 3: false, 2: false, 1: false },
  });

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

  // Initialize grades with content for each category and score
  const [grades, setGrades] = React.useState({
    Research: { 4: getRandomContent(), 3: getRandomContent(), 2: getRandomContent(), 1: getRandomContent() },
    Presentation: { 4: getRandomContent(), 3: getRandomContent(), 2: getRandomContent(), 1: getRandomContent() },
    Content: { 4: getRandomContent(), 3: getRandomContent(), 2: getRandomContent(), 1: getRandomContent() },
    Design: { 4: getRandomContent(), 3: getRandomContent(), 2: getRandomContent(), 1: getRandomContent() },
    Function: { 4: getRandomContent(), 3: getRandomContent(), 2: getRandomContent(), 1: getRandomContent() },
  });

  const [selectedColors, setSelectedColors] = React.useState({
    Research: { 4: 'bg-[#575757]', 3: 'bg-[#575757]', 2: 'bg-[#575757]', 1: 'bg-[#575757]' },
    Presentation: { 4: 'bg-[#2B2B2B]', 3: 'bg-[#2B2B2B]', 2: 'bg-[#2B2B2B]', 1: 'bg-[#2B2B2B]' },
    Content: { 4: 'bg-[#575757]', 3: 'bg-[#575757]', 2: 'bg-[#575757]', 1: 'bg-[#575757]' },
    Design: { 4: 'bg-[#2B2B2B]', 3: 'bg-[#2B2B2B]', 2: 'bg-[#2B2B2B]', 1: 'bg-[#2B2B2B]' },
    Function: { 4: 'bg-[#575757]', 3: 'bg-[#575757]', 2: 'bg-[#575757]', 1: 'bg-[#575757]' },
  });

  const handleToggleEdit = () => setIsEditing(!isEditing);
  const handleShowCheckboxes = () => setShowCheckboxes(!showCheckboxes);
  const handleEdit = (category, score, value) => {
    setGrades((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [score]: value,
      },
    }));
  };
  const handleCheckBoxChange = (category, score) => {
    setCheckBoxes((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [score]: !prev[category][score],
      },
    }));
  };

  const getScoreBgColor = (score) => {
    if (score === 4) return 'bg-green-500';
    if (score === 3) return 'bg-yellow-500';
    if (score === 2) return 'bg-orange-500';
    if (score === 1) return 'bg-red-500';
  };

  return (
    <React.Fragment>
      <Button sx={{ marginTop: '200px', background: 'red' }} variant="outlined" color="neutral" onClick={() => setOpen(true)}>
        Open modal
      </Button>
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={open}
        onClose={() => setOpen(false)}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Sheet
  sx={{
    width: 'auto',
    height: 'auto',
    borderRadius: 'md',
    p: 3,
    boxShadow: 'lg',
    background: '#1E1E1E',
    border: '1px solid #4B4B4B'  // Add border color here
  }}
>

          <ModalClose variant="plain" sx={{ m: 1 }} />
          {/* Your Grading Content */}
          <div className="">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-white text-[40px] ml-[25px] font-bold">Grading</h1>
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
              <div className="absolute top-[50px] left-[400px] w-[520px] bg-yellow-300 text-black p-2 mb-4 rounded">
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
                    <div key={score} className={`p-4 ${selectedColors[category]?.[score] || 'bg-[#575757]'} cursor-pointer relative`}>
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
                            <img onClick={() => handleCheckBoxChange(category, score)} className="text-3xl text-white cursor-pointer" src="/src/assets/check.png" />
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </Sheet>
      </Modal>
    </React.Fragment>
  );
}
