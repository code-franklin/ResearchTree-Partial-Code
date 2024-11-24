import { useEffect, useState } from "react";

import { Avatar } from "antd";
import {
  List,
  Typography,
  Button,
  Modal,
  Input,
  Checkbox,
  ConfigProvider,
  Select,
  Progress,
  message,
} from "antd";
import {
  EditOutlined,
  CheckOutlined,
  LoadingOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import axios from "axios";

import CkEditorDocuments from "../CkEditorDocuments";
import ViewGrading from "./Grading";

const { Text } = Typography;
const { Option } = Select;

export default function ListManuscript({ adviserName, adviserImage, students }) {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [selectedChannelId, setSelectedChannelId] = useState(null);
  const [courses, setCourses] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentTaskStudent, setCurrentTaskStudent] = useState(null);
  const [taskInput, setTaskInput] = useState("");

  const [gradingModalOpen, setGradingModalOpen] = useState(false);
  const [gradingStudentId, setGradingStudentId] = useState(null);

  const [progress, setProgress] = useState(0);
  const [tasks, setTasks] = useState([]);

  const [admin, setAdmin] = useState(null);

  // Fetch admin data from localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setAdmin(JSON.parse(storedUser));
    }
  }, []);

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


  useEffect(() => {
    // Get unique courses from student data for filtering
    const uniqueCourses = [
      ...new Set(students.map((student) => student.course)),
    ];
    setCourses(uniqueCourses);
    setFilteredStudents(students);
  }, [students]);

  const handleViewManuscript = (studentId, channelId) => {
    setSelectedStudentId(studentId);
    setSelectedChannelId(channelId);
    setIsEditorOpen(true);
  };

  const openTaskModal = (student) => {
    setCurrentTaskStudent(student);
    setIsModalVisible(true);
    fetchTasks(student._id); // Fetch tasks when opening modal
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

  const handleTaskInputChange = (e) => {
    setTaskInput(e.target.value);
  };

  const handleAddTask = () => {
    if (taskInput) {
      setTasks([...tasks, { title: taskInput, completed: false }]);
      setTaskInput("");
    }
  };

  const handleDeleteTask = (index) => {
    setTasks((prevTasks) => prevTasks.filter((_, i) => i !== index));
  };

  const handleCompleteTask = (index) => {
    setTasks((prevTasks) =>
      prevTasks.map((task, i) =>
        i === index ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleCourseChange = (value) => {
    setSelectedCourse(value);
    setFilteredStudents(
      value ? students.filter((student) => student.course === value) : students
    );
  };

  return (
    <div style={{ flex: 1, overflowX: "hidden", padding: "20px", width: "1263px" }}>
          <Avatar
        src={`http://localhost:7000/public/uploads/${
          adviserImage|| "default-avatar.png"}`}

          style={{position: 'absolute', width: 100, height: 100, marginTop: '-200px' }}
        // sx={{ width: 79, height: 79 }}
      />
      <h2 style={{ position: 'absolute',color: "#ffffff", marginTop: '-150px', marginLeft: '123px', }}>Adviser</h2>
      <h2 style={{ position: 'absolute',color: "#ffffff", marginTop: '-200px', marginLeft: '120px', fontSize: '40px', fontWeight: 'bolder'}}>{adviserName}</h2>
      
      <Select
        value={selectedCourse}
        onChange={handleCourseChange}
        style={{ marginBottom: "20px", width: "200px", marginLeft: '1000px' }}
        placeholder="Select a course"
      >
        <Option value="">All Courses</Option>
        {courses.map((course) => (
          <Option key={course} value={course}>
            {course}
          </Option>
        ))}
      </Select>

      <List
        grid={{ gutter: 16, column: 1 }}
        dataSource={filteredStudents.filter((student) => student.manuscriptStatus === "Ready to Defense")}
        renderItem={(student) => (
          <List.Item key={student._id}>
            <div style={{
               height: "auto",  padding: "30px", borderRadius: "8px",
              display: "flex", justifyContent: "space-between",
              alignItems: "center", backgroundColor: "#2B2B2B", marginBottom: "16px"
            }}>
             <div style={{ flex: 1, maxWidth: '899px'}}>
                <Text style={{  
                    color: "#ffffff",
                    fontSize: "22px",
                    fontWeight: "bold",}}>
                  {student.proposalTitle}
                </Text>
                <br />
                <Text style={{ color: "gray" }}>
                  <span className="font-bold">Authors: </span>{student.groupMembers.join(", ")}
                </Text>
                <br />
                <Text style={{ color: "gray" }}>
                  <span className="font-bold">Panelists: </span>{student.panelists.join(", ")}
                </Text>
                <br />
                {student.submittedAt && (
               <Text style={{ color: "gray", display: 'none'}}>
                    <span className="font-bold">Date Uploaded:</span> {new Date(student.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </Text>
                )}
                <Text style={{ color: "#ffffff", display: 'none' }}>
                  <span className="font-bold">Manuscript Status: </span>{" "}{student.manuscriptStatus || "N/A"}
                </Text>
                <br />
                <p style={{ color: "#ffffff", marginTop: '0px'}}><span className='font-bold'>Course : </span>{student.course}</p>
                <p style={{ color: "#ffffff" }}><span className='font-bold'>Leader :</span> {student.name}</p>
              </div>

              <div style={{
                display: "flex", flexDirection: "column",
                alignItems: "center", marginRight: "10px"
              }}>

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
                    marginTop: "25px",
                    position: "absolute",
                  }}
                  format={(percent) => (
                    <span style={{ color: "white", fontSize: "20px" }}>{percent}%</span>
                  )}
                />


                {/*<Button icon={<LoadingOutlined />} style={{ marginBottom: "20px", width: "100px" }} />
                <Button icon={<CheckOutlined />} style={{ marginBottom: "20px", width: "100px" }} /> */}

                <Button 
                
                onClick={() => handleViewManuscript(student._id, student.channelId)} 
                style={{ marginBottom: "10px", width: "105px" }}
                >
                 <img className="mr-[-4px]" src="/src/assets/view-docs.png" /> 
                 Document
                </Button>

                <Button  onClick={() => openTaskModal(student)} 
                  style={{ marginBottom: "10px", width: "105px" }}
                  >
                    <img className="mr-[-4px]" src="/src/assets/addtask.png" />
                    View Task
                </Button>

                <Button
                  onClick={() => handleViewGrade(student._id)}
                  style={{ marginBottom: "10px", width: "105px" }}
                    > 
                      <img className="mr-[-4px]" src="/src/assets/grade.png" />
                    View Grade 
                </Button>

                <Button
                  
                  onClick={() =>
                    updatePanelManuscriptStatus(
                      student._id,
                      "Approved on Panel",
                      admin.id
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
{/* 
      {isEditorOpen && selectedStudentId && (
        <CkEditorDocuments
          userId={admin.id}
          channelId={selectedChannelId}
          onClose={() => setIsEditorOpen(false)}
        />
      )} */}

      <Dialog
        open={gradingModalOpen}
        onClose={closeGradingModal}
        fullWidth
        maxWidth='xl'
      > 
        <DialogContent sx={{ background: '#1E1E1E',height: "auto", marginTop:'-400px', marginLeft: '-350px'}}>
          {gradingStudentId && (
            <ViewGrading
              // panelistId={user._id}
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
                userId={admin.id}
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

      <ConfigProvider>
      <Modal
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)} // Ensures modal can close
          footer={[
            <Button key='close' onClick={() => setIsModalVisible(false)}>
              Close
            </Button>,
/*             <Button key='add' type='primary' onClick={handleAddTask}>
              Add Task
            </Button>, */
          ]}
        >

          <Text strong style={{ fontSize: "18px", color: "#000000" }}>
            {currentTaskStudent?.proposalTitle || "Proposal Title"}
          </Text>
          <br />
          <br />
          <List
            dataSource={tasks}
            locale={{ emptyText: "No tasks found" }}
            renderItem={(task) => (
              <List.Item
                key={task._id}
                actions={[
/*                   <Checkbox
                    checked={task.isCompleted}
                    onChange={() => handleCompleteTask(task._id)}
                  >
                    {task.isCompleted ? "Completed" : "Pending"}
                  </Checkbox>, */

                  <Text style={{ fontWeight: "bold", color: task.isCompleted ? "green" : "red" }}>
                    {task.isCompleted ? "Completed" : "Not Done"}
                  </Text>
/*                   <Button
                    type='link'
                    icon={<DeleteOutlined />}
                    onClick={() => deleteTask(currentTaskStudent._id, task._id)} // Pass studentId and taskId
                  />, */
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
