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
import CkEditorDocuments from "../CkEditorDocuments";
import axios from "axios";

const { Text } = Typography;
const { Option } = Select;

export default function ListManuscript({ studentData  }) {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [selectedChannelId, setSelectedChannelId] = useState(null);

  const [courses, setCourses] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentTaskStudent, setCurrentTaskStudent] = useState(null);
  const [taskInput, setTaskInput] = useState("");

  const [progress, setProgress] = useState(0);
  const [tasks, setTasks] = useState([]);

  const [admin, setAdmin] = useState(null);

    // Grading modal states
    const [isGradingModalVisible, setIsGradingModalVisible] = useState(false);
    const [gradingRubric, setGradingRubric] = useState({
      criteria1: 0,
      criteria2: 0,
      criteria3: 0,
    });
    const [gradingData, setGradingData] = useState([]);

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
// Function to add a task and update the task list and progress
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
      const newTask = await response.json(); // Get new task details from response
      setTasks((prevTasks) => [
        ...prevTasks,
        newTask,
      ]);
      setTaskInput(""); // Clear the input field

      // Update task progress after adding task
      fetchTasks(studentId);
      fetchTaskProgress(studentId);
    }
  } catch (error) {
    console.error("Error adding task:", error);
  }
};

// Function to delete a task and update the task list and progress
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

      // Update task progress after deleting task
      fetchTasks(studentId);
      fetchTaskProgress(studentId);
    }
  } catch (error) {
    console.error("Error deleting task:", error.message);
    message.error("Error deleting task");
  }
};

// Function to fetch task progress
const fetchTaskProgress = async (studentId) => {
  if (!studentId) return;
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
        [studentId]: studentProgress || 0, // Update only specific student's progress
      }));
    } else {
      console.error("Error fetching progress.");
    }
  } catch (error) {
    console.error("Error fetching task progress:", error);
  }
};

  useEffect(() => {
    filteredStudents.forEach((student) => {
      fetchTaskProgress(student._id);
    });
  }, [filteredStudents]);


  useEffect(() => {
    // Get unique courses from student data for filtering
    const uniqueCourses = [
      ...new Set(studentData.map((student) => student.course)),
    ];
    setCourses(uniqueCourses);
    setFilteredStudents(studentData);
  }, [studentData]);

    // Handle course selection


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


  const handleCourseChange = (value) => {
    setSelectedCourse(value);
    setFilteredStudents(
      value ? studentData.filter((student) => student.course === value) : studentData
    );
  };

  
  /* Rubrics Grading for Student */

  const handleGradingIconClick = (student) => {
    setSelectedStudentId(student._id);
    setIsGradingModalVisible(true);
  };

  const handleRubricChange = (criteria, value) => {
    setGradingRubric((prev) => ({
      ...prev,
      [criteria]: value,
    }));
  };

  const submitGrading = async () => {
    try {
      const response = await axios.post(
        `http://localhost:7000/api/advicer/grade-student`,
        {
          studentId: selectedStudentId,
          panelistId: admin.id,
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
        setGradingRubric({ criteria1: 0, criteria2: 0, criteria3: 0 });
      }
    } catch (error) {
      console.error("Error submitting grading:", error);
      message.error("Failed to submit grading.");
    }
  };

  return (
    <div style={{ flex: 1, overflowX: "hidden", padding: "20px", width: "1263px" }}>
    
      <Select
        value={selectedCourse}
        onChange={handleCourseChange}
        style={{ marginBottom: "20px", width: "200px" }}
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
              height: "auto", padding: "30px",  borderRadius: "8px",
              display: "flex", justifyContent: "space-between",
              alignItems: "center", backgroundColor: "#2B2B2B", marginBottom: "16px"
            }}>
              <div style={{ maxWidth: "899px",flex: 1 }}>
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

              <div style={{
                display: "flex", flexDirection: "column",
                alignItems: "center",
                marginRight: "10px", gap: "10px",
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
                    marginTop: "-18px",
                    position: "absolute",
                  }}
                  format={(percent) => (
                    <span style={{ color: "white", fontSize: "20px" }}>{percent}%</span>
                  )}
                />

                <Button
                  onClick={() =>
                    handleViewManuscript(student._id, student.channelId)
                  }
                  style={{  marginBottom: '0px', width: "105px" }}>
                     <img className="mr-[-4px]" src="/src/assets/view-docs.png" />
                  Document
                </Button>

{/*                 <Button
                  icon={<LoadingOutlined />}
                  onClick={() =>
                    updatePanelManuscriptStatus(
                      student._id,
                      "Revise on Panelist",
                      admin.id
                    )
                  }
                  style={{
                    width: "50px",
                    backgroundColor: "#faad14", // Yellow for 'revise'
                    color: "#fff", // White text
                  }}
                />

                <Button
                  icon={<CheckOutlined />}
                  onClick={() =>
                    updatePanelManuscriptStatus(
                      student._id,
                      "Approved on Panel",
                      admin.id
                    )
                  }
                  style={{
                    width: "50px",
                    backgroundColor: "#52c41a", // Green for 'approve'
                    color: "#fff", // White text
                  }}
                />

                <Button
                  icon={<BookOutlined />}
                  onClick={() => handleGradingIconClick(student)}
                  style={{
                    width: "50px",
                    backgroundColor: "#722ed1", // Purple for 'grading'
                    color: "#fff", // White text
                  }}
                /> */}

                <Button
                 
                
                  onClick={() => openTaskModal(student)}
                   style={{ marginBottom: "10px", width: "105px" }}>

                  <img className="mr-[-4px]" src="/src/assets/addtask.png" />
                Add Task
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

      <Modal
        title='Grading Rubric'
        visible={isGradingModalVisible}
        onOk={submitGrading}
        onCancel={() => setIsGradingModalVisible(false)}
        okText='Submit'
      >
        <div>
          <Text>Criteria 1</Text>
          <Input
            type='number'
            min={0}
            max={100}
            value={gradingRubric.criteria1}
            onChange={(e) => handleRubricChange("criteria1", e.target.value)}
          />
        </div>
        <div>
          <Text>Criteria 2</Text>
          <Input
            type='number'
            min={0}
            max={100}
            value={gradingRubric.criteria2}
            onChange={(e) => handleRubricChange("criteria2", e.target.value)}
          />
        </div>
        <div>
          <Text>Criteria 3</Text>
          <Input
            type='number'
            min={0}
            max={100}
            value={gradingRubric.criteria3}
            onChange={(e) => handleRubricChange("criteria3", e.target.value)}
          />
        </div>
      </Modal>


      <ConfigProvider>
      <Modal
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)} // Ensures modal can close
          closable={true}
          footer={[

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
