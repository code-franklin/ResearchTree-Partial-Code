import React from 'react';
import './Cards.css';
import { Link } from 'react-router-dom';


import Box from '@mui/material/Box';

import Badge from '@mui/material/Badge';
import Tooltip from '@mui/material/Tooltip';

import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';

export const Cards = () => {

    const user = JSON.parse(localStorage.getItem('user'));
    
    const [open, setOpen] = React.useState(false); // Start with the alert closed

    // Function to handle the button click
    const handleClick = () => {
        setOpen(true); // Open the alert when the button is clicked

        // Automatically close the alert after 3 seconds
        setTimeout(() => {
            setOpen(false);
        }, 3000); // 3000 milliseconds = 3 seconds
    };

    return (
        <div>


            <div className="cards-container">
                
         
                   
                <div className="year-container"> 
                    
                <div className="absolute mt-[-80px]">

                    
               

                </div>
                    <span className="absolute left-[-1174px] mt-[-50px] text-[40px] font-bold">View Analytics</span>
                 
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
                <div className="card">
                    <div className="card-icon-1">
                        <img className="" src="/src/assets/student-handle.png" />
                    </div>
                    <div className="card-content">
                        <p className="card-title">Student Handle</p>
                        <p className="card-value-1 ml-[80px]">{user.handleNumber} Groups</p>
                    </div>
                </div>
                <div className="card">
                    <div className="card-icon-2">
                    <img className='' src='/src/assets/adviserAnalytics-icon-1.png'/>
                    </div>
                    <div className="card-content">
                        <p className="card-title">New Uploads</p>
                        <p className="card-value-2">2,504</p>
                    </div>
                </div>
                <div className="card">
                    <div className="card-icon-3">
                    <img className='' src='/src/assets/adviserAnalytics-icon-3.png' />
                    </div>
                    <div className="card-content">
                        <p className="card-title">Ongoing Revision</p>
                        <p className="card-value-3">300</p>
                    </div>
                
                </div>
                <div className="card">
                    <div className="card-icon-4">
                    <img className='' src='/src/assets/adviserAnalytics-icon-5.png' />
                    </div>
                    <div className="card-content">
                        <p className="card-title">Ready for Defense</p>
                        <p className="card-value-3">300</p>
                    </div>
                
                
                </div>

                 <div className='flex absolute mt-[125px]'>
                 <div className="card ">
                    <div className="card-icon-4">
                    <img className='' src='/src/assets/adviserAnalytics-icon-5.png' />
                    </div>
                    <div className="card-content">
                        <p className="card-title">Ready for Defense</p>
                        <p className="card-value-3">300</p>
                    </div>
                </div>

                <div className="card ml-[18px]">
                    <div className="card-icon-4">
                    <img className='' src='/src/assets/adviserAnalytics-icon-5.png' />
                    </div>
                    <div className="card-content">
                        <p className="card-title">Ready for Defense</p>
                        <p className="card-value-3">300</p>
                    </div>
                </div>

                <div className="card ml-[18px]">
                    <div className="card-icon-4">
                    <img className='' src='/src/assets/adviserAnalytics-icon-5.png' />
                    </div>
                    <div className="card-content">
                        <p className="card-title">Ready for Defense</p>
                        <p className="card-value-3">300</p>
                    </div>
                </div>
                </div>
              
            </div>

            
            
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