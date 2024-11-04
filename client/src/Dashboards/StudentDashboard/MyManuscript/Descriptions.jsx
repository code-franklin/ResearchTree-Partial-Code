import React, { useState, useEffect } from 'react';
import CkEditorDocuments from '../../../CKeditorDocuments'
import './Styles/descriptions.css';
import Progresss from './Progress'
import Categories from './Categories'
import { SyncOutlined } from '@ant-design/icons';
import { Tooltip } from '@mui/material';




const ResearchCard = () => {
  const [advisorInfo, setAdvisorInfo] = useState(null);
  const [advisorStatus, setAdvisorStatus] = useState(null);
  const [panelists, setPanelists] = useState([]);
  
  const [proposal, setProposal] = useState('');
  const [channelId, setChannelId] = useState('');
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // button edit for Title
  const [isEditingProposalTitle, setIsEditingProposalTitle] = useState(false);
  const [newProposalTitle, setNewProposalTitle] = useState('');


  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchAdvisorInfo();
  }, [isEditingProposalTitle]);
  
  const fetchAdvisorInfo = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/student/advisor-info-StudProposal/${user._id}`);
      if (response.ok) {
        const data = await response.json();
        setAdvisorInfo(data.chosenAdvisor);
        setAdvisorStatus(data.advisorStatus);
        setPanelists(data.panelists || []);
        setChannelId(data.channelId || '');
        setProposal(data.proposal || {}); 
        
      } else {
        const errorData = await response.json();
        console.error('Error fetching advisor info:', errorData.message);
      }
    } catch (error) {
      console.error('Error fetching advisor info:', error.message);
    }
  };

  const handleEditProposalTitle = () => {
    setIsEditingProposalTitle(true);
  };
  
// edit the Title

  const handleSaveProposalTitle = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/student/update-proposal-title/${user._id}`, {
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
        <span style={{ color: 'red' }}>
          Submit your proposal to select an advisor.
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
          <div className="absolute ml-[920px]"></div>
          
        </div>

{/* details for student */}
        {advisorStatus === 'accepted' && (
          <div>
            <div className='absolute mt-[-190px] ml-[1030px]'><Progresss/></div>
        <button 
                type="button" 
                cursor-pointer onClick={() => setIsEditorOpen(true)} 
                className=' absolute mt-[-60px] ml-[1140px]'>
                <Tooltip title="NoteList"><img src="/src/assets/note-list-icon.png"/></Tooltip>
        </button>
        <button 
                type="button" 
                cursor-pointer onClick={() => setIsEditorOpen(true)} 
                className=' absolute mt-[-60px] ml-[1180px]'>
                <Tooltip title="Open Manuscript"><img src="/src/assets/word-editor.png"/></Tooltip>
        </button>
        <button 
                type="button" 
                onClick={handleEditProposalTitle} 
                className='absolute mt-[-59px] ml-[1220px] cursor-pointer '>
                <Tooltip title="Edit Title"><img src="/src/assets/edit-title-icon.png"/></Tooltip>
        </button>
            
            <h1 className="text-2xl font-bold mb-2">
              {isEditingProposalTitle ? (
                <input
                  type="text"
                  value={newProposalTitle}
                  onChange={(e) => setNewProposalTitle(e.target.value)}
                  onBlur={handleSaveProposalTitle}
                  style={{color: 'black', width: '1150px', height:'50px'}}
                />
              ) : (
                proposal?.proposalTitle
              )}
            </h1>
    

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
            <h1 className="text-2xl font-bold mb-2">
              Submit title proposal...
            </h1>
            <p className="text-gray-500 font-bold mb-4">
              {user.groupMembers
                .map(member => member.replace(/([a-z])([A-Z])/g, '$1 $2')) // Insert space between lowercase and uppercase letters
                .join(', ')}
            </p>
          </div>
        )}

        


{/* <p><strong>Text:</strong> {proposal?.proposalText}</p>  */}
        {/* Advisor */}
        <p className="text-gray-400 mb-2">
          <span className="font-bold text-white ">Advisor: <span className='font-normal'>{getStatusMessage(advisorStatus, advisorInfo)}</span> </span>
          <span>{advisorStatus === 'accepted' && <PanelistList panelists={panelists} />}</span>
        </p>

{/* Panelist */}
        {advisorInfo && advisorStatus === 'accepted' && panelists.length > 0 && (
          <p className="text-gray-400 mb-2">

          </p>
        )}
        
        <div className="text-gray-400 mb-4">
        <span>
          <span className="font-bold text-white">Date of Uploaded:</span> 
          <span className="mr-10">{proposal?.submittedAt && new Date(proposal?.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span></span>

        <span>
          <span className="font-bold text-white">Date of Published: </span>
          <span></span> </span>

          <br />

          <span className='hidden'>{user.channelId}</span>
        </div>
        <div className="flex justify-between items-center">
         
          <div name="Categories">
            <Categories/>
          </div>
          
          <div className="flex items-center">
            {/* <a onClick={() => setIsEditorOpen(true)} className="rounded-full text-center text-white ml-[-600px] cursor-pointer w-[120px] h-[37px] border 1px solid #6A6A6A " > */}
           

            {isEditorOpen && (
            <div 
                className="w-[50rem] -mt-[100px] ">
                <CkEditorDocuments 
                width={800}
                userId={user._id} channelId={user.channelId}/> 
            </div>

            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchCard;