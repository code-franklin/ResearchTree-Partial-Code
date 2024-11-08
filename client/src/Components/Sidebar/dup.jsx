import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import {
  SendOutlined
} from '@ant-design/icons';

import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { Tag, Flex, message } from "antd";

import Textarea from "@mui/joy/Textarea";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 720,
  height: 720,
  color: "white",
  bgcolor: "#1E1E1E",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function BasicModal() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [title, setTitle] = useState("");
  const [proposal, setProposal] = useState("");
  const [submittedAt, setSubmittedAt] = useState(null); // Add this state for submittedAt

  const [topAdvisors, setTopAdvisors] = useState([]);
  const [advisorInfo, setAdvisorInfo] = useState(null);
  const [advisorStatus, setAdvisorStatus] = useState(null);
  const [panelists, setPanelists] = useState([]);

  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchStudentInfoAndProposal();
  }, []);

  const fetchStudentInfoAndProposal = async () => {
    try {
      const response = await fetch(
        `http://localhost:7000/api/student/advisor-info-StudProposal/${user._id}`
      );
      if (response.ok) {
        const data = await response.json();
        setAdvisorInfo(data.chosenAdvisor);
        setAdvisorStatus(data.advisorStatus);
        setPanelists(data.panelists || []);
        setProposal(data.proposal || {}); // Set proposal to an empty object if not found
        setSubmittedAt(data.submittedAt);
      } else {
        const errorData = await response.json();
        console.error(
          "Error fetching student info and proposal:",
          errorData.message
        );
      }
    } catch (error) {
      console.error("Error fetching student info and proposal:", error.message);
    }
  };

  const submitProposal = async () => {
    try {
      const response = await fetch(
        "http://localhost:7000/api/student/submit-proposal",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user._id,
            proposalTitle: title,
            proposalText: proposal,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTopAdvisors(data.topAdvisors);
        setSubmittedAt(data.submittedAt); // Set the submittedAt date from response
        const newChannelId = data.channelId;
        localStorage.setItem("channelId", newChannelId);
        message.success("Proposal submitted successfully");
        console.log("Proposal submitted successfully!", data);

        // add the channel id if doesn't work on localStorage

        // Update the proposal state with the newly submitted data
        setProposal({
          proposalTitle: data.proposalTitle,
          proposalText: data.proposalText,
          submittedAt: data.submittedAt,
        });
      } else {
        const errorData = await response.json();
        console.error("Error submitting proposal:", errorData.message);
        message.error("Failed to submit proposal: " + errorData.message);
      }
    } catch (error) {
      console.error("Error submitting proposal:", error.message);
      message.error("An error occurred while submitting the proposal");
    }
  };

  const chooseAdvisor = async (advisorId) => {
    try {
      const response = await fetch(
        "http://localhost:7000/api/student/choose-advisor",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user._id, advisorId }),
        }
      );
      if (response.ok) {
        console.log("Advisor chosen successfully!");
        fetchStudentInfoAndProposal(); // Refresh advisor info
      } else {
        const errorData = await response.json();
        console.error("Error choosing advisor:", errorData.message);
      }
    } catch (error) {
      console.error("Error choosing advisor:", error.message);
    }
  };

  return (
    <div>
      <button onClick={handleOpen}>
       
        {" "}
        <img
          className='mt-[420px] ml-[25px]'
          src='/src/assets/title-proposal-button.png'
        ></img>{" "}
      </button>
      <Modal
        sx={{ border: "none" }}
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <img
            className='mt-2 ml-[277px]'
            src='/src/assets/title-proposals-logo.png'
            alt='Logo'
          />

          {/* Dynamic Title based on advisorStatus */}
          <Typography
            sx={{
              position: "absolute",
              marginLeft: "243px",
              top: "111px",
              fontWeight: "bold",
            }}
            id='modal-modal-title'
            variant='h6'
            component='h2'
          >
             
            {advisorStatus === "declined" && "Title Proposals"}
            {advisorStatus === "pending" && "Title Proposals"}
            {advisorStatus === "accepted" && "Your Adviser"}
          </Typography>
          {/* Render based on advisor status */}
         

          {/* Render based on advisor status */}
          {(!advisorInfo || advisorStatus === "declined") && (
            <div>
              <Tag
                style={{
                  position: "absolute",
                  marginLeft: "100px",
                  marginTop: "50px",
                }}
                icon={<CloseCircleOutlined />}
                color='blue'
              >
                Submit your Proposals
              </Tag>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submitProposal();
                }}
              >
                <Textarea
                  sx={{
                    color: "white",
                    position: "absolute",
                    top: "200px",
                    left: "117px",
                    borderRadius: "20px",
                    backgroundColor: "#1E1E1E",
                    borderColor: "#585050",
                    width: "495px",
                    height: "92px",
                    paddingLeft: "20px",
                    paddingTop: "10px",
                  }}
                  color='success'
                  minRows={2}
                  placeholder='Write your research title...'
                  size='sm'
                  variant='outlined'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />

                <Textarea
                  sx={{
                    color: "white",
                    position: "absolute",
                    top: "310px",
                    left: "117px",
                    borderRadius: "20px",
                    backgroundColor: "#1E1E1E",
                    borderColor: "#585050",
                    width: "495px",
                    height: "92px",
                    paddingLeft: "20px",
                    paddingTop: "10px",
                  }}
                  color='success'
                  minRows={2}
                  placeholder='Write your research proposal...'
                  size='sm'
                  variant='outlined'
                  value={proposal}
                  onChange={(e) => setProposal(e.target.value)}
                />
  
                {/* Add a submit button or trigger elsewhere */}
                
                <button type='submit' 
                style={{ 
                  position: 'absolute', 
                  display: "block", 
                  background: 'blue', 
                  width: '104px', 
                  height: '30px', 
                  borderRadius: '16px', 
                  marginTop: '240px', 
                  marginLeft: '465px'}}>

                  Submit <SendOutlined />
                </button>
              </form>
            </div>
          )}

          {/* pending output frontend */}

          {advisorInfo && advisorStatus === "pending" && (
            <div>
              <div className="absolute mt-[-90px] ml-[177px] text-[260px]  text-[orange]">
              <SyncOutlined spin />
              </div>
             
              <h1 className="absolute mt-[-70px] ml-[270px] text-[15px] font-bold mb-2 text-[orange]">
              in progress <SyncOutlined spin />
            </h1>

              <img
                src={`http://localhost:7000/public/uploads/${advisorInfo.profileImage}`}
                className='mt-[88px] ml-[200px] w-[230px] h-[230px] rounded-full '
                alt={advisorInfo.name}
              />
              <p className='text-[20px] font-bold ml-[20px] mt-[10px] '>
                {advisorInfo.name}
              </p>

              <Flex
                style={{ marginLeft: "132px", marginTop: "10px" }}
                gap='4px 0'
                wrap
              >
                {advisorInfo.specializations.map((specialization) => (
                  <Tag key={specialization} color='#4E4E4E'>
                    {specialization}
                  </Tag>
                ))}
              </Flex>
            </div>
          )}

          {advisorInfo && advisorStatus === "accepted" && (
            <div>
              <div
                style={{
                  position: "absolute",
                  borderLeft: "2px solid #373737",
                  height: "240px",
                  top: "210px",
                  left: "350px",
                }}
              ></div>
              <Tag
                style={{
                  position: "absolute",
                  marginLeft: "350px",
                  marginTop: "-20px",
                }}
                icon={<CheckCircleOutlined />}
                color='#87d068'
              >
                Accepted
              </Tag>
              <img
                src={`http://localhost:7000/public/uploads/${advisorInfo.profileImage}`}
                className=' mt-[120px] ml-[60px] w-[197px] h-[197px] rounded-full border-[5px] border-green-500'
                alt={advisorInfo.name}
              />
              <p className='absolute text-[20px] font-bold ml-[350px] mt-[-193px]'>
                {advisorInfo.name}
              </p>

              <h2 className='font-bold ml-[266px] text-[19px] mt-[66px]'>
                Your Panelists
              </h2>
              <ul className='flex ml-[150px] mt-[27px]'>
                {panelists.map((panelist) => (
                  <li key={panelist._id} className=''>
                    <img
                      src={`http://localhost:7000/public/uploads/${panelist.profileImage}`}
                      alt={panelist.name}
                      className=' w-[80px] h-[80px] rounded-full mr-[53px] '
                    />
                    <p className='text-sm ml-[-5px] mt-[6px]'>
                      {panelist.name}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <br />
          {(!advisorInfo || advisorStatus === "declined") && (
            
            <section className='top-advisors'>
              <h2 className='absolute font-bold ml-[250px] text-[19px] mt-[-310px]'>
                Title Proposals
              </h2>
              <h2 className='font-bold ml-[266px] text-[19px] mt-[280px]'>
                Top Advisors:
              </h2>
              <ul className='flex ml-[150px] mt-[50px]'>
                {" "}
                {/* Adjusted margin for better spacing */}
                {topAdvisors.map((advisor) => (
                  <li className='' key={advisor._id}>
                    <img
                      src={`http://localhost:7000/public/uploads/${advisor.profileImage}`}
                      alt={advisor.name}
                      className='w-[80px] h-[80px] rounded-full mr-[53px]'
                      onClick={() => chooseAdvisor(advisor._id)}
                    />
                    <p className='text-sm ml-[-17px] mt-[6px]'>
                      {advisor.name}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </Box>
      </Modal>
    </div>
  );
}
