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

  const [specializationsOptions, setSpecializationsOptions] = useState([]);

  const designOptions = [
    { value: 'Subject Expert', label: 'Subject Expert' },
    { value: 'Statistician', label: 'Statistician' },
    { value: 'Technical Expert', label: 'Technical Expert' }
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setAdmin(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const response = await axios.get('http://localhost:7000/api/advicer/specializations');
        setSpecializationsOptions(response.data.map(spec => ({ value: spec.name, label: spec.name })));
      } catch (error) {
        console.error('Error fetching specializations:', error);
      }
    };
    fetchSpecializations();
  }, []);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await axios.get("http://localhost:7000/api/admin/advicer-users");
        setAllUsers(response.data);
      } catch (error) {
        message.error("Failed to fetch users.");
      }
    };

    if (admin) {
      fetchAllUsers();
    }
  }, [admin]);

  useEffect(() => {
    if (currentUser) {
      form.setFieldsValue({
        name: currentUser.name || '',
        email: currentUser.email || '',
        handleNumber: currentUser.handleNumber || '',
        specializations: currentUser?.specializations?.map(spec => ({ value: spec, label: spec })) || [],
        design: designOptions.find(option => option.value === currentUser.design),
      });
    }
  }, [currentUser, form]);

  const handleEditUser = async (values) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("handleNumber", values.handleNumber);
    formData.append("design", values.design.value);

    const selectedSpecializations = values.specializations.map(spec => spec.value);
    formData.append("specializations", JSON.stringify(selectedSpecializations));

    if (values.deleteProfileImage) {
      formData.append("profileImage", null);
    } else {
      if (file) {
        formData.append("profileImage", file);
      } else if (!file && !values.deleteProfileImage) {
        formData.append("profileImage", currentUser.profileImage);
      }
    }

    Modal.confirm({
      title: 'Are you sure you want to save the changes?',
      onOk: async () => {
        try {
          await axios.put(`http://localhost:7000/api/admin/advicer-users/${currentUser._id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          setAllUsers((prevUsers) =>
            prevUsers.map((user) =>
              user._id === currentUser._id
                ? { ...user, ...values, profileImage: file ? file.name : user.profileImage, design: values.design.value }
                : user
            )
          );

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
      console.error("Error resetting password:", error);
      message.error("Failed to reset password.");
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:7000/api/admin/users/${userId}`);
      setAllUsers(allUsers.filter((user) => user._id !== userId));
      message.success("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      message.error("Failed to delete user.");
    }
  };

  const handleFileChange = (info) => {
    setFile(info.file.originFileObj);
  };

  const openEditModal = (user) => {
    setCurrentUser(user);
    setFile(null);
    setIsEditModalVisible(true);
  };

  const handleModalClose = () => {
    setIsEditModalVisible(false);
    setFile(null);
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
            background: '#222222',
            
          }}
          columns={columns}
          dataSource={allUsers}
          rowKey="_id"
          pagination={{ pageSize: 8 }}
        />
      ) : (
        <p>Please log in to view all registered users.</p>
      )}

      {/* Edit User Modal */}
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

          <Form.Item name="handleNumber" label="Handle Student" style={{ marginBottom: "15px" }}>
            <Input />
          </Form.Item>

          <Form.Item label="Specializations" name="specializations">
            <Select
              isMulti
              options={specializationsOptions}
              value={form.getFieldValue("specializations")}
              onChange={(selectedOptions) => form.setFieldsValue({ specializations: selectedOptions })}
            />
          </Form.Item>
          
          <Form.Item label="Design" name="design">
            <Select
              options={designOptions}
              placeholder="Select Designation"
            />
          </Form.Item>

          <Form.Item name="profileImage" label="Profile Image" style={{ marginBottom: "15px" }}>
            <Upload
              beforeUpload={(file) => {
                setFile(file);
                return false;  // Prevent auto upload
              }}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>Upload Profile Image</Button>
            </Upload>
          </Form.Item>

          <Form.Item name="deleteProfileImage" valuePropName="checked">
            <Checkbox>Delete Profile Image</Checkbox>
          </Form.Item>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
            <Button type="primary" htmlType="submit" style={{ width: "48%" }}>
              Save Changes
            </Button>
            <Button type="default" onClick={() => setIsResetPasswordModalVisible(true)} style={{ width: "48%" }}>
              Reset Password
            </Button>
            
          </div>
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
        {/* <Input.Password
          placeholder="Enter New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        /> */}
      </Modal>
    </div>
  );
};

export default App;
