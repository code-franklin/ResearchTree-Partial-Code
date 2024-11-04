import { useEffect, useState } from "react";
import { List, Typography, Button, message, Modal, Input, Checkbox, ConfigProvider, Select } from "antd";
import { EditOutlined, CheckOutlined, LoadingOutlined, DeleteOutlined } from "@ant-design/icons";
import CkEditorDocuments from './CkEditorDocuments';
import axios from "axios";

const { Text } = Typography;
const { Option } = Select;

export default function NewTables() {
  const [acceptedStudents, setAcceptedStudents] = useState([]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [selectedChannelId, setSelectedChannelId] = useState(null);

  const [courses, setCourses] = useState([]); // To store all unique courses
  const [filteredStudents, setFilteredStudents] = useState([]); // For filtering based on the course
  const [selectedCourse, setSelectedCourse] = useState(""); // For the selected course

  // Modal states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentTaskStudent, setCurrentTaskStudent] = useState(null);
  const [taskInput, setTaskInput] = useState("");
  const [tasks, setTasks] = useState([]); // To store tasks

  const user = { _id: "dummyUserId" }; // Dummy user ID

  // Dummy student data
  const dummyData = [
    {
      _id: "1",
      proposalTitle: "AI in ddddd Healthcare",
      groupMembers: ["JohnDoe", "JaneSmith"],
      panelists: ["Dr. Adams", "Prof. Taylor"],
      submittedAt: "2023-09-15",
      datePublished: "2024-01-10",
      course: "Computer Science",
      manuscriptStatus: "reviseOnAdvicer",
      channelId: "channel1",
    },
    {
      _id: "2",
      proposalTitle: "Blockchain fdsdsadasdaor Supply Chain",
      groupMembers: ["AliceJohnson", "BobBrown"],
      panelists: ["Dr. White", "Prof. Black"],
      submittedAt: "2024-02-10",
      datePublished: "2024-02-15",
      course: "Information Systems",
      manuscriptStatus: "reviseOnAdvicer",
      channelId: "channel2",
    },
    // Additional dummy students...
  ];

  useEffect(() => {
    // Simulate fetching students
    setAcceptedStudents(dummyData);
    setFilteredStudents(dummyData);

    // Extract unique courses
    const uniqueCourses = [...new Set(dummyData.map(student => student.course))];
    setCourses(uniqueCourses);
  }, []);

  const handleViewManuscript = (studentId, channelId) => {
    setSelectedStudentId(studentId);
    setSelectedChannelId(channelId);
    setIsEditorOpen(true);
  };

  const addTask = (studentId, taskTitle) => {
    setTasks([...tasks, { title: taskTitle, completed: false }]);
    setTaskInput("");
  };

  const updateManuscriptStatus = async (channelId, newStatus) => {
    try {
      await axios.patch("http://localhost:5000/api/advicer/thesis/manuscript-status", {
        channelId,
        manuscriptStatus: newStatus,
      });
      message.success("Manuscript status updated");
    } catch (error) {
      console.error("Error updating status:", error);
      message.error("Failed to update status");
    }
  };

  const openTaskModal = (student) => {
    setCurrentTaskStudent(student);
    setIsModalVisible(true);
  };

  const handleTaskInputChange = (e) => {
    setTaskInput(e.target.value);
  };

  const handleAddTask = () => {
    if (taskInput) addTask(currentTaskStudent._id, taskInput);
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const handleCompleteTask = (index) => {
    const updatedTasks = tasks.map((task, i) => {
      if (i === index) return { ...task, completed: !task.completed };
      return task;
    });
    setTasks(updatedTasks);
  };

  const handleCourseChange = (value) => {
    setSelectedCourse(value);
    if (value === "") setFilteredStudents(acceptedStudents);
    else setFilteredStudents(acceptedStudents.filter(student => student.course === value));
  };

  return (
    <div style={{ flex: 1, overflowX: "hidden", padding: "20px", width: "1263px" }}>
     

      <List
        grid={{ gutter: 16, column: 1 }}
        dataSource={filteredStudents.filter(student => student.manuscriptStatus === "reviseOnAdvicer")}
        renderItem={(student) => (
          <List.Item key={student._id}>
            <div
              style={{
                height: "200px",
                padding: "20px",
                borderRadius: "8px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#2B2B2B",
                marginBottom: "16px",
              }}
            >
              <div style={{ flex: 1 }}>
                <Text style={{ color: "#ffffff", fontSize: "18px", fontWeight: "bold" }}>{student.proposalTitle}</Text>
                <br />
                <Text style={{ color: "#ffffff" }}>
                  <span className="font-bold">Authors: </span>
                  {student.groupMembers.join(", ")}
                </Text>
                <br />
                <Text style={{ color: "#ffffff" }}>
                  <span className="font-bold">Panelists: </span>
                  {student.panelists.join(", ")}
                </Text>
                <br />
                <Text style={{ color: "#ffffff", marginRight: "10px" }}>
                  <span className="font-bold">Date Uploaded:</span>{" "}
                  {new Date(student.submittedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Text>
                <br />
                <Text style={{ color: "#ffffff" }}>
                  <span className="font-bold">Date Published:</span> {student.datePublished || "N/A"}
                </Text>
                <br />
                <Text style={{ color: "#ffffff" }}>
                  <strong>Manuscript Status:</strong> {student.manuscriptStatus}
                </Text>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginRight: "10px" }}>
                <Button
                  icon={<EditOutlined />}
                  onClick={() => handleViewManuscript(student._id, student.channelId)}
                  style={{ marginBottom: "20px", width: "100px" }}
                />
                <Button
                  icon={<LoadingOutlined />}
                  onClick={() => updateManuscriptStatus(student.channelId, "reviseOnAdvicer")}
                  style={{ marginBottom: "20px", width: "100px" }}
                />
                <Button
                  icon={<CheckOutlined />}
                  onClick={() => updateManuscriptStatus(student.channelId, "readyToDefense")}
                  style={{ marginBottom: "20px", width: "100px" }}
                />
                <Button
                  type="primary"
                  onClick={() => openTaskModal(student)}
                  style={{ marginBottom: "20px", width: "100px" }}
                >
                  View Task
                </Button>
              </div>
            </div>
          </List.Item>
        )}
      />

      {isEditorOpen && selectedStudentId && (
        <CkEditorDocuments userId={user._id} channelId={selectedChannelId} onClose={() => setIsEditorOpen(false)} />
      )}

      <ConfigProvider>
        <Modal
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setIsModalVisible(false)}>
              Close
            </Button>,
            <Button key="add" type="primary" onClick={handleAddTask}>
              Add Task
            </Button>,
          ]}
        >
          <Input
            placeholder="Enter a task"
            value={taskInput}
            onChange={handleTaskInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddTask();
            }}
          />
          <br />
          <List
            dataSource={tasks}
            renderItem={(task, index) => (
              <List.Item
                key={index}
                actions={[
                  <Checkbox checked={task.completed} onChange={() => handleCompleteTask(index)}>
                    Completed
                  </Checkbox>,
                  <Button icon={<DeleteOutlined />} onClick={() => handleDeleteTask(index)} />,
                ]}
              >
                {task.title}
              </List.Item>
            )}
          />
        </Modal>
      </ConfigProvider>
    </div>
  );
}
