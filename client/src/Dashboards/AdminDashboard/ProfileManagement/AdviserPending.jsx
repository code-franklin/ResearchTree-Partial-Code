import React from 'react';
import { Space, Table, Tag } from 'antd';
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },

  {
    title: 'Status',
    key: 'status',
    dataIndex: 'status',
    render: (_, { tags }) => (
      <>
        {tags.map((tag) => {
          let color = tag.length > 5 ? 'orange' : 'orange';
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
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
         <a><span className='text-[red]'>Decline</span></a>
      <a><span className='text-[#1E1E]'>Accept</span></a>
      </Space>
    ),
  },
];
const data = [
  {
    key: '1',
    name: 'Crisanto Gulay',
    email: 'crisanto@gmail.com',
    address: 'New York No. 1 Lake Park',
    tags: ['Pending'],
  },
  {
    key: '2',
    name: 'Sherwin Sapin',
    email: 'sherwin@gmail.com',
    tags: ['Pending'],
  },

  {
    key: '1',
    name: 'Crisanto Gulay',
    email: 'crisanto@gmail.com',
    address: 'New York No. 1 Lake Park',
    tags: ['Pending'],
  },
 
  {
    key: '3',
    name: 'Aj Matute',
    email: 'aj@gmail.com',
    tags: ['Pending'],
  },

  {
    key: '2',
    name: 'Sherwin Sapin',
    email: 'sherwin@gmail.com',
    tags: ['Pending'],
  },

  {
    key: '1',
    name: 'Crisanto Gulay',
    email: 'crisanto@gmail.com',
    address: 'New York No. 1 Lake Park',
    tags: ['Pending'],
  },
];
const App = () => <Table style={{width: '50%', marginLeft: '600px', marginTop: '200px', position: 'absolute'}} columns={columns} dataSource={data} />;
export default App;