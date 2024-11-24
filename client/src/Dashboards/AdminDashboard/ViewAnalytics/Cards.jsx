import React, { useState, useEffect } from "react";
import "./Cards.css";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";

import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
// import ITCS from './IT&CS' 
import axios from "axios"; // Import axios

export const Cards = () => {
  const [admin, setAdmin] = useState(null);
  const [open, setOpen] = useState(false); // Start with the alert closed

  // State for total count
  const [totalCountBSITStudents, setTotalBSITStudents] = useState([]);
  const [totalCountBSCSStudents, setTotalBSCSStudents] = useState([]);
  const [totalStudentWithoutAdvisors, setTotalStudentWithoutAdvisors] = useState([]);
  const [acceptedStudentAdvicerCount, setAcceptedStudentAdvicerCount] = useState([]);
  const [noStatusCount, setNoStatusCount] = useState([]);
  const [readyToDefenseCount, setReadyToDefenseCount] = useState([]);
  const [reviseOnAdvicerCount, setReviseOnAdvicerCount] = useState(0);
  const [reviseOnPanelCount, setReviseOnPanelCount] = useState(0);
  const [ApprovedOnPanelCount, setApprovedOnPanelCount] = useState(0);

  const [TotalPanelistsStudentCount, setTotalPanelistsStudentCount] = useState(0);
  const [TotalAdvisersPending, setTotalAdvisersPending] = useState(0);
  const [TotalStudentsPending, setTotalStudentsPending] = useState(0);
  const [TotalAdvisersApproved, setTotalAdvisersApproved] = useState(0);
  const [TotalStudentsApproved, setTotalStudentsApproved] = useState(0);

  const [pdfCount, setPdfCount] = useState(0); // State for storing PDF count

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    // Fetch stored user data from localStorage and set it to the admin state
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setAdmin(JSON.parse(storedUser));
    }
  }, []);

  
  useEffect(() => {

    const fetchTotalAllUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:7000/api/admin/students/Panelist" // Correct endpoint
        );
        setTotalAdvisersPending(response.data.totalAdvicerPending);
        setTotalStudentsPending(response.data.totalStudentsPending); 

        setTotalAdvisersApproved(response.data.totalAdvicersApproved);
        setTotalStudentsApproved(response.data.totalStudentsApproved); 
      } catch (error) {
        console.error("Error fetching ready-to-defense data:", error);
      }
    };

    const fetchTotalCouses = async () => {
      try {
        const response = await axios.get(
          "http://localhost:7000/api/admin/students/courses" // Correct endpoint
        );
        setTotalBSITStudents(response.data.totalBSITStudents);
        setTotalBSCSStudents(response.data.totalBSCSStudents); 
      } catch (error) {
        console.error("Error fetching ready-to-defense data:", error);
      }
    };
    

    const fetchStudentPanelistsCount = async () => {
      try {
        const response = await axios.get(
          "http://localhost:7000/api/admin/students/AllPanelist" // Correct endpoint
        );
        setTotalPanelistsStudentCount(response.data.count); // Update state with the backend response
      } catch (error) {
        console.error("Error fetching ready-to-defense data:", error);
      }
    };

    const fetchStudentNoAdvicerCount = async () => {
      try {
        const response = await axios.get(
          "http://localhost:7000/api/admin/students/without-advisors" // Correct endpoint
        );
        setTotalStudentWithoutAdvisors(response.data.totalStudentsWithoutAdvisors); // Update state with the backend response
      } catch (error) {
        console.error("Error fetching ready-to-defense data:", error);
      }
    };

    const fetchAcceptedStudentAdvicerCount = async () => {
      try {
        const response = await axios.get(
          "http://localhost:7000/api/admin/advisors/accepted-students-count" // Correct endpoint
        );
        setAcceptedStudentAdvicerCount(response.data.totalAcceptedStudents); // Update state with the backend response
      } catch (error) {
        console.error("Error fetching ready-to-defense data:", error);
      }
    };

    const fetchNoStatusData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:7000/api/admin/manuscripts/noStatusManuscript/count" // Correct endpoint
        );
        setNoStatusCount(response.data.totalNoStatusManuscripts); // Update state with the backend response
      } catch (error) {
        console.error("Error fetching ready-to-defense data:", error);
      }
    };

    
    const fetchDefenseData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:7000/api/admin/manuscripts/readyToDefense/count" // Correct endpoint
        );
        setReadyToDefenseCount(response.data.totalReadyToDefense); // Update state with the backend response
      } catch (error) {
        console.error("Error fetching ready-to-defense data:", error);
      }
    };

   
  
    const fetchReviseOnAdvicerCount = async () => {
      try {
        const response = await axios.get(
          "http://localhost:7000/api/admin/manuscripts/reviseOnAdvicer/count"
        ); // Adjust endpoint URL as needed
        setReviseOnAdvicerCount(response.data.totalReviseOnAdvicer);
      } catch (error) {
        console.error("Error fetching defense count:", error);
      }
    };

    const fetchReviseOnPanelCount = async () => {
      try {
        const response = await axios.get(
          "http://localhost:7000/api/admin/manuscripts/reviseOnPanel/count"
        ); // Adjust endpoint URL as needed
        setReviseOnPanelCount(response.data.totalReviseOnPanel);
      } catch (error) {
        console.error("Error fetching defense count:", error);
      }
    };

    const fetchApprovedOnPanelCount = async () => {
      try {
        const response = await axios.get(
          "http://localhost:7000/api/admin/manuscripts/approvedOnPanel/count"
        ); // Adjust endpoint URL as needed
        setApprovedOnPanelCount(response.data.totalApprovedOnPanel);
      } catch (error) {
        console.error("Error fetching defense count:", error);
      }
    };

    const fetchPdfCount = async () => {
      try {
        const response = await axios.get('http://localhost:7000/api/admin/pdfdetails/count');
        setPdfCount(response.data.count); // Set the count in state
      } catch (error) {
        console.error("Error fetching PDF count:", error);
      }
    };

    fetchPdfCount();
    fetchTotalAllUsers();
    fetchTotalCouses();
    fetchStudentPanelistsCount();
    fetchStudentNoAdvicerCount();
    fetchAcceptedStudentAdvicerCount();
    fetchNoStatusData();
    fetchDefenseData();
    fetchReviseOnAdvicerCount();
    fetchReviseOnPanelCount();
    fetchApprovedOnPanelCount();
  }, []);

  // Function to handle the button click
  const handleClick = () => {
    setOpen(true); // Open the alert when the button is clicked
    setTimeout(() => setOpen(false), 3000); // Automatically close after 3 seconds
  };

  if (!admin) return <div>Loading...</div>;

  return (
    <div>
<div className="cards-container">
        <div className="absolute">
          <div className="mt-[-100px] ml-[900px]">
            <p className="absolute text-[42px] font-bold ml-[-900px] mt-[-10px]">View Analytics</p>
            <img className="inline-block mb-1 ml-[200px]" src="/src/assets/BSIT.png" />
            <span className="bsitColor">{totalCountBSITStudents}</span>
            <img className="inline-block mb-1" src="/src/assets/BSCS.png" />
            <span className="bsitColor">{totalCountBSCSStudents}</span> 
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
          <img className="ml-[290px]" src="/src/assets/student-handle.png" />
          </div>
          <div className="card-content">
            <p className="card-title"> <span className="ml-1"></span> Student No Adviser</p>
            <p className="card-value-1 ml-[80px]">{totalStudentWithoutAdvisors}</p>
          </div>
        </div>

        {/* New Uploads Card displaying PDF count */}
        <div className="card">
          <div className="card-icon-2">
          <img className="ml-[290px]" src="/src/assets/adviserAnalytics-icon-2.png" />
          </div>
          <div className="card-content">
            <p className="card-title">Adviser Student Handle</p>
            <p className="card-value-2">{acceptedStudentAdvicerCount}</p> {/* Display PDF count here */}
          </div>
        </div>

        <div className="card">
          <div className="card-icon-3">
          <img className="ml-[295px]" src="/src/assets/adviserAnalytics-icon-1.png" />
          </div>
          <div className="card-content">
            <p className="card-title">New Uploads</p>
            <p className="card-value-3">{noStatusCount}</p>
          </div>
        </div>

        <div className="card">
          <div className="card-icon-4">
          <img className="ml-[290px]" src="/src/assets/adviserAnalytics-icon-3.png" />
          </div>
          <div className="card-content">
            <p className="card-title">Adviser's Revision</p>
            <p className="card-value-3">{reviseOnAdvicerCount}</p>
          </div>
        </div>

        <div className="flex absolute mt-[125px]">
          <div className="card">
            <div className="absolute ml-[204px] bottom-[56px]">
              <img className="mt-[-20px]" src="/src/assets/adviserAnalytics-icon-6.png" />
            </div>
            <div className="card-content">
              <p className="card-title">Defenders</p>
              <p className="card-value-2">{readyToDefenseCount}</p>
            </div>
          </div>

          <div className="card ml-[18px]">
            <div className="absolute ml-[204px] bottom-[56px]">
              <img className="" src="/src/assets/adviserAnalytics-icon-7.png" />
            </div>
            <div className="card-content">
              <p className="card-title">Defender's Revision</p>
              <p className="card-value-2">{reviseOnPanelCount}</p>
            </div>
          </div>

          <div className="card ml-[18px]">
            <div className="absolute ml-[204px] bottom-[56px]">
              <img className="" src="/src/assets/adviserAnalytics-icon-5.png" />
            </div>
            <div className="card-content">
              <p className="card-title">Finished</p>
              <p className="card-value-2">{ApprovedOnPanelCount}</p>
            </div>
          </div>

          <Tooltip 
  followCursor 
  title={
    <div className="tooltip-content flex flex-col items-start p-4 bg-[gray-700] rounded-md">
      {/* Pending Advisers Section */}
      <div className="tooltip-item mb-2">
        <span className="tooltip-text text-sm text-white">
          Pending Advisers: <strong className="text-yellow-600">{TotalAdvisersPending}</strong>
        </span>
      </div>
      
      {/* Registered Advisers Section */}
      <div className="tooltip-item mb-2">
        <span className="tooltip-text text-sm text-white">
          Registered Advisers: <strong className="text-green-600">{TotalAdvisersApproved}</strong>
        </span>
      </div>
      
      {/* Pending Students Section */}
      <div className="tooltip-item mb-2">
        <span className="tooltip-text text-sm text-white">
          Pending Students: <strong className="text-yellow-600">{TotalStudentsPending}</strong>
        </span>
      </div>
      
      {/* Registered Students Section */}
      <div className="tooltip-item">
        <span className="tooltip-text text-sm text-white">
          Registered Students: <strong className="text-green-600">{TotalStudentsApproved}</strong>
        </span>
      </div>
    </div>
  }
>
  {/* Tooltip Trigger Card */}
  <div className="card ml-[18px]">
    <div className="absolute ml-[177px] bottom-[56px]">
      <img className="ml-[20px]" src="/src/assets/all-users.png" alt="Users Overview" />
    </div>
    <div className="card-content">
      <p className="card-title">All Users</p>
      <p className="card-value-3">{/* Dynamic Value */}</p>
    </div>
  </div>
</Tooltip>


        
  <div className="card ml-[18px]">
    <div className="absolute ml-[177px] bottom-[56px]">
      <img className="ml-[20px]" src="/src/assets/panelist-student-icon.png" alt="Pending Proposal" />
    </div>
    <div className="card-content">
      <p className="card-title">Panelist Student</p>
      <p className="card-value-3">{TotalPanelistsStudentCount}</p>
    </div>
  </div>


        </div>
      </div>



      {/* <div className='cards-container'>
     
          <div className='absolute'>
        
        <div className="mt-[-100px] ml-[900px]">
          <p className="absolute text-[42px] font-bold ml-[-900px] mt-[-10px]">View Analytics</p>
        <img className="inline-block mb-1 ml-[200px]" src="/src/assets/BSIT.png"/>
        <span className='bsitColor'>200</span>
        <img className="inline-block mb-1" src="/src/assets/BSCS.png"/>
        <span className='bsitColor'>2200</span>

        </div>
          
          </div>

        <div className='card'>

        <div className="card">
          <div className="card-icon-1">
            <img className="ml-[290px]" src="/src/assets/student-handle.png" />
          </div>
          <div className="card-content">
            <p className="card-title">Total Manuscripts</p>
            <p className="card-value-1 ml-[80px]">{pdfCount}</p>
          </div>
        </div>
          
          <div className='card-icon-1'>
            <img className='' src='/src/assets/adviserAnalytics-icon-1.png'/>
          </div>
          <div className='card-content'>
            <p className='card-title'>New Uploads</p>
            <p className='card-value-2'>2,504</p>
          </div>
        </div>

        <div className='card'>
          <div className='card-icon-2'>
            <img className='' src='/src/assets/adviserAnalytics-icon-2.png' />
          </div>
          <div className='card-content'>
            <p className='card-title'>Adviser's Revision</p>
            <p className='card-value-1'>
              {readyToDefenseCount} Groups
            </p>
          </div>
        </div>

        <div className='card'>
          <div className='card-icon-3'>
            <img className='' src='/src/assets/adviserAnalytics-icon-3.png' />
          </div>
          <div className='card-content'>
            <p className='card-title'>Ready for Defense</p>
            <p className='card-value-3'>{reviseOnAdvicerCount} Groups</p>
          </div>
        </div>
        <div className='card'>
          <div className='card-icon-4'>
            <img className='' src='/src/assets/adviserAnalytics-icon-4.png'/>
          </div>

          <div className='card-content'>
            <p className='card-title'>Panel's Revision</p>
            <p className='card-value-3'>{reviseOnPanelCount} Groups</p>
          </div>
        </div>
        <div className='card'>
          <div className='card-icon-5'>
            <img className='' src='/src/assets/adviserAnalytics-icon-5.png' />
          </div>
          <div className='card-content'>
            <p className='card-title'>Publishing</p>
            <p className='card-value-3'>{ApprovedOnPanelCount} Groups</p>
          </div>
        </div>
      </div> */}

      <Box
        sx={{
          position: "fixed",
          top: 45,
          left: 1200,
          width: "16%",
          zIndex: 9999,
        }}
      >
        <Collapse in={open}>
          <Alert
            action={
              <IconButton
                aria-label='close'
                color='inherit'
                size='small'
                onClick={() => setOpen(false)} // Close the alert when the close button is clicked
              >
                <CloseIcon fontSize='inherit' />
              </IconButton>
            }
            sx={{ mb: 2, color: "white", backgroundColor: "green" }}
          >
            Download Complete
          </Alert>
        </Collapse>
      </Box>
    </div>
  );
};

export default Cards;
