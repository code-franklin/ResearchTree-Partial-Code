import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Textarea from '@mui/joy/Textarea';

export default function GradingTable() {
  const [rubrics, setRubrics] = useState([]);
  const [selectedRubricId, setSelectedRubricId] = useState(null);
  const [editableRubric, setEditableRubric] = useState(null); // For editing

  // Fetch rubrics on component mount
  useEffect(() => {
    const fetchRubrics = async () => {
      try {
        const response = await axios.get('http://localhost:7000/api/admin/rubrics');
        setRubrics(response.data);
        if (response.data.length > 0) {
          setSelectedRubricId(response.data[0]._id); // Default to the first rubric
        }
      } catch (error) {
        console.error('Error fetching rubrics:', error);
      }
    };

    fetchRubrics();
  }, []);

  // Handle rubric switch
  const handleRubricSwitch = (rubricId) => {
    setSelectedRubricId(rubricId);
    setEditableRubric(null); // Reset editing state when switching rubric
  };

    // Start editing the selected rubric
    const handleEditRubric = (rubric) => {
        setEditableRubric({ ...rubric }); // Create a copy for editing
      };

    // Handle input changes for rubric title and categories
    const handleInputChange = (e, section, field) => {
        const updatedRubric = { ...editableRubric };
        if (section === 'title') {
          updatedRubric.title = e.target.value;
        } else if (section === 'category') {
          const index = updatedRubric.criteria.findIndex(c => c._id === field._id);
          updatedRubric.criteria[index].category = e.target.value;
        } else if (section === 'gradeLabel') {
          const index = updatedRubric.criteria.findIndex(c => c._id === field._id);
          updatedRubric.criteria[index].gradeLabels[e.target.name] = e.target.value;
        }
        setEditableRubric(updatedRubric);
      };

    // Save the edited rubric
    const handleSaveRubric = async () => {
        try {
          await axios.put(`http://localhost:7000/api/admin/rubrics/${editableRubric._id}`, editableRubric);
          setRubrics(prevRubrics =>
            prevRubrics.map(rubric => (rubric._id === editableRubric._id ? editableRubric : rubric))
          );
          setEditableRubric(null); // Reset editing state after saving
        } catch (error) {
          console.error('Error saving rubric:', error);
        }
      };

  // Get the selected rubric
  const selectedRubric = rubrics.find((rubric) => rubric._id === selectedRubricId);

  return (
    <div>
      {/* <h2 className="text-center text-white">Grading Table</h2> */}

      {/* Rubric Selector */}
      <div className="flex justify-center mb-4 space-x-4">
        {rubrics.map((rubric) => (
          <button
            key={rubric._id}
            className={`h-[50px] w-[300px] text-[20px] m-2 text-white rounded ${
              selectedRubricId === rubric._id ? 'bg-[#4B4B4B]' : 'bg-[#2B2B2B]'
            }`}
            onClick={() => handleRubricSwitch(rubric._id)}
          >
            {rubric.title}
          </button>
        ))}
      </div>

      {/* Grading Table */}
      {selectedRubric ? (
        <div>
        {/* <h3 className="text-lg font-bold text-white mb-4 text-center">
            {editableRubric ? (
              <input
                type="text"
                value={editableRubric.title}
                onChange={(e) => handleInputChange(e, 'title')}
                className="bg-transparent border-b border-white text-white text-lg w-full text-center"
              />
            ) : (
              selectedRubric.title
            )}
        </h3> */}
          <div className="grid grid-cols-5 gap-2 text-white text-center">
            {/* Table Header */}
            <div className="bg-[#575757] font-bold p-4">Criterion</div>
            {['4', '3', '2', '1'].map((score) => (
              <div key={score} className="p-4 font-bold bg-gray-700">
                {score}
              </div>
            ))}

            {/* Criteria Rows */}
            {selectedRubric.criteria.map((criterion) => (
              <React.Fragment key={criterion._id}>
                <div className="bg-[#2B2B2B] text-[20px] font-bold p-4 capitalize">
                {editableRubric ? (
                  <Textarea 
                  sx={{background: 'transparent', borderColor: 'green', color: 'white'}}
                    type="text"
                    value={editableRubric.criteria.find(c => c._id === criterion._id)?.category || ''}
                    onChange={(e) => handleInputChange(e, 'category', criterion)}
                    
                  />
                ) : (
                  criterion.category
                )}
                </div>
                {['4', '3', '2', '1'].map((score) => (
                  <div key={score} className="p-4 bg-gray-600 ">
                  {editableRubric ? (
                    <Textarea 
                      sx={{background: 'transparent', borderColor: 'green', color: 'white'}}
                      type="text"
                      name={score === '4' ? 'excellent' : score === '3' ? 'good' : score === '2' ? 'satisfactory' : 'needsImprovement'}
                      value={editableRubric.criteria.find(c => c._id === criterion._id)?.gradeLabels[score === '4' ? 'excellent' : score === '3' ? 'good' : score === '2' ? 'satisfactory' : 'needsImprovement'] || ''}
                      onChange={(e) => handleInputChange(e, 'gradeLabel', criterion)}
                     
                    />
                  ) : (
                    criterion.gradeLabels[
                      score === '4'
                        ? 'excellent'
                        : score === '3'
                        ? 'good'
                        : score === '2'
                        ? 'satisfactory'
                        : 'needsImprovement'
                    ]
                    )}
                  </div>
                ))}
              </React.Fragment>
            ))}

        {/* Edit/Save Button */}
          {editableRubric ? (
            <div className="absolute text-center mt-[-70px] ml-[1300px] ">
              <button onClick={handleSaveRubric} className="bg-blue-500 text-white py-2 px-4 rounded">
                Save Changes
              </button>
            </div>
          ) : (
            <div className="absolute text-center mt-[-70px] ml-[1300px] ">
              <button
                onClick={() => handleEditRubric(selectedRubric)}
                className=" text-white py-2 px-4 rounded"
              >
                    <img className="inline-block mb-1" src="/src/assets/edit-rubrics.png" />
                Edit Rubric
              </button>
            </div>
          )}

          </div>
        </div>
      ) : (
        <p className="text-center text-white">Loading rubric...</p>
      )}
    </div>
  );
}
