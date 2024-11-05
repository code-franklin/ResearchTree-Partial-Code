import React, { useState, useEffect } from "react";
import { Space, Table, Tag, Button } from "antd";
import axios from "axios";

const App = () => {
  const [admin, setAdmin] = useState(null);
  const [pendingUsers, setPendingUsers] = useState([]);

  // Fetch admin data from localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setAdmin(JSON.parse(storedUser));
    }
  }, []);

  // Fetch pending users only if admin is available
  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:7000/api/admin/student-pending"
        );
        setPendingUsers(response.data);
      } catch (error) {
        console.error("Error fetching pending users:", error);
      }
    };

    if (admin) {
      fetchPendingUsers();
    }
  }, [admin]);

  const handleApprove = async (userId) => {
    try {
      await axios.put(`http://localhost:7000/api/admin/approve/${userId}`);
      setPendingUsers((prevUsers) =>
        prevUsers.filter((user) => user._id !== userId)
      );
    } catch (error) {
      console.error("Error approving user:", error);
    }
  };

  const handleDecline = async (userId) => {
    try {
      await axios.put(`http://localhost:7000/api/admin/decline/${userId}`);
      setPendingUsers((prevUsers) =>
        prevUsers.filter((user) => user._id !== userId)
      );
    } catch (error) {
      console.error("Error declining user:", error);
    }
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
      render: () => <Tag color='orange'>Pending</Tag>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size='middle'>
          <Button
            onClick={() => handleDecline(record._id)}
            style={{ color: "red" }}
          >
            Decline
          </Button>
          <Button
            onClick={() => handleApprove(record._id)}
            style={{ color: "#1E1E1E" }}
          >
            Accept
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {admin ? (
        <Table
          style={{
            width: "50%",
            marginLeft: "600px",
            marginTop: "200px",
            position: "absolute",
          }}
          columns={columns}
          dataSource={pendingUsers}
          rowKey='_id'
          pagination={{ pageSize: 5 }}
        />
      ) : (
        <p>Please log in to view pending users.</p>
      )}
    </div>
  );
};

export default App;
