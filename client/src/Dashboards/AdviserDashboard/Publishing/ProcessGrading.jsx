import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function GradingTable({ studentId, panelistId }) {
  const [rubrics, setRubrics] = useState([]);
  const [selectedRubricId, setSelectedRubricId] = useState(null);
  const [selectedGrades, setSelectedGrades] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const [submitMessage, setSubmitMessage] = useState("");
  const [successModalVisible, setSuccessModalVisible] = useState(false); // State for success modal visibility

  // Fetch rubrics on component mount
  useEffect(() => {
    const fetchRubrics = async () => {
      try {
        const response = await axios.get('http://localhost:7000/api/advicer/fetch-rubrics');
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

  // Handle grade selection
  const handleGradeSelection = (criterionId, gradeValue) => {
    const criterion = selectedRubric.criteria.find(c => c._id === criterionId);
    setSelectedGrades(prevSelectedGrades => ({
      ...prevSelectedGrades,
      [criterionId]: {
        gradeValue,
        gradeLabel: criterion.gradeLabels[
          gradeValue === 4 ? 'excellent' :
          gradeValue === 3 ? 'good' :
          gradeValue === 2 ? 'satisfactory' : 'needsImprovement'
        ],
      },
    }));
  };

  // Handle rubric switch
  const handleRubricSwitch = rubricId => {
    setSelectedRubricId(rubricId);
    setSelectedGrades({}); // Reset grades
  };

  const handleSubmitGrades = async () => {
    if (!studentId || !panelistId || !selectedRubricId) {
      alert('Student ID, Panelist ID, or Rubric is missing!');
      return;
    }
  
    // Check if all criteria have been graded
    if (Object.keys(selectedGrades).length !== selectedRubric.criteria.length) {
      setSubmitMessage("Please fill out all grading criteria before submitting.");
      return;
    }
  
    setSubmitMessage(""); // Reset the message if all grades are filled
  
    // Define the grade labels based on the grade value
    const gradeLabels = {
      4: "Excellent",
      3: "Good",
      2: "Satisfactory",
      1: "Needs Improvement",
    };
  
    const payload = {
      studentId,
      panelistId,
      rubricId: selectedRubricId,
      grades: Object.entries(selectedGrades).map(([criterionId, { gradeValue }]) => {
        const criterion = selectedRubric.criteria.find(c => c._id === criterionId);
        return {
          criterion: criterion?.category || 'Unknown',  // Default to 'Unknown' if no category found
          gradeLabel: gradeLabels[gradeValue] || 'Unknown', // Map gradeValue to gradeLabel
          gradeValue,
        };
      }),
    };
  
    try {
      const response = await axios.post(
        'http://localhost:7000/api/advicer/submit-student/grade',
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );
      console.log('Response:', response.data);
      setSuccessModalVisible(true); // Show the success modal
    } catch (error) {
      console.error('Error submitting grades:', error.response?.data || error);
  
      // Check if the error is about already submitted grades
      if (error.response?.data?.error === "Grades already submitted for this rubric by you") {
        setErrorMessage("You have already submitted grades for this rubric.");
      } else {
        alert('Failed to submit grades.');
      }
    }
  };

  const gradeColors = {
    excellent: 'bg-green-500',
    good: 'bg-blue-500',
    satisfactory: 'bg-yellow-500',
    needsImprovement: 'bg-red-500',
  };
  

  // Get the selected rubric
  const selectedRubric = rubrics.find(rubric => rubric._id === selectedRubricId);

  return (
    <div className="bg-[#1E1E1E]">
      {/* <h2 className="text-center text-black">Grading Table</h2> */}

       {/* Submit Button */}
       <div className="fixed mt-[-5px] ml-[1300px]  ">
        <button
          onClick={handleSubmitGrades}
          disabled={isSubmitting}
          className=" text-white py-2 px-4 rounded disabled:bg-gray-500 "
        >
         {isSubmitting ? 'Submitting...' : 'Submit Grades'}
         <img className="inline-block mb-1 ml-2" src="/src/assets/send-icon.png" />  
        </button>
      </div>

      {/* Rubric Selector */}
      <div className="flex justify-center mb-4 space-x-4 mt-[20px]">
        {rubrics.map(rubric => (
          <button
            key={rubric._id}
            className={`text-white py-2 px-4 rounded ${selectedRubricId === rubric._id ? 'bg-[#4B4B4B]' : 'bg-[#2B2B2B]'}`}
            onClick={() => handleRubricSwitch(rubric._id)}
          >
            {rubric.title}
          </button>
        ))}
      </div>

      {/* Grading Table */}
      {selectedRubric ? (
        <div className=''>
          {/* <h3 className="text-lg font-bold text-white mb-4 text-center">{selectedRubric.title}</h3> */}
          <div className="grid grid-cols-5 gap-2 text-white text-center ">
            {/* Table Header */}
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
            {/* Criteria Rows */}
            {selectedRubric.criteria.map(criterion => (
              <React.Fragment key={criterion._id}>
                <div className="bg-[transparent] text-[20px] font-bold p-4 capitalize">
                  {criterion.category}
                </div>
                {['4', '3', '2', '1'].map(score => {
                  const scoreLabel = criterion.gradeLabels[
                    score === '4' ? 'excellent' :
                    score === '3' ? 'good' :
                    score === '2' ? 'satisfactory' : 'needsImprovement'
                  ];
                  const isSelected = selectedGrades[criterion._id]?.gradeValue === parseInt(score);

                  return (
                    <div
                      key={score}
                      className={`p-4 cursor-pointer ${isSelected ? 'bg-[#4b4b4b] border border-white ' : 'bg-[#2b2b2b]'} `}

                      onClick={() => handleGradeSelection(criterion._id, parseInt(score))}
                    >
                      <p>{scoreLabel}</p>
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center text-white">Loading rubric...</p>
      )}


      {/* Display message if grades are missing */}
      {submitMessage && <p className="text-red-500 text-center mt-4">{submitMessage}</p>}

     

      {/* Modal for error message */}
      {errorMessage && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-80">
            <h3 className="text-lg font-bold text-center text-red-500">{errorMessage}</h3>
            <div className="flex justify-center mt-4">
              <button onClick={() => setErrorMessage("")} className="bg-blue-500 text-white px-4 py-2 rounded">
                Close
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Success Modal */}
      {successModalVisible && (
        <div className="fixed inset-0 bg-[#1E1E1E] bg-opacity-80 flex justify-center items-center z-50">
        <div className="bg-[#2B2B2B] p-6 rounded-lg w-90 shadow-lg">
          <h3 className="text-lg font-bold text-center text-green-500 mb-4">Grades Submitted Successfully!</h3>
          <p className="text-center text-white mb-6">
            Your grades have been successfully submitted. 
          </p>
          <div className="flex justify-center">
            <button 
              onClick={() => {
                setSuccessModalVisible(false); // Close the modal
                window.location.reload(); // Refresh the page
              }} 
              className="bg-green-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600 transition duration-200"
            >
              OK
            </button>
          </div>
        </div>
      </div>
      
      )}


    </div>
  );
}
