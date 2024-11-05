import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Space, Table, Tag, ConfigProvider, Modal } from 'antd';
import ListManuscript from './AdviserManuscript';

const App = () => {
  const [selectedAdviser, setSelectedAdviser] = useState(null);
  const [advisers, setAdvisers] = useState([]);

  useEffect(() => {
    const fetchAdvisers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/advicer/handle/manuscript');
        console.log(response.data); // Check the structure of the data returned
        const adviserData = response.data.advisers.map(adviser => ({
          key: adviser._id,
          name: adviser.name,
          profileImage: adviser.profileImage,
          specializations: adviser.specializations.join(', '),
          tags: ['Adviser'],
        }));
        setAdvisers(adviserData);
      } catch (error) {
        console.error('Error fetching advisers:', error);
      }
    };
    

    fetchAdvisers();
  }, []);

  const handleAdviserClick = (adviser) => {
    setSelectedAdviser(adviser);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space onClick={() => handleAdviserClick(record)} style={{ cursor: 'pointer' }}>
          <img className="h-[37px] inline-block mr-2 mb-1" src={record.profileImage} alt={text} />
          <a>{text}</a>
        </Space>
      ),
    },
    {
      title: 'Role',
      key: 'tags',
      dataIndex: 'tags',
      render: (_, { tags }) => (
        <>
          {tags.map((tag) => {
            let color = tag.length > 5 ? 'geekblue' : 'green';
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
  ];

  const showProfile = () => {
    Modal.info({
      title: selectedAdviser.name,
      content: (
        <div>
          <img src={`http://localhost:5000/public/uploads/${selectedAdviser.profileImage || 'default-avatar.png'}`} alt={selectedAdviser.name} />


          <p>Specializations: {selectedAdviser.specializations}</p>
        </div>
      ),
      onOk() {
        setSelectedAdviser(null);
      },
    });
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            colorBgContainer: '#222222',
            borderRadius: 10,
            colorText: 'white',
            colorTextHeading: 'white',
            fontSize: '25px',
          },
        },
      }}
    >
      {!selectedAdviser ? (
        <Table
          columns={columns}
          dataSource={advisers}
          pagination={false}
          style={{
            position: 'absolute',
            width: '1000px',
            marginTop: '200px',
            marginLeft: '600px',
            overflow: 'hidden',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          }}
        />
      ) : (
        <ListManuscript adviserName={selectedAdviser.name} manuscripts={adviserData[selectedAdviser.name]} />
      )}
    </ConfigProvider>
  );
};

export default App;
