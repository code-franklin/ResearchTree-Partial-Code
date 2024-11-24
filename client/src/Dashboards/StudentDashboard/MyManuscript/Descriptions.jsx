import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogActions, Button } from '@mui/material';

import { Modal, Checkbox, Divider, Typography, List, Tag } from 'antd';

import CkEditorDocuments from './CkEditorDocuments';
import './Styles/descriptions.css';
import Categories from './Categories';
import { Tooltip } from '@mui/material';

import { DonutChart } from "bizcharts";
import { SyncOutlined,StarOutlined,CloseOutlined } from '@ant-design/icons';




const { Title, Text } = Typography;

const ResearchCard = () => {
  
  const [advisorInfo, setAdvisorInfo] = useState(null);
  const [advisorStatus, setAdvisorStatus] = useState(null);
  const [panelists, setPanelists] = useState([]);
  
  const [proposal, setProposal] = useState('');
  const [channelId, setChannelId] = useState('');
  const [manuscriptStatus, setManuscriptStatus] = useState('');
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const [isTaskVisible, setIsTaskVisible] = useState(false);

  // button edit for Title
  const [isEditingProposalTitle, setIsEditingProposalTitle] = useState(false);
  const [newProposalTitle, setNewProposalTitle] = useState('');

  const [progress, setProgress] = useState(0);

  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  useEffect(() => {
    fetchAdvisorInfo();
    
  }, [isEditingProposalTitle]);

  const openEditorModal = () => {
    setIsEditorOpen(true);
  };

  const closeEditorModal = () => {
    setIsEditorOpen(false);
  };


  
  const fetchAdvisorInfo = async () => {
    try {
      const response = await fetch(`http://localhost:7000/api/student/advisor-info-StudProposal/${user._id}`);
      if (response.ok) {
        const data = await response.json();
        setAdvisorInfo(data.chosenAdvisor);
        setAdvisorStatus(data.advisorStatus);
        setPanelists(data.panelists || []);
        setChannelId(data.channelId);
        setManuscriptStatus(data.manuscriptStatus);
        setProposal(data.proposal || {});


        // Fetch tasks after getting advisor info
        fetchUpdatedTasks();
        
      } else {
        const errorData = await response.json();
        console.error('Error fetching advisor info:', errorData.message);
      }
    } catch (error) {
      console.error('Error fetching advisor info:', error.message);
    }
  };

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
  
  
  const handleEditProposalTitle = () => {
    setIsEditingProposalTitle(true);
  };

  const markTaskAsCompleted = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:7000/api/student/mark-task/${taskId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
  
      if (response.ok) {
        const data = await response.json();
        console.log('Task marked as completed!');

        // Update the user state and localStorage in real-time
        const updatedUser = {
          ...user,
          tasks: user.tasks.map(task =>
            task._id === taskId ? { ...task, isCompleted: true } : task
          ),
        };
  
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } else {
        console.error('Failed to mark task as completed');
      }
    } catch (error) {
      console.error('Error marking task as completed:', error);
    }
  };
  


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

  const handleSaveProposalTitle = async () => {
    try {
      const response = await fetch(`http://localhost:7000/api/student/update-proposal-title/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newTitle: newProposalTitle }),
      });
  
      if (response.ok) {
        const updatedProposal = await response.json();
        setProposal(updatedProposal);
        setIsEditingProposalTitle(false);
      } else {
        const errorData = await response.json();
        console.error('Error updating proposal title:', errorData.message);
      }
    } catch (error) {
      console.error('Error updating proposal title:', error.message);
    }
  };

  const manuscriptColors = {
    "Revise On Advicer": "#faad14", // Yellow
    "Ready to Defense": "#7695FF", // Blue
    "Revise on Panelist": "#faad14", // Yellow
    "Approved on Panel": "#1E1E", // Black
    default: "transparent", // Transparent for null or unrecognized statuses
  };
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
        <span className="font-bold text-white ml-[81px]">Panelists: <span className='font-normal'> {panelists.map((panelist) => panelist.name).join(', ')}</span>  </span>
      </span>
    );
  };  

  return (
    <div className="headerCard ">
      <div className="ml-[320px] border border-[#4B4B4B] bg-[#1E1E1E] p-[40px] pl-[80px] rounded-lg shadow-lg text-white">
        <div className="flex items-center mb-4 ">
          <span className="bg-[#868686] text-white px-2 py-0 mr-2">Research Title</span>
         
          <span className="bg-[#1E1E] text-white px-2 py-0 mr-2">{user.course}</span>
          <Tag
          color={manuscriptColors[manuscriptStatus] || manuscriptColors.default}
          style={{
            borderRadius: 0,
            padding: '2px',
            
            paddingRight: 2,
            position: "absolute",
            color: "white",
            marginTop: "0px",
            marginLeft: "178px",
            fontSize: "15px",
          }}
        >
          {manuscriptStatus}
        </Tag>
          <div className="absolute ml-[920px]"></div>
        
        </div>

{/* details for student */}
        {advisorStatus === 'accepted' && (
          <div>
        <button 
                type="button" 
                onClick={handleEditProposalTitle} 
                className='absolute mt-[5px] ml-[-30px] cursor-pointer' 
                >
                <Tooltip title="Edit Title"><img src="/src/assets/edit-title-icon.png"/></Tooltip>
        </button>
            
            <h1 className="text-2xl font-bold mb-2 max-w-[1010px]">
              {isEditingProposalTitle ? (
                <input
                  type="text"
                  value={newProposalTitle}
                  onChange={(e) => setNewProposalTitle(e.target.value)}
                  onBlur={handleSaveProposalTitle}
                  style={{border: '2px solid white', background: '#1E1E1E', color: 'white', width: '950px', height:'50px'}}
                />
              ) : (
                proposal?.proposalTitle
              )}
            </h1>
{/* 
            <button onClick={handleEditProposalTitle}>Edit</button> */}
            <p className="text-gray-500 font-bold mb-4">
              {user.groupMembers
                .map(member => member.replace(/([a-z])([A-Z])/g, '$1 $2')) // Insert space between lowercase and uppercase letters
                .join(', ')}
            </p>  
          </div>
        )}

        {advisorStatus === 'pending' && (
          <div>
            <h1 className="text-2xl font-bold mb-2 text-[orange]">
              Title Proposal is in progress <SyncOutlined spin />
            </h1>
            <p className="text-gray-500 font-bold mb-4">
              {user.groupMembers
                .map(member => member.replace(/([a-z])([A-Z])/g, '$1 $2')) // Insert space between lowercase and uppercase letters
                .join(', ')}
            </p>
          </div>
        )}


        {advisorStatus === 'declined' && (
          <div>
            
            <h1 className="text-2xl font-bold mb-2">
              Submit another title proposal...
            </h1>
            <p className="text-gray-500 font-bold mb-4">
              {user.groupMembers
                .map(member => member.replace(/([a-z])([A-Z])/g, '$1 $2')) // Insert space between lowercase and uppercase letters
                .join(', ')}
            </p>
          </div>
        )}

        {!advisorStatus && (
          <div>
            
            <h1 className="text-2xl font-bold mb-2 text-[lightblue]">
              Submit your Title Proposals
            </h1>
            <p className="text-gray-500 font-bold mb-4">Authors: 
             <span className='font-normal'> {user?.groupMembers
                .map(member => member.replace(/([a-z])([A-Z])/g, '$1 $2')) // Insert space between lowercase and uppercase letters
                .join(', ')}</span> 
            </p>
          </div>
        )}

        
    <div className='absolute  mt-[-310px] ml-[60%]'>
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

    </div>
    
{/* <p><strong>Text:</strong> {proposal?.proposalText}</p>  */}
        {/* Advisor */}
        <p className="text-gray-400 mb-2">
          <span className="font-bold text-white">Advisor: </span> <span className='font-normal text-gray-400'> {getStatusMessage(advisorStatus, advisorInfo)} </span>
          {advisorStatus === 'accepted' && <PanelistList panelists={panelists} />}
        </p>

{/* Panelist */}
        {advisorInfo && advisorStatus === 'accepted' && panelists.length > 0 && (
          <p className="text-gray-400 mb-2">

          </p>
        )}
        


        
        <div className="text-gray-400 mb-4">
        <span><span className="font-bold text-white">Date of Uploaded:</span> <span className="mr-5">{proposal?.submittedAt && new Date(proposal?.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span></span>
      

        
        {/* <span><span className="font-bold text-white">Manuscript Status : </span> <span className="mr-5">{manuscriptStatus || "N/A"}</span></span> */}

        
          {/* <br />
          {user.channelId} */}
        </div>
        <div className="flex justify-between items-center">
          {/* <div>
            <h1 className="mb-2 mt-4">Type of Research</h1>
            <span className="bg-purple-500 text-white px-2 py-1 mr-2">Machine Learning</span>
            <span className="bg-yellow-500 text-white px-2 py-1">Web and Mobile</span>
          </div> */}
          
          <div className="ml-[-10px] flex items-center">
          <Button 
            type="primary" 
           
            className="rounded-full text-center text-white mr-4 cursor-pointer w-[120px] h-[37px] border 1px solid #6A6A6A "  
            onClick={openEditorModal}>
              Open Editor
            
          </Button>

      {/* Material UI Modal for CKEditor */}
      <Dialog sx={{}}open={isEditorOpen} onClose={closeEditorModal} fullWidth maxWidth="xxl">
        <DialogContent sx={{height: '1000px',  }}>
          {user && (
            <CkEditorDocuments userId={user._id} channelId={channelId} />
          )}
        </DialogContent>
        <DialogActions>
          <Button sx={{marginTop: '-1680px', }}onClick={closeEditorModal}  color="primary"><img className="inline-block mr-2 mb-1 h-[30px] w-[30px]" src="/src/assets/close.png" alt="My Manuscript" /></Button>
        </DialogActions>
      </Dialog>


      
            
      <Button onClick={() => setIsTaskVisible(true)}>
              Show Tasks
            </Button>

            <Modal
              
              
              title="Task Checklist"
              visible={isTaskVisible}
              onCancel={() => setIsTaskVisible(false)}
              footer={null}
           
            >
              <Title level={4}>Checklist for Manuscript</Title>
              <Divider />

              <List
              
                dataSource={user?.tasks || []}
                renderItem={(task) => (
                  <List.Item>
                    <Checkbox
                      checked={task.isCompleted}
                      onChange={() => markTaskAsCompleted(task._id)}
                      disabled={task.isCompleted}
                    >
                      <Text delete={task.isCompleted} style={{ marginLeft: '10px' }}>
                        {task.taskTitle}
                      </Text>
                    </Checkbox>
                  </List.Item>
                )}
              />
            </Modal>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchCard;