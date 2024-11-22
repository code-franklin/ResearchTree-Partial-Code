import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Table, Tag, message, Upload, Checkbox } from "antd";
import axios from "axios";
import { UploadOutlined } from "@ant-design/icons";

import Select from 'react-select';

const App = () => {
  const [admin, setAdmin] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isResetPasswordModalVisible, setIsResetPasswordModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [file, setFile] = useState(null);
  const [form] = Form.useForm();

  const [panelists, setPanelists] = useState([]); // State for panelists

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setAdmin(JSON.parse(storedUser));
    }
  }, []);

  
  const courseOptions = [
    { value: 'BSIT', label: 'BSIT' },
    { value: 'BSCS', label: 'BSCS' },
  ];

  useEffect(() => {
    const fetchPanelists = async () => {
      try {
        const response = await axios.get("http://localhost:7000/api/admin/fetch-advisors");
        const uniquePanelists = Array.from(new Set(response.data.map(p => p._id)))
        .map(id => response.data.find(p => p._id === id));
      setPanelists(uniquePanelists.map(panelist => ({
        value: panelist._id,
        label: panelist.name || "Unnamed Panelist",
      })));
      } catch (error) {
        console.error("Error fetching panelists:", error);
        message.error("Failed to fetch panelists.");
      }
    };

    const fetchAllUsers = async () => {
      try {
        const response = await axios.get("http://localhost:7000/api/admin/student-users");
        setAllUsers(response.data);
      } catch (error) {
        console.error("Error fetching all users:", error);
        message.error("Failed to fetch users.");
      }
    };

    if (admin) {
      fetchPanelists();
      fetchAllUsers();
    }
  }, [admin]);

  useEffect(() => {
    if (currentUser) {
      form.setFieldsValue({
        name: currentUser.name || '',
        email: currentUser.email || '', 
        groupMembers: currentUser.groupMembers || '',
        panelists: currentUser.panelists.map((panel) => ({
          value: panel._id,
          label: panel.name,
        })) || [], // Prevent undefined map issues
        course: courseOptions.find(option => option.value === currentUser.course),
      }); // Update form fields with the latest currentUser data
      
    }
  }, [currentUser, form]);

  const handleEditUser = async (values) => {
    const selectedPanelists = values.panelists.map((panel) => panel.value); // Extract IDs
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("groupMembers", values.groupMembers);
    formData.append("panelists", JSON.stringify(selectedPanelists));
    formData.append("course", values.course.value);

    // const selectedPanelists = values.panelists.map((panel) => panel.value);
    // formData.append("panelists", JSON.stringify(selectedPanelists));

    // Handle profile image update
    if (values.deleteProfileImage) {
      formData.append("profileImage", null); // Delete profile image
    } else {
      if (file) {
        formData.append("profileImage", file); // New profile image
      } else if (!file && !values.deleteProfileImage) {
        formData.append("profileImage", currentUser.profileImage); // Keep existing profile image
      }
    }
  
    Modal.confirm({
      title: 'Are you sure you want to save the changes?',
      onOk: async () => {
        try {
            await axios.put(`http://localhost:7000/api/admin/student-users/${currentUser._id}`, formData, {
              headers: { "Content-Type": "multipart/form-data" },
            });

            setAllUsers((prevUsers) =>
              prevUsers.map((user) =>
                user._id === currentUser._id
                  ? {
                      ...user,
                      ...values,
                      profileImage: file ? file.name : user.profileImage,
                      course: values.course.value,
                    }
                  : user
              )
            );
            
            // Refresh the page after saving
            message.success("User updated successfully");
            setIsEditModalVisible(false);
            setCurrentUser(null);
            form.resetFields();
            window.location.reload();
          } catch (error) {
            message.error("Failed to update user.");
          }
          },
        });
      };

  const handleResetPassword = async () => {
    if (!newPassword) {
      message.error("Please enter a new password.");
      return;
    }
    try {
      await axios.put(`http://localhost:7000/api/admin/users/${currentUser._id}/reset-password`, {
        newPassword,
      });
      message.success("Password reset successfully");
      setIsResetPasswordModalVisible(false);
      setNewPassword("");
    } catch (error) {
      message.error("Failed to reset password.");
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:7000/api/admin/users/${userId}`);
      setAllUsers(allUsers.filter((user) => user._id !== userId));
      message.success("User deleted successfully");
    } catch (error) {
      message.error("Failed to delete user.");
    }
  };

  const handleFileChange = (info) => {
    setFile(info.file.originFileObj);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Status",
      key: "status",
      render: () => <Tag color="orange">Registered</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, student) => (
        <div>
          <Button type="primary" onClick={() => openEditModal(student)}>
            Edit
          </Button>

          <Button
           style={{marginLeft: '5px'}}
            type="primary"
            danger
            onClick={() => handleDeleteUser(student._id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const openEditModal = (user) => {
    console.log("Editing user:", user); // Debug
    setCurrentUser(user);
    setFile(null); // Reset file when opening modal for editing
    setIsEditModalVisible(true);
  };

  const handleModalClose = () => {
    setIsEditModalVisible(false);  // Close the modal
    setFile(null);                  // Reset selected file
  };  

  return (
    <div>
      {admin ? (
        <Table
          style={{
            width: "50%",
            margin: "50px auto",
            marginTop: "200px",
            marginLeft: "600px",
            textAlign: "center",
            position: "absolute",
          }}
          columns={columns}
          dataSource={allUsers}
          rowKey={(record) => record._id || record.email || record.name} // Fallback to email or name
          pagination={{ pageSize: 8 }}
        />
      ) : (
        <p>Please log in to view all registered users.</p>
      )}

      <Modal
        title="Edit User"
        visible={isEditModalVisible}
        onCancel={handleModalClose}
        footer={null}
        centered
        width={600}
      >
        <Form
          form={form}
          onFinish={handleEditUser}
          layout="vertical"
          style={{ padding: "20px" }}
        >
          <Form.Item name="name" label="Name" style={{ marginBottom: "15px" }}>
            <Input />
          </Form.Item>

          <Form.Item name="email" label="Email" style={{ marginBottom: "15px" }}>
            <Input />
          </Form.Item>

          {/* Course Dropdown */}
          <Form.Item name="course" label="Course">
            <Select
              options={courseOptions}
              placeholder="Select Course"
              isClearable
            />
          </Form.Item>

          <Form.Item name="groupMembers" label="Group Members" style={{ marginBottom: "15px" }}>
            <Input />
          </Form.Item>

          {/* <Form.Item name="panelists" label="Panelists" style={{ marginBottom: "15px" }}>
            <Input />
          </Form.Item> */}

          {/* Panelists Multi-Select Dropdown */}
          {/* <Form.Item name="panelists" label="Panelists">
            <Select
              isMulti
              options={panelists.map(panelist => ({ value: panelist._id, label: panelist.name }))}
              placeholder="Select Panelists"
            />
          </Form.Item> */}
          
          {/* <Form.Item name="panelists" label="Panelists">
            <Select
              isMulti
              options={panelists}
              value={form.getFieldValue("panelists")}
              onChange={(selectedOptions) => form.setFieldsValue({ panelists: selectedOptions })}
            />
          </Form.Item> */}

          <Form.Item name="panelists" label="Panelists">
            <Select
              isMulti
              options={panelists}
              placeholder="Select Panelists"
              value={form.getFieldValue("panelists")}
              onChange={(selectedOptions) => form.setFieldsValue({ panelists: selectedOptions })}
            />
          </Form.Item>


          <Form.Item name="profileImage" label="Profile Image" style={{ marginBottom: "15px" }}>
            <Upload
              beforeUpload={(file) => {
                setFile(file);
                return false;
              }}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>Upload Profile Image</Button>
            </Upload>
          </Form.Item>

          <Form.Item name="deleteProfileImage" valuePropName="checked" style={{ marginBottom: "15px" }}>
            <Checkbox>Delete profile image</Checkbox>
          </Form.Item>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
            <Button type="primary" htmlType="submit" style={{ width: "48%" }}>
              Save Changes
            </Button>
            <Button type="default" onClick={() => setIsResetPasswordModalVisible(true)} style={{ width: "48%" }}>
              Reset Password
            </Button>
          </div>

          {/* <Button type="default" onClick={handleModalClose} style={{ marginTop: "10px", width: "100%" }}>
            Close
          </Button> */}
        </Form>
      </Modal>

      {/* Reset Password Modal */}
      <Modal
        title="Reset Password"
        visible={isResetPasswordModalVisible}
        onCancel={() => setIsResetPasswordModalVisible(false)}
        onOk={handleResetPassword}
        centered
        width={400}
      >
        <Form layout="vertical" style={{ padding: "20px" }}>
          <Form.Item label="New Password" style={{ marginBottom: "20px" }}>
            <Input.Password value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default App;
