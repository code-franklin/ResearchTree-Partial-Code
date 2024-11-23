import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DonutChart } from "bizcharts";
import { SyncOutlined } from '@ant-design/icons';

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
            user((prevUser) => ({
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
                Pending <SyncOutlined spin />
                </span>
            );
            } else if (advisorStatus === 'declined') {
            return (
                <span style={{ color: 'red' }}>
                Your Advisor Declined. 
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
          <span className='max-w-[200px]'>
            <span className="font-bold text-white ml-[10px] "><span className='font-bold'> {panelists.map((panelist) => panelist.name).join(', ')}</span>  </span>
          </span>
        );
      };  

      
    return (
       <>
        <div className="stats-container">
           
        <div className='absolute'>
       
       <div className="mt-[-100px] ml-[900px]">
        <p className="absolute text-white text-[42px] font-bold ml-[-900px] mt-[-10px]">View Analytics</p>
       {/* <img className="inline-block mb-1 ml-[200px]" src="/src/assets/BSIT.png"/>
       {/* <img className="inline-block mb-1 ml-[200px]" src="/src/assets/BSIT.png"/>
       <span className='bsitColor'>200</span>
       <img className="inline-block mb-1" src="/src/assets/BSCS.png"/>
       <span className='bsitColor'>2500</span> */}
       </div>
        
        </div>
        <div className="bg-[#1E1E1E] p-[20px] rounded-[8px] border border-[#4B4B4B] w-[340px] h-[110px]">
                    <div className="absolute left-[290px] bottom-[56px]">
                    <img className="ml-[0px]" src="/src/assets/totalManuscript-icon.png"  />
                    </div>
                    <div className="card-content">
                       
                        <p className="card-title">Total Manuscript</p>
                        <p className="card-value-2 text-white ml-[60px]">{pdfCount} Manuscripts</p>
                    </div>
                </div>
              
                <div className="bg-[#1E1E1E] p-[20px] rounded-[8px] border border-[#4B4B4B] w-[340px] h-[110px]">
                    <div className="absolute">
                    <img className="ml-[270px] mt-[-5px] " src="/src/assets/student-handle.png"  />
                    </div>
                    <div className="card-content">
                       <p className="card-title">Group Mates</p>
                        <p className="card-value-2 text-[15px] text-white ml-[1.5px] mt-[3.3px]">
                        {user.groupMembers
                          .map(member => member.replace(/([a-z])([A-Z])/g, '$1 $2')) // Insert space between lowercase and uppercase letters
                          .join(', ')}
                        </p>
                    </div>
                </div>
                
                <div className="bg-[#1E1E1E] p-[20px] rounded-[8px] border border-[#4B4B4B] w-[340px] h-[110px]">

                <div className="absolute ml-[267px] mt-[-5px]">
                    <img className="ml-[0px]" src="/src/assets/adviser-student.png"  />
                </div>

                <div className="card-content">
                    <p className="card-title ">Advicer</p>
                    <p className="text-white whitespace-nowrap font-bold">{getStatusMessage(advisorStatus, advisorInfo)}</p>
                </div>
            </div>


            <div className="bg-[#1E1E1E] p-[20px] rounded-[8px] border border-[#4B4B4B] w-[340px] h-[110px]">
                <div className="absolute ml-[267px] mt-[-5px]">
                    <img className="ml-[0px]" src="/src/assets/panelist-student.png"  />
                </div>

                <div className="card-content ">
                    <p className="card-title">Panelist</p>
                    <p className="card-title text-white">
                        {advisorStatus === 'accepted' && <PanelistList panelists={panelists} />}</p>
                        {advisorStatus === 'declined' && (<p style={{ color: 'red' }} className="">Submit another title proposal...</p>)}
                        {advisorStatus === 'pending' && (<p style={{ color: 'orange'}} className="">Pending <SyncOutlined spin /></p>)}
                        {!advisorStatus && (<p style={{ color: 'lightblue' }} className="">Required to submit proposals</p>)}
                </div>
            </div>
        
            
            <div className='absolute mt-[128px] ml-[1020px] border border-[#4B4B4B]'>
         
      {/* <DonutChart
  
        data={[
          { type: "Progress", value: progress || 0 },
          { type: "Task", value: 100 - (progress || 0) }
        ]}
        autoFit
        key={progress || 0}
        legend={true}
        width={386}
        height={420}
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
      /> */}

    </div> 
        </div>
       </>
    );
};

export default Cards;
