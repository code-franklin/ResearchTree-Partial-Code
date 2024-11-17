import React, { useState, useEffect } from "react";
import "./Cards.css";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";

import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import ITCS from './IT&CS' 
import axios from "axios"; // Import axios

export const Cards = () => {
  const [admin, setAdmin] = useState(null);
  const [open, setOpen] = useState(false); // Start with the alert closed

  // State for total count
  const [readyToDefenseCount, setReadyToDefenseCount] = useState(0);
  const [reviseOnAdvicerCount, setReviseOnAdvicerCount] = useState(0);
  const [reviseOnPanelCount, setReviseOnPanelCount] = useState(0);
  const [ApprovedOnPanelCount, setApprovedOnPanelCount] = useState(0);

  useEffect(() => {
    // Fetch stored user data from localStorage and set it to the admin state
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setAdmin(JSON.parse(storedUser));
    }
  }, []);

  // Fetch the count of readyToDefense manuscripts when component mounts
  useEffect(() => {
    const fetchDefenseCount = async () => {
      try {
        const response = await axios.get(
          "http://localhost:7000/api/admin/manuscripts/readyToDefense/count"
        ); // Adjust endpoint URL as needed
        setReadyToDefenseCount(response.data.totalReadyToDefense);
      } catch (error) {
        console.error("Error fetching defense count:", error);
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

    fetchDefenseCount();
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
      <div className='cards-container'>
     
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
      </div>

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
