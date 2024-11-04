import React, { useState } from 'react';
import { Space, Table, Tag, ConfigProvider } from 'antd';
import ListManuscript from './AdviserManuscript';

const adviserData = {
  'Sherwin Sapin': [{ title: 'Manuscript A', status: 'Ongoing' }, { title: 'Manuscript B', status: 'Completed' }],
  'Crisanto Gulay': [{ title: 'Manuscript C', status: 'Pending' }, { title: 'Manuscript D', status: 'In Review' }],
  'Aj Matute': [{ title: 'Manuscript E', status: 'Ready for Defense' }],
};

const columns = (onClickAdviser) => [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text, record) => (
      <Space onClick={() => onClickAdviser(record.name)} style={{ cursor: 'pointer' }}>
        <img className="h-[37px] inline-block mr-2 mb-1" src="/src/assets/cris.png" />
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
          let color = tag.length > 5 ? 'green' : 'green';
          if (tag === 'loser') {
            color = 'volcano';
          }
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

const data = [
  { key: '1', name: 'Sherwin Sapin', tags: ['Panelist'] },
  { key: '2', name: 'Crisanto Gulay', tags: ['Panelist']},
  { key: '3', name: 'Aj Matute', tags: ['Panelist'] },
  { key: '3', name: 'Aj Matute', tags: ['Panelist'] },
  { key: '3', name: 'Aj Matute', tags: ['Panelist']},
];

const App = () => {
  const [selectedAdviser, setSelectedAdviser] = useState(null);

  const handleAdviserClick = (name) => {
    setSelectedAdviser(name);
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
          columns={columns(handleAdviserClick)}
          dataSource={data}
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
        <ListManuscript adviserName={selectedAdviser} manuscripts={adviserData[selectedAdviser]} />
      )}
    </ConfigProvider>
  );
};

export default App;
