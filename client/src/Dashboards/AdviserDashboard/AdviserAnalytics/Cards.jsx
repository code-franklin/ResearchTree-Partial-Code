import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Cards.css';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';

export const Cards = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [pdfCount, setPdfCount] = useState(0); 
  const [newUploads, setNewUploads] = useState(null);
  const [reviseOnPanelist, setReviseOnPanelist] = useState(null);
  const [readyToDefenseCount, setReadyToDefenseCount] = useState(null);
  const [approvedOnAdvicerCount, setApprovedOnAdvicerCount] = useState(null);
  const [reviseOnPanelCount, setReviseOnPanelCount] = useState(null);
  const [approvedOnPanelCount, setApprovedOnPanelCount] = useState(null);
  const [bsitCount, setBSITCount] = useState(0);
  const [bscsCount, setBSCSCount] = useState(0);

  const [open, setOpen] = React.useState(false); // State for alert box

  // Function to handle button click for alert
  const handleClick = () => {
    setOpen(true); // Open the alert when button is clicked

    // Automatically close the alert after 3 seconds
    setTimeout(() => {
      setOpen(false);
    }, 3000); // 3000 milliseconds = 3 seconds
  };

  // useEffect to fetch all counts concurrently
  useEffect(() => {
    const fetchPdfCount = async () => {
      try {
        const response = await axios.get('http://localhost:7000/api/admin/pdfdetails/count');
        setPdfCount(response.data.count); // Set the count in state
      } catch (error) {
        console.error("Error fetching PDF count:", error);
      }
    };

    const fetchStudentCounts = async () => {
        try {
            const response = await axios.get(`http://localhost:7000/api/advicer/${user._id}/course-count`);
            setBSITCount(response.data.bsitCount);
            setBSCSCount(response.data.bscsCount);
        } catch (err) {
            console.error('Error fetching student counts:', err);
            setError('Failed to fetch student counts');
        } finally {
            setLoading(false);
        }
    };

    const fetchNewUploadCount = async () => {
        try {
          const response = await axios.get(`http://localhost:7000/api/advicer/${user._id}/newUploads-count`);
          setNewUploads(response.data.newUploadsCount);
        } catch (error) {
          console.error("Error fetching Ready to Defense count:", error);
        }
      };

    const fetchReviseOnAdvicerCount = async () => {
        try {
          const response = await axios.get(`http://localhost:7000/api/advicer/${user._id}/reviseOnAdvicer-count`);
          setReviseOnPanelist(response.data.reviseOnAdvicerCount);
        } catch (error) {
          console.error("Error fetching Ready to Defense count:", error);
        }
      };

    const fetchReadyToDefenseCount = async () => {
    try {
        const response = await axios.get(`http://localhost:7000/api/advicer/${user._id}/readyToDefense-count`);
        setReadyToDefenseCount(response.data.readyToDefenseCount);
    } catch (error) {
        console.error("Error fetching Ready to Defense count:", error);
    }
    };

    const fetchApprovedOnAdvicerCount = async () => {
    try {
        const response = await axios.get(`http://localhost:7000/api/advicer/${user._id}/approvedOnAdvicer-count`);
        setApprovedOnAdvicerCount(response.data.count);
    } catch (error) {
        console.error("Error fetching Ready to Defense count:", error);
    }
    };

    const fetchReviseOnPanelCount = async () => {
    try {
        const response = await axios.get(`http://localhost:7000/api/advicer/${user._id}/reivseOnAdvicer-count`);
        setReviseOnPanelCount(response.data.count);
    } catch (error) {
        console.error("Error fetching Ready to Defense count:", error);
    }
    };
    
    const fetchApprovedOnPanelCount = async () => {
    try {
        const response = await axios.get(`http://localhost:7000/api/advicer/${user._id}/approvedOnPanel-count`);
        setApprovedOnPanelCount(response.data.count);
    } catch (error) {
        console.error("Error fetching Ready to Defense count:", error);
    }
    };
    
    fetchNewUploadCount();
    fetchReviseOnAdvicerCount();
    fetchReadyToDefenseCount();

    fetchApprovedOnAdvicerCount();
    fetchReviseOnPanelCount();
    fetchApprovedOnPanelCount();
    fetchStudentCounts();
    fetchPdfCount();
  }, []); 

  console.log("User ID :", user._id)

  // Check if user exists, if not, display a message
  if (!user) {
    return <div>Please log in to view the data.</div>;
  }

  return (
    <div>
      <div className="cards-container">
        <div className="absolute">
          <div className="mt-[-100px] ml-[900px]">
            <p className="absolute text-[42px] font-bold ml-[-900px] mt-[-10px]">View Analytics</p>
            <img className="inline-block mb-1 ml-[200px]" src="/src/assets/BSIT.png" />
            <span className="bsitColor">{bsitCount}</span>
            <img className="inline-block mb-1" src="/src/assets/BSCS.png" />
            <span className="bsitColor">{bscsCount}</span> 
          </div>
        </div>

        <div className="card">
          <div className="card-icon-1">
            <img className="ml-[290px]" src="/src/assets/student-handle.png" />
          </div>
          <div className="card-content">
            <p className="card-title">Total Manuscripts</p>
            <p className="card-value-1 ml-[80px]">{pdfCount}</p>
          </div>
        </div>

        <div className="card">
          <div className="card-icon-1">
            <img className="" src="/src/assets/student-handle.png" />
          </div>
          <div className="card-content">
            <p className="card-title">Student Handle</p>
            <p className="card-value-1 ml-[80px]">{user.handleNumber} Groups</p>
          </div>
        </div>

        {/* New Uploads Card displaying PDF count */}
        <div className="card">
          <div className="card-icon-2">
            <img className="ml-[295px]" src="/src/assets/adviserAnalytics-icon-1.png" />
          </div>
          <div className="card-content">
            <p className="card-title">New Uploads</p>
            <p className="card-value-2">{newUploads}</p> {/* Display PDF count here */}
          </div>
        </div>

        <div className="card">
          <div className="card-icon-3">
            <img className="ml-[290px]" src="/src/assets/adviserAnalytics-icon-3.png" />
          </div>
          <div className="card-content">
            <p className="card-title">Ongoing Revision</p>
            <p className="card-value-3">{reviseOnPanelist}</p>
          </div>
        </div>

        <div className="card">
          <div className="card-icon-4">
            <img className="ml-[290px]" src="/src/assets/adviserAnalytics-icon-5.png" />
          </div>
          <div className="card-content">
            <p className="card-title">Ready for Defense</p>
            <p className="card-value-3">{readyToDefenseCount}</p>
          </div>
        </div>

        <div className="flex absolute mt-[125px]">
          <div className="card">
            <div className="card-icon-4">
              <img className="mt-[-20px]" src="/src/assets/adviserAnalytics-icon-5.png" />
            </div>
            <div className="card-content">
              <p className="card-title">Defenders</p>
              <p className="card-value-2">{approvedOnAdvicerCount}</p>
            </div>
          </div>

          <div className="card ml-[18px]">
            <div className="card-icon-4">
              <img className="" src="/src/assets/adviserAnalytics-icon-5.png" />
            </div>
            <div className="card-content">
              <p className="card-title">Defender's Revision</p>
              <p className="card-value-2">{reviseOnPanelCount}</p>
            </div>
          </div>

          <div className="card ml-[18px]">
            <div className="card-icon-4">
              <img className="" src="/src/assets/adviserAnalytics-icon-5.png" />
            </div>
            <div className="card-content">
              <p className="card-title">Approved</p>
              <p className="card-value-2">{approvedOnPanelCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alert for download complete */}
      <Box sx={{ position: 'fixed', top: 45, left: 1200, width: '16%', zIndex: 9999 }}>
        <Collapse in={open}>
          <Alert
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => setOpen(false)} // Close the alert when the close button is clicked
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{ mb: 2, color: 'white', backgroundColor: 'green' }}
          >
            Download Complete
          </Alert>
        </Collapse>
      </Box>
    </div>
  );
};

export default Cards;
