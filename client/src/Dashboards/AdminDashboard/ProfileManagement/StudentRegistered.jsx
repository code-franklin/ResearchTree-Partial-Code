import React, { useState, useEffect } from 'react';
import { Space, Table, Tag, Button } from 'antd';
import axios from 'axios';

const App = () => {
  const [admin, setAdmin] = useState(null);
  const [allUsers, setAllUsers] = useState([]);


  // Fetch admin data from localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setAdmin(JSON.parse(storedUser));
    }
  }, []);

  // Fetch pending users only if admin is available
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/student-users');
        setAllUsers(response.data);
      } catch (error) {
        console.error('Error fetching all users:', error);
      }
    };

    if (admin) {
      fetchAllUsers();
    }
  }, [admin]);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Status',
      key: 'status',
      render: () => (
        <Tag color="orange">
          Registered
        </Tag>
      ),
    },

  ];

  return (
    <div>
      {admin ? (
        <Table 
          style={{width: '50%', marginLeft: '600px', marginTop: '200px', position: 'absolute'}}
          columns={columns} 
          dataSource={allUsers} 
          rowKey="_id"
          pagination={{ pageSize: 8 }}
        />
      ) : (
        <p>Please log in to view all registered users.</p>
      )}
    </div>
  );
};

export default App;
