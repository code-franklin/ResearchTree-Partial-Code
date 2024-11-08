import { useEffect, useState } from "react";
import {
  List,
  Typography,
  Button,
  Modal,
  Input,
  Checkbox,
  ConfigProvider,
  Select,
} from "antd";
import {
  EditOutlined,
  CheckOutlined,
  LoadingOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import CkEditorDocuments from "./CkEditorDocuments";

const { Text } = Typography;
const { Option } = Select;

export default function ListManuscript({ adviserName, students }) {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [selectedChannelId, setSelectedChannelId] = useState(null);

  const [courses, setCourses] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentTaskStudent, setCurrentTaskStudent] = useState(null);
  const [taskInput, setTaskInput] = useState("");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    setFilteredStudents(students);
    const uniqueCourses = [
      ...new Set(students.map((student) => student.course)),
    ];
    setCourses(uniqueCourses);
  }, [students]);

  const handleViewManuscript = (studentId, channelId) => {
    setSelectedStudentId(studentId);
    setSelectedChannelId(channelId);
    setIsEditorOpen(true);
  };

  const openTaskModal = (student) => {
    setCurrentTaskStudent(student);
    setIsModalVisible(true);
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
    if (value === "") {
      setFilteredStudents(students);
    } else {
      setFilteredStudents(
        students.filter((student) => student.course === value)
      );
    }
  };

  return (
    <div
      style={{ flex: 1, overflowX: "hidden", padding: "20px", width: "1263px" }}
    >
      <h2 style={{ color: "#ffffff" }}>Advisees of {adviserName}</h2>
      <Select
        value={selectedCourse}
        onChange={handleCourseChange}
        style={{ marginBottom: "20px", width: "200px" }}
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
          (student) => student.manuscriptStatus === "reviseOnAdvicer"
        )}
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
                <Text
                  style={{
                    color: "#ffffff",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  {student.proposalTitle}
                </Text>
                <br />
                <Text style={{ color: "#ffffff" }}>
                  <span className='font-bold'>Authors: </span>
                  {student.groupMembers.join(", ")}
                </Text>
                <br />
                <Text style={{ color: "#ffffff" }}>
                  <span className='font-bold'>Panelists: </span>
                  {student.panelists.join(", ")}
                </Text>
                <br />
                {student.submittedAt && (
                  <Text style={{ color: "#ffffff", marginRight: "10px" }}>
                    <span className='font-bold'>Date Uploaded:</span>{" "}
                    {new Date(student.submittedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </Text>
                )}
                <Text style={{ color: "#ffffff" }}>
                  <span className='font-bold'>Date Published:</span>{" "}
                  {student.datePublished || "N/A"}
                </Text>
                <br />
                <p style={{ color: "#ffffff" }}>Course: {student.course}</p>
                <p style={{ color: "#ffffff" }}>Course: {student.name}</p>
                <p style={{ color: "#ffffff" }}>
                  Manuscript Status: {student.manuscriptStatus}
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginRight: "10px",
                }}
              >
                <Button
                  icon={<EditOutlined />}
                  onClick={() =>
                    handleViewManuscript(student._id, student.channelId)
                  }
                  style={{ marginBottom: "20px", width: "100px" }}
                />
                <Button
                  icon={<LoadingOutlined />}
                  style={{ marginBottom: "20px", width: "100px" }}
                />
                <Button
                  icon={<CheckOutlined />}
                  style={{ marginBottom: "20px", width: "100px" }}
                />
                <Button
                  type='primary'
                  onClick={() => openTaskModal(student)}
                  style={{ width: "100px" }}
                >
                  View Task
                </Button>
              </div>
            </div>
          </List.Item>
        )}
      />

      {isEditorOpen && selectedStudentId && (
        <CkEditorDocuments
          userId={"dummyUserId"}
          channelId={selectedChannelId}
          onClose={() => setIsEditorOpen(false)}
        />
      )}

      <ConfigProvider>
        <Modal
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={[
            <Button key='close' onClick={() => setIsModalVisible(false)}>
              Close
            </Button>,
            <Button key='add' type='primary' onClick={handleAddTask}>
              Add Task
            </Button>,
          ]}
        >
          <Input
            placeholder='Enter a task'
            value={taskInput}
            onChange={handleTaskInputChange}
            onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
          />
          <br />
          <br />
          <List
            dataSource={tasks}
            renderItem={(task, index) => (
              <List.Item
                key={index}
                actions={[
                  <Checkbox
                    checked={task.completed}
                    onChange={() => handleCompleteTask(index)}
                  >
                    {task.completed ? "Completed" : "Pending"}
                  </Checkbox>,
                  <Button
                    type='link'
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteTask(index)}
                  />,
                ]}
              >
                <Text delete={task.completed}>{task.title}</Text>
              </List.Item>
            )}
          />
        </Modal>
      </ConfigProvider>
    </div>
  );
}