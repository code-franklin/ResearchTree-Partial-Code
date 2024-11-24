import { useEffect, useState } from "react";
import {
  List,
  Typography,
  Button,
  message,
  Modal,
  Input,
  Checkbox,
  ConfigProvider,
  Select,
  Progress,
  Avatar
} from "antd";
import {
  EditOutlined,
  CheckOutlined,
  LoadingOutlined,
  DeleteOutlined,
  PlusOutlined,
  BookOutlined,
  StarOutlined,
} from "@ant-design/icons";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

import GradingButton from './GradingAdvicer'




import CkEditorDocuments from "./CkEditorDocuments";
import GradingAdvicer from "./GradingAdvicer";
import axios from "axios";

const { Text } = Typography;
const { Option } = Select;

export default function NewTables() {
  const [panelistStudents, setPanelistStudents] = useState([]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [selectedChannelId, setSelectedChannelId] = useState(null);

  const [gradingModalOpen, setGradingModalOpen] = useState(false);
  const [gradingStudentId, setGradingStudentId] = useState(null);

  const [courses, setCourses] = useState([]); // To store all unique courses
  const [filteredStudents, setFilteredStudents] = useState([]); // For filtering based on the course
  const [selectedCourse, setSelectedCourse] = useState(""); // For the selected course

  // Modal states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentTaskStudent, setCurrentTaskStudent] = useState(null);
  const [taskInput, setTaskInput] = useState("");
  const [tasks, setTasks] = useState([]); // To store tasks

  const [progress, setProgress] = useState(0);

  const panelistId = localStorage.getItem("panelistId"); // Example: retrieve panelist ID from localStorage

  // Grading modal states
  const [isGradingModalVisible, setIsGradingModalVisible] = useState(false);
  const [gradingRubric, setGradingRubric] = useState({
    research: { 4: "", 3: "", 2: "", 1: "" },
    presentation: { 4: "", 3: "", 2: "", 1: "" },
    content: { 4: "", 3: "", 2: "", 1: "" },
    design: { 4: "", 3: "", 2: "", 1: "" },
    function: { 4: "", 3: "", 2: "", 1: "" },
  });

  
  
  const [gradingData, setGradingData] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchPanelistStudents = async () => {
      try {
        const response = await fetch(
          `http://localhost:7000/api/advicer/panelist-students/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setPanelistStudents(data.panelistStudents);
          setFilteredStudents(data.panelistStudents);
          // Extract unique courses from the students data
          const uniqueCourses = [
            ...new Set(data.panelistStudents.map((student) => student.course)),
          ];
          setCourses(uniqueCourses);
        } else {
          console.error("Error fetching panelist students");
        }
      } catch (error) {
        console.error("Error fetching panelist students:", error.message);
      }
    };

    fetchPanelistStudents();
  }, []);

  const handleViewManuscript = (studentId, channelId) => {
    setSelectedStudentId(studentId);
    setSelectedChannelId(channelId);
    setIsEditorOpen(true);
  };
  const closeEditorModal = () => {
    setIsEditorOpen(false); // Close modal
    setSelectedStudentId(null);
    setSelectedChannelId(null);
  };

  const handleViewGrade = (studentId) => {
    setGradingModalOpen(true);
    setGradingStudentId(studentId);
  };
  const closeGradingModal = () => {
    setGradingModalOpen(false); // Close modal
    setGradingStudentId(null);
  };

  // Task for Student

  const addTask = async (studentId, taskTitle) => {
    try {
      const response = await fetch(
        `http://localhost:7000/api/advicer/add-task/${studentId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ taskTitle }),
        }
      );
      if (response.ok) {
        setTasks((prevTasks) => [
          ...prevTasks,
          { title: taskTitle, completed: false },
        ]);
        setTaskInput(""); // Clear the input field
        fetchTasks(studentId); // Fetch tasks again to immediately update the task list in the modal
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const fetchTaskProgress = async (studentId) => {
    if (!studentId) {
      console.log("No selectedStudentId found."); // Debug statement
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:7000/api/advicer/tasks/progress/${studentId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        const { progress: studentProgress } = await response.json();
        setProgress((prevProgress) => ({
          ...prevProgress,
          [studentId]:
            studentProgress >= 0 && studentProgress <= 100
              ? studentProgress
              : 0,
        }));
      } else {
        console.error("Error fetching progress.");
      }
    } catch (error) {
      console.error("Error fetching task progress:", error);
    }
  };
  // Debug: Check the progress value in the component
  useEffect(() => {
    filteredStudents.forEach((student) => {
      fetchTaskProgress(student._id);
    });
  }, [filteredStudents]);

  const updateManuscriptStatus2 = async (channelId, newStatus, panelistId) => {
    try {
      const response = await axios.patch(
        "http://localhost:7000/api/advicer/thesis/panel/manuscript-status",
        { channelId, manuscriptStatus: newStatus, panelistId } // Send panelist ID with the request
      );

      if (
        newStatus === "Revise on Panelist" &&
        response.data.remainingVotes > 0
      ) {
        message.info(
          `Vote recorded. ${response.data.remainingVotes} votes remaining`
        );
      } else {
        message.success("Manuscript status updated");
      }
    } catch (error) {
      if (error.response) {
        console.error("Error response:", error.response.data);
        message.error(
          `Error: ${error.response.data.message || "Failed to update status"}`
        );
      } else {
        console.error("Error:", error.message);
        message.error("Error updating status");
      }
    }
  };

  const updatePanelManuscriptStatus = async (channelId, newStatus, userId) => {
    Modal.confirm({
      title: 'Are you sure you want to update manuscript?',
      onOk: async () => {
        try {
          const response = await axios.patch(
            "http://localhost:7000/api/advicer/thesis/panel/manuscript-status",
            { channelId, manuscriptStatus: newStatus, userId }
          );

          const { remainingVotes, message: successMessage } = response.data;

          message.success(successMessage);

          // Display remaining votes if status is `Approved on Panel` or `Revise on Panelist` and there are pending votes
          if (
            (newStatus === "Revise on Panelist" || newStatus === "Approved on Panel") &&
            remainingVotes > 0
          ) {
            message.info(
              `Only ${remainingVotes} more vote(s) needed to proceed with the manuscript`
            );
          }
        } catch (error) {
          if (error.response) {
            console.error("Error response:", error.response.data);
            message.error(
              `Error: ${error.response.data.message || "Failed to update status"}`
            );
          } else {
            console.error("Error:", error.message);
            message.error("Error updating status");
          }
        }
      },
    });
    };

  const deleteTask = async (studentId, taskId) => {
    try {
      const response = await fetch(
        `http://localhost:7000/api/advicer/delete-task/${studentId}/${taskId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        message.success("Task deleted successfully");
        setTasks((prevTasks) =>
          prevTasks.filter((task) => task._id !== taskId)
        ); // Remove task from state
      } else {
        const errorData = await response.json();
        console.error("Error deleting task:", errorData.message);
        message.error(`Error: ${errorData.message || "Failed to delete task"}`);
      }
    } catch (error) {
      console.error("Error deleting task:", error.message);
      message.error("Error deleting task");
    }
  };

  const fetchTasks = async (studentId) => {
    try {
      const response = await fetch(
        `http://localhost:7000/api/advicer/tasks/${studentId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setTasks(data.tasks); // Set fetched tasks
      } else {
        const errorData = await response.json();
        console.error("Error fetching tasks:", errorData.message);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error.message);
    }
  };

  const openTaskModal = (student) => {
    setCurrentTaskStudent(student);
    setIsModalVisible(true);
    fetchTasks(student._id); // Fetch tasks when opening modal
  };

  const handleTaskInputChange = (e) => {
    setTaskInput(e.target.value);
  };

  const handleAddTask = () => {
    if (taskInput) {
      addTask(currentTaskStudent._id, taskInput);
    }
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks); // Update task list after deletion
  };

  const handleCompleteTask = (index) => {
    const updatedTasks = tasks.map((task, i) => {
      if (i === index) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(updatedTasks); // Update task completion status
  };

  // Handle course selection
  const handleCourseChange = (value) => {
    setSelectedCourse(value);
    if (value === "") {
      setFilteredStudents(panelistStudents); // Show all students if no course is selected
    } else {
      setFilteredStudents(
        panelistStudents.filter((student) => student.course === value)
      );
    }
  };

  /* Rubrics Grading for Student */

  const handleGradingIconClick = (student) => {
    setSelectedStudentId(student._id);
    setIsGradingModalVisible(true);
  };

  const handleRubricChange = (criteria, rating, value) => {
    setGradingRubric(prevState => ({
      ...prevState,
      [criteria]: {
        ...prevState[criteria],
        [rating]: value,
      }
    }));
  };

  const submitGrading = async () => {
    try {
      const response = await axios.post(
        `http://localhost:7000/api/advicer/grade-student`,
        {
          studentId: selectedStudentId,
          panelistId: user._id,
          gradingRubric,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        message.success("Grading submitted successfully.");
        setIsGradingModalVisible(false);
        setGradingRubric({
          research: { 4: "", 3: "", 2: "", 1: "" },
          presentation: { 4: "", 3: "", 2: "", 1: "" },
          content: { 4: "", 3: "", 2: "", 1: "" },
          design: { 4: "", 3: "", 2: "", 1: "" },
          function: { 4: "", 3: "", 2: "", 1: "" },
        });
      }
    } catch (error) {
      console.error("Error submitting grading:", error);
      message.error("Failed to submit grading.");
    }
  };
  

  return (
    <div
      style={{ flex: 1, overflowX: "hidden", padding: "20px", width: "1263px" }}
    >
      <Select
        value={selectedCourse}
        onChange={handleCourseChange}
        style={{ marginBottom: "20px", width: "200px", marginLeft: '1000px' }}
        placeholder='Select a course'
      >
        <Option value=''>All Courses</Option>
        {courses.map((course) => (
          <Option key={course} value={course}>
            {course}
          </Option>
        ))}
      </Select>

      <List
        grid={{ gutter: 16, column: 1 }}
        dataSource={filteredStudents.filter(
          (student) => student.manuscriptStatus === "Ready to Defense"
        )}
        renderItem={(student) => (
          <List.Item key={student._id}>
            <div
              style={{
                height: "auto", padding: "30px",
                borderRadius: "8px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#2B2B2B",
                marginBottom: "16px",
              }}
            >
              <div style={{ flex: 1,   maxWidth: '890px',}}>
                <Text
                  style={{
                    color: "#ffffff",
                    fontSize: "22px",
                    fontWeight: "bold",
                  }}
                >
                  {student.proposalTitle}
                </Text>
                <br />
                <Text style={{ color: "gray" }}>
                  <span className='font-bold'>Authors: </span>
                  {student.groupMembers
                    .map((member) => member.replace(/([a-z])([A-Z])/g, "$1 $2")) // Insert space between lowercase and uppercase letters
                    .join(", ")}
                </Text>
                <br />
                <Text style={{ color: "gray" }}>
                  <span className='font-bold'>Panelists: </span>
                  {student.panelists.join(", ")}
                </Text>

                <br />
                {student.submittedAt && (
                 <Text style={{ color: "gray", marginRight: "10px" }}>
                    <span className='font-bold'>Date Uploaded:</span>{" "}
                    {new Date(student.submittedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </Text>
                )}
                  <Text style={{ color: "gray", display: 'none'}}>
                  <span className='font-bold'>Manuscript Status : </span>{" "}
                  {student.manuscriptStatus || "N/A"}
                </Text>
                <br />
                <br />
                <p style={{ color: "#ffffff", marginTop: '10px'}}><span className='font-bold'>Course : </span>{student.course}</p>
                <p style={{ color: "#ffffff" }}><span className='font-bold'>Leader :</span> {student.name}</p>
                <br />

                {/* Advicer Profile */}

                <div className="flex">
                  <Avatar
                      src={`http://localhost:7000/public/uploads/${student.chosenAdvisor ? student.chosenAdvisor.profileImage || 'default-images.png' : 'default-images.png'}`}
                      sx={{  }}
                      style={{}}
                    />
                  <p style={{ color: "#ffffff", marginTop: '2px',}}><span className='font-bold ml-[10px]'></span> {student.chosenAdvisor ? student.chosenAdvisor.name : 'No advisor chosen'}</p>
                </div>


              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginRight: "10px",
                  gap: "10px",
                }}
              >
                <Progress
                  type='dashboard'
                  steps={8}
                  percent={progress[student._id] || 0} // Use 0 if no progress is available for this student
                  trailColor='rgba(0, 0, 0, 0.06)'
                  strokeWidth={20}
                  style={{
                    width: "50px",
                    height: "50px",
                    marginLeft: "-350px",
                    marginTop: "40px",
                    position: "absolute",
                    color: 'white',
                  
                    
                  }}
                  
                  format={(percent) => (
                    <span style={{ color: "white", fontSize: "20px" }}>{percent}%</span>
                  )}
                />

                <Button
                  onClick={() =>
                    handleViewManuscript(student._id, student.channelId)
                  }
                  style={{  width: "105px" }}>
                     <img className="mr-[-4px]" src="/src/assets/view-docs.png" />
                  Document
                  </Button>

                <Button
                  onClick={() =>
                    updatePanelManuscriptStatus(
                      student._id,
                      "Revise on Panelist",
                      user._id
                    )
                  }
                  style={{width: "105px" }}
                >
                 <img className="mr-[-4px]" src="/src/assets/revise.png" /> 
                 Revise 
                 </Button>

                

                {/* Grading Button Modal
                <GradingButton/> */}

                <Button
              
                  onClick={() => handleViewGrade(student._id)}
                  style={{ width: "105px" }}
                    > 
                      <img className="mr-[-4px]" src="/src/assets/grade.png" />
                    View Grade 
                </Button>

                <Button
                  onClick={() => openTaskModal(student)}
                  style={{  width: "105px" }}
                  >
                    <img className="mr-[-4px]" src="/src/assets/addtask.png" />
                    Add Task
                </Button>

                <Button
                      onClick={() =>
                        updatePanelManuscriptStatus(
                          student._id,
                          "Approved on Panel",
                          user._id
                        )
                      }
                      style={{
                        width: "105px",
                        background: "#1E1E",
                        border: "none",
                        color: "white",

                        boxShadow: "0 0 10px rgba(0, 255, 0, 0.7)", // Green glow effect around the button
                        transition: "box-shadow 0.3s ease-in-out", // Smooth glow transition
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.boxShadow = "0 0 25px rgba(0, 255, 0, 1)") // Brighter green on hover
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.boxShadow = "0 0 15px rgba(0, 255, 0, 0.7)") // Reset to original green glow
                      }
                    >
                      Approved
                    </Button>
              </div>
            </div>
          </List.Item>
        )}
      />

      {/*       {isEditorOpen && selectedStudentId && (
        <CkEditorDocuments
          userId={user._id}
          channelId={selectedChannelId}
          onClose={() => setIsEditorOpen(false)}
        />
      )} */}

      {/* Material UI Modal for CKEditor */}
      <Dialog
        open={isEditorOpen}
        onClose={closeEditorModal}
        fullWidth
        maxWidth='xxl'
      >
        <DialogContent sx={{ height: "1200px" }}>
          {selectedStudentId && selectedChannelId && (
            <CkEditorDocuments
              userId={user._id}
              channelId={selectedChannelId}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditorModal} color='primary'>
            Close
          </Button>
        </DialogActions>
      </Dialog>

            {/* Material UI Modal for Grading */}
      <Dialog
        open={gradingModalOpen}
        onClose={closeGradingModal}
        fullWidth
        maxWidth='xl'
        // PaperProps={{
        //   style: {
        //     backgroundColor: 'transparent',
        //     boxShadow: 'none', // Removes any shadow if present
        //   },
        // }}
      >
        
        <DialogContent sx={{  background: '#1E1E1E', height: "auto", marginTop:'-400px', marginLeft: '-350px'}}>
          
          {gradingStudentId && (
            
            <GradingAdvicer
              panelistId={user._id}
              studentId={gradingStudentId}
            />
            
          )}
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={closeGradingModal} color='primary'>
            Close
          </Button>
        </DialogActions> */}
      </Dialog>

{/* Grading */}
      <Modal
              title='Grading Rubric'
              visible={isGradingModalVisible}
              onOk={submitGrading}
              onCancel={() => setIsGradingModalVisible(false)}
              okText='Submit'
              sx={{background: '#1E1E1E'}}
            >
              {['research', 'presentation', 'content', 'design', 'function'].map((criteria) => (
                <div key={criteria}>
                  <Text>{`${criteria.charAt(0).toUpperCase() + criteria.slice(1)}`}</Text>
                  {[4, 3, 2, 1].map((rating) => (
                    <div key={`${criteria}-${rating}`}>
                      <Text>{`Rating ${rating}`}</Text>
                      <Input
                        type="text"
                        value={gradingRubric[criteria][rating]}
                        onChange={(e) => handleRubricChange(criteria, rating, e.target.value)}
                        placeholder={`Enter feedback for ${criteria} rating ${rating}`}
                      />
                    </div>
                  ))}
                </div>
              ))}
      </Modal>


      <ConfigProvider theme={{ components: { Modal: { algorithm: true } } }}>
      <Modal
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)} // Ensures modal can close
          footer={[
            <Button key='close' onClick={() => setIsModalVisible(false)}>
              Close
            </Button>,
            <Button key='add' type='primary' onClick={handleAddTask}>
            Add Task
          </Button>,
          ]}
        >

          {/* <Text strong style={{ fontSize: "18px", color: "#000000" }}>
            {currentTaskStudent?.proposalTitle || "Proposal Title"}
          </Text> */}

          <Input
            placeholder='Enter a task'
            value={taskInput}
            onChange={handleTaskInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddTask();
            }}
          />
          <br />
          <br />
          <List
            dataSource={tasks}
            locale={{ emptyText: "No tasks found" }}
            renderItem={(task) => (
              <List.Item
                key={task._id}
                actions={[


                   <Text style={{ fontWeight: "bold", color: task.isCompleted ? "green" : "red" }}>
                    {task.isCompleted ? "Completed" : "Not Done"}
                  </Text>,

                  <Button
                    type='link'
                    icon={<DeleteOutlined />}
                    onClick={() => deleteTask(currentTaskStudent._id, task._id)} // Pass studentId and taskId
                  />,
                  
                ]}
              >
                <Text delete={task.isCompleted}>{task.taskTitle}</Text>
              </List.Item>
            )}
          />
        </Modal>
      </ConfigProvider>
    </div>
  );
}
