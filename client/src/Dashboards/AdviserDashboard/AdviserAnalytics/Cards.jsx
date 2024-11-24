import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Cards.css';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';

import { Tooltip } from '@mui/material';
export const Cards = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [pdfCount, setPdfCount] = useState(0); 
  const [newUploads, setNewUploads] = useState(null);
  const [reviseOnPanelist, setReviseOnPanelist] = useState(null);
  const [readyToDefenseCount, setReadyToDefenseCount] = useState(null);
  const [approvedOnAdvicerCount, setApprovedOnAdvicerCount] = useState(null);
  const [reviseOnPanelCount, setReviseOnPanelCount] = useState(null);
  const [approvedOnPanelCount, setApprovedOnPanelCount] = useState(null);
  const [panelistStudentCount, setPanelistStudentCount] = useState(0);
  const [acceptedCountStudent, setAcceptedCountStudent] = useState(0);
  const [bsitCount, setBSITCount] = useState(0);
  const [bscsCount, setBSCSCount] = useState(0);

  const [proposalAccepted, setProposalAccepted] = useState(0);
  const [proposalDeclined, setProposalDeclined] = useState(0);
  const [proposalPending, setProposalPending] = useState(0);

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

    const fetchProposalStudentCounts = async () => {
      try {
          const response = await axios.get(`http://localhost:7000/api/advicer/advisor-students/${user._id}`);
          const counts = response.data.counts; // Access the counts object from the response
          setProposalAccepted(counts.accepted);
          setProposalDeclined(counts.declined);
          setProposalPending(counts.pending);

      } catch (err) {
          console.error('Error fetching student counts:', err);
          setError('Failed to fetch student counts');
      } finally {
          setLoading(false);
      }
  };

    const fetchPanelistStudentCount = async () => {
      try {
        const response = await axios.get(`http://localhost:7000/api/advicer/${user._id}/panelist-accepted-count`);
        setPanelistStudentCount(response.data.count);
      } catch (error) {
        console.error("Error fetching Ready to Defense count:", error);
      }
    };

    const fetchStudentCounts = async () => {
        try {
            const response = await axios.get(`http://localhost:7000/api/advicer/${user._id}/course-count`);
            setBSITCount(response.data.bsitCount);
            setBSCSCount(response.data.bscsCount);
            setAcceptedCountStudent(response.data.acceptedStudentsCount);

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
    fetchProposalStudentCounts();
    fetchReadyToDefenseCount();
    fetchPanelistStudentCount();
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
            <img className="ml-[0px]" src="/src/assets/totalManuscript-icon.png"  />
          </div>
          <div className="card-content">
            <p className="card-title">Total Manuscripts</p>
            <p className="card-value-1 ml-[80px]">{pdfCount}</p>
          </div>
        </div>

        <div className="card">
          <div className="card-icon-1">
            <img className="ml-[290px]" src="/src/assets/adviserAnalytics-icon-2.png" />
          </div>
          <div className="card-content">
            <p className="card-title">Student Handle</p>
            <p className="card-value-1 ml-[70px]">{acceptedCountStudent}/{user.handleNumber} Groups</p>
          </div>
        </div>

        <div className="card">
          <div className="card-icon-4">
            <img className="ml-[290px]" src="/src/assets/adviserAnalytics-icon-rdefense.png" />
          </div>
          <div className="card-content">
            <p className="card-title">Panelists Student</p>
            <p className="card-value-3">{panelistStudentCount}</p>
          </div>
        </div>

        {/* New Uploads Card displaying PDF count */}
        <div className="card">
          <div className="card-icon-2">
            <img className="ml-[295px]"  src="/src/assets/adviserAnalytics-icon-2.png" />
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


    

        <div className="flex absolute mt-[125px]">
          <div className="card">
            <div className="absolute ml-[204px] bottom-[56px]">
              <img className="mt-[50px]" src="/src/assets/adviserAnalytics-icon-6.png" />
            </div>
            <div className="card-content">
              <p className="card-title">Adviser's Defenders</p>
              <p className="card-value-2">{readyToDefenseCount}</p>
            </div>
          </div>

          <div className="card ml-[18px]">
            <div className="absolute ml-[204px] bottom-[56px]">
              <img className="" src="/src/assets/adviserAnalytics-icon-7.png" />
            </div>
            <div className="card-content">
              <p className="card-title">Panelist's Defenders</p>
              <p className="card-value-2">{approvedOnAdvicerCount}</p>
            </div>
          </div>

          <div className="card ml-[18px]">
            <div className="absolute ml-[204px] bottom-[56px]">
              <img className="" src="/src/assets/adviserAnalytics-icon-5.png" />
            </div>
            <div className="card-content">
              <p className="card-title">Panelist's Revisions</p>
              <p className="card-value-2">{reviseOnPanelCount}</p>
            </div>
          </div>

          <div className="card ml-[18px]">
          <div className="absolute ml-[204px] bottom-[56px]">
          <img className="" src="/src/assets/adviserAnalytics-icon-5.png" />
          </div>
          <div className="card-content">
            <p className="card-title">Finished</p>
            <p className="card-value-2">{approvedOnPanelCount}</p>
          </div>

        </div>
        <Tooltip 
  followCursor 
  title={
    <div className="tooltip-content flex flex-col items-start p-4 bg-[gray-700] rounded-md">
      {/* Accepted Section */}
      <div className="tooltip-item flex items-center gap-2 mb-2 ">
        <img className="icon " src="/src/assets/accept-proposal.png" alt="Accepted Icon" />
        <span className="tooltip-text text-sm text-white">
          Accepted: <strong className="text-green-600">{proposalAccepted}</strong>
        </span>
      </div>
      
      {/* Declined Section */}
      <div className="tooltip-item flex items-center gap-2 mb-2">
        <img className="icon " src="/src/assets/decline-proposal.png" alt="Declined Icon" />
        <span className="tooltip-text text-sm text-white">
          Declined: <strong className="text-red-600">{proposalDeclined}</strong>
        </span>
      </div>
      
      {/* Pending Section */}
      <div className="tooltip-item flex items-center gap-2">
        <img className="icon " src="/src/assets/pending-proposal-icon.png" alt="Pending Icon" />
        <span className="tooltip-text text-sm text-white">
          Pending: <strong className="text-yellow-600">{proposalPending}</strong>
        </span>
      </div>
    </div>
  }
>
  <div className="card ml-[18px]">
    <div className="absolute ml-[180px] bottom-[56px]">
      <img className="ml-[20px]" src="/src/assets/pending-proposal.png" alt="Pending Proposal" />
    </div>
    <div className="card-content">
      <p className="card-title">Proposals Status</p>
      <p className="card-value-3">{proposalAccepted} | {proposalDeclined} | {proposalPending}</p>
    </div>
  </div>
</Tooltip>


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
