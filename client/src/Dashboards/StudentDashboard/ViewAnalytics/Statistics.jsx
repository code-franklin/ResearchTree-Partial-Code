import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DonutChart } from "bizcharts";
import { SyncOutlined } from '@ant-design/icons';
import Header from './YearDropdown'
import './Styles/stats.css';

export const Cards = () => {
    const [pdfCount, setPdfCount] = useState(0);
    const [progress, setProgress] = useState(0);
    const [advisorInfo, setAdvisorInfo] = useState(null);
    const [advisorStatus, setAdvisorStatus] = useState(null);
    const [panelists, setPanelists] = useState([]);

    const [user] = useState(JSON.parse(localStorage.getItem('user')));

    const fetchUpdatedTasks = async () => {
        try {
          const response = await fetch(`http://localhost:7000/api/student/tasks/${user._id}`, { 
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
      
          if (!response.ok) {
            const errorData = await response.json();
            console.error('Failed to fetch updated tasks:', errorData.message || 'Unknown error');
            return; // Exit if there's an error with the request
          }
      
          const data = await response.json();
      
          if (data.tasks && Array.isArray(data.tasks)) {
            // Update user state and localStorage with the new tasks
            setUser((prevUser) => ({
              ...prevUser,
              tasks: data.tasks,
            }));
            localStorage.setItem('user', JSON.stringify({ ...user, tasks: data.tasks }));
          } else {
            console.error('Unexpected data format for tasks:', data);
          }
        } catch (error) {
          console.error('Error fetching updated tasks:', error.message);
        }
      };
      

    const fetchAdvisorInfo = async () => {
        try {
          const response = await fetch(`http://localhost:7000/api/student/advisor-info-StudProposal/${user._id}`);
          if (response.ok) {
            const data = await response.json();
            setAdvisorInfo(data.chosenAdvisor);
            setAdvisorStatus(data.advisorStatus);
            setPanelists(data.panelists || []);

            fetchUpdatedTasks();

          } else {
            const errorData = await response.json();
            console.error('Error fetching advisor info:', errorData.message);
          }
        } catch (error) {
          console.error('Error fetching advisor info:', error.message);
        }
      };

    useEffect(() => {
        const fetchPdfCount = async () => {
            try {
                const response = await axios.get('http://localhost:7000/api/admin/pdfdetails/count'); // Adjust API URL if necessary
                setPdfCount(response.data.count);
            } catch (error) {
                console.error('Error fetching PDF count:', error);
            }
        };
        fetchAdvisorInfo();
        fetchPdfCount();
    }, []);

    const fetchTaskProgress = async (userId) => {
        try {
          const response = await fetch(`http://localhost:7000/api/student/tasks/progress/${userId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
      
          if (!response.ok) {
            const errorData = await response.json();
            // Instead of showing an error, just display the message
            if (errorData.message === 'No tasks found for this student') {
              console.log('No tasks available for this advisor or panel.');
              setProgress(null); // You can set progress to null or any other default value
              return;
            }
            console.error('Fetching task progress:', errorData.message);
            return;
          }
      
          const { progress } = await response.json();
          setProgress(progress >= 0 && progress <= 100 ? progress : 0); // Ensure valid range
        } catch (error) {
          console.error('Error fetching task progress:', error);
        }
      };
      
      useEffect(() => {
        if (user && user._id) {
          fetchTaskProgress(user._id);
        }
      }, [user]);
      
        // Function to display status message based on advisorStatus
        const getStatusMessage = (advisorStatus, advisorInfo) => {
            if (advisorStatus === 'accepted') {
            
            return advisorInfo.name; // Just return the advisor name
            } else if (advisorStatus === 'pending') {
            return (
                <span style={{ color: 'orange' }}>
                Waiting <SyncOutlined spin />
                </span>
            );
            } else if (advisorStatus === 'declined') {
            return (
                <span style={{ color: 'red' }}>
                Your advisor declined. Please choose another advisor.
                </span>
            );
            } else if (!advisorInfo) {
            return (
                <span style={{ color: 'lightblue' }}>
                Required to submit proposals
                </span>
            );
            } else {
            // Default case: Display advisor name only if advisor is assigned but status is unknown
            return advisorInfo.name;
            }
        };

      const PanelistList = ({ panelists }) => {
        if (!panelists || panelists.length === 0) {
          return null; // Don't render anything if no panelists
        }
      
        return (
          <span style={{ color: 'white' }}>
            <span className="font-bold text-white ml-[10px]"><span className='font-normal'> {panelists.map((panelist) => panelist.name).join(', ')}</span>  </span>
          </span>
        );
      };  

      
    return (
       <>
        <div className="stats-container">
            <div className="box">
            <div className='year-container'>
          <div className='absolute mt-[-8px]'>
            {/* 
                <Dropdown /> */}
          </div>

          <span className='absolute left-[-1174px] mt-[-40px] text-[40px] font-bold text-white'>
            View Analytics
          </span>
       
        </div>
                <div className="card-icon-1 absolute top-0 left-[254px]">
                    <img src="/src/assets/star.png" alt="Star icon" />
                </div>
                <div className="card-content">
                    <p className="card-title">Most Searchable</p>
                    <p className="card-value-1 text-white">Machine Learning</p>
                </div>
            </div>
            <div className="box">
                <div className="card-icon-2 left-[600px]">
                    <img src="/src/assets/Check.png" alt="Check icon" />
                </div>
                <div className="card-content">
                    <p className="card-title">Explore Manuscript</p>
                    <p className="card-value-2 text-white">{pdfCount}</p>
                </div>
            </div>
            <div className="box">
                <div className="card-content">
                    <p className="card-title">Advicer</p>
                    <p className="card-title text-white ml-[10px]">{getStatusMessage(advisorStatus, advisorInfo)}</p>
                </div>
            </div>
            <div className="box">
                <div className="card-content">
                    <p className="card-title">Panelist</p>
                    <p className="card-title text-white">
                        {advisorStatus === 'accepted' && <PanelistList panelists={panelists} />}</p>
                        {advisorStatus === 'declined' && (<p style={{ color: 'red' }} className="card-title text-white">Submit another title proposal...</p>)}
                        {advisorStatus === 'pending' && (<p style={{ color: 'orange' }} className="card-title text-white">Waiting...</p>)}
                        {!advisorStatus && (<p style={{ color: 'lightblue' }} className="card-title text-white">Required to submit proposals</p>)}
                </div>
            </div>
        
            <div className='absolute  mt-100px] ml-[80%]'>
            <h3 className="donut-chart-title mt-[450px] ml-[16%] w-[100%]" color={["white"]}>Manuscript Task</h3>
                <DonutChart
                    data={[
                        { type: "Completed", value: progress || 0 },
                        { type: "Task", value: 100 - (progress || 0) }
                    ]}
                    autoFit
                    key={progress || 0}
                    legend={false}
                    width={250}
                    height={600}
                    radius={0.9}
                    innerRadius={0.7}
                    padding="auto"
                    angleField="value"
                    colorField="type"
                    color={["#0BF677", "#353535"]}
                    pieStyle={{
          
                        stroke: "", 
                        lineWidth: 1, 
                        lineCap: "round",
                        shadowBlur: 10,
                        shadowColor: "rgba(0, 0, 0, 0.6)",
                        shadowOffsetX: 3,
                        shadowOffsetY: 3,
                      }}
                    statistic={{
                      title: {
                        content: "Progress",
                        style: { color: "white", fontSize: 15 },
                      },
                      content: {
                        style: { color: "#0BF677", fontSize: 20 },
                        formatter: () => `${progress || 0}%`, // Display the progress value or 0 if undefined
                      },
                    }}
                />
            </div>
            
{/*             <div className='absolute  mt-[-310px] ml-[60%]'>
            <h3 className="donut-chart-title" color={["white"]}>Manuscript Task Progress</h3>
      <DonutChart
    
        data={[
          { type: "Progress", value: progress || 0 },
          { type: "Task", value: 100 - (progress || 0) }
        ]}
        autoFit
        key={progress || 0}
        legend={false}
        width={250}
        height={600}
        radius={0.9}
        innerRadius={0.7}
        padding="auto"
        angleField="value"
        colorField="type"
        color={["#0BF677", "#353535"]}
        pieStyle={{
          
          stroke: "", 
          lineWidth: 1, 
          lineCap: "round",
          shadowBlur: 10,
          shadowColor: "rgba(0, 0, 0, 0.6)",
          shadowOffsetX: 3,
          shadowOffsetY: 3,
        }}
        statistic={{
          title: {
            content: "Progress",
            style: { color: "white", fontSize: 15 },
          },
          content: {
            style: { color: "#0BF677", fontSize: 20 },
            formatter: () => `${progress || 0}%`, // Display the progress value or 0 if undefined
          },
        }}
      />

    </div> */}
        </div>
       </>
    );
};

export default Cards;
