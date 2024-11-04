import React, { useState } from 'react';
import { Select } from 'antd';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import ListManuscript from './ListManuscript';
import OngoingRevise from './OngoingRevise';
import ReadyforDefense from './ReadyforDefense';

const { Option } = Select;

const Tables = () => {
  const [value, setValue] = useState(0);
  const [selectedAdviser, setSelectedAdviser] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleAdviserSelect = (value) => {
    setSelectedAdviser(value);
  };

  const handleCategorySelect = (value) => {
    setSelectedCategory(value);
  };

  return (
    <div style={{ position: 'absolute', left: '440px', top: '200px', maxWidth: '1370px', height: '641px', borderRadius: '8px', display: 'flex', flexDirection: 'column' }}>
      
      {/* Category Dropdown */}
      <Select
        style={{ width: 200, marginBottom: 10 }}
        placeholder="Select a Category"
        onChange={handleCategorySelect}
        allowClear
      >
        {["Computer Science", "Engineering", "Finance", "IT", "Physics", "Environmental Science"].map((category) => (
          <Option key={category} value={category}>
            {category}
          </Option>
        ))}
      </Select>

      {/* Adviser Dropdown */}
      <Select
        style={{ width: 200, marginBottom: 20 }}
        placeholder="Select an Adviser"
        onChange={handleAdviserSelect}
        allowClear
      >
        {["Dr. John", "Prof. Emily", "Dr. Peter"].map((adviser) => (
          <Option key={adviser} value={adviser}>
            {adviser}
          </Option>
        ))}
      </Select>

      <Box sx={{ width: '100%' }}>
        <Box
          sx={{
            position: 'fixed',
            borderBottom: 1,
            borderColor: 'divider',
            width: '33.7%',
            marginTop: '-36px',
            marginLeft: '740px',
          }}
        >
          <Tabs
            style={{ borderRadius: '20px', background: '#222222' }}
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            TabIndicatorProps={{ sx: { display: 'none' } }}
          >
            <Tab
              sx={{
                borderRadius: '20px',
                color: 'green',
                '&:hover': { color: 'white', backgroundColor: 'green' },
                '&.Mui-selected': { color: 'white', backgroundColor: 'green' },
              }}
              label="List Manuscript"
            />
            <Tab
              sx={{
                marginLeft: '5px',
                borderRadius: '20px',
                color: 'green',
                '&:hover': { color: 'white', backgroundColor: 'green' },
                '&.Mui-selected': { color: 'white', backgroundColor: 'green' },
              }}
              label="Ongoing Revision"
            />
            <Tab
              sx={{
                marginLeft: '5px',
                borderRadius: '20px',
                color: 'green',
                '&:hover': { color: 'white', backgroundColor: 'green' },
                '&.Mui-selected': { color: 'white', backgroundColor: 'green' },
              }}
              label="Ready for Defense"
            />
          </Tabs>
        </Box>

        {/* Render based on selected tab */}
        <Box sx={{ p: 3 }}>
          {value === 0 && <ListManuscript selectedAdviser={selectedAdviser} selectedCategory={selectedCategory} />}
          {value === 1 && <OngoingRevise />}
          {value === 2 && <ReadyforDefense />}
        </Box>
      </Box>
    </div>
  );
};

export default Tables;
