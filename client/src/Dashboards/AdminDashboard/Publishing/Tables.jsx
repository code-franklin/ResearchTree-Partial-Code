import React, { useState } from 'react';
import { Select } from 'antd';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import ListManuscript from './AdvicersTables/ListManuscript';
import OngoingRevise from './AdvicersTables/OngoingRevise';
import ReadyforDefense from './AdvicersTables/ReadyforDefense';
import MonitoringAdvicer from "./AdvicersTables/MonitoringAdvicer"

const { Option } = Select;

const Tables = ({ adviserName, adviserImage, students }) => {
  const [value, setValue] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  const handleCategorySelect = (value) => {
    setSelectedCategory(value);
  };

  return (
    <div style={{
      position: 'absolute',
      left: '440px',
      top: '200px',
      maxWidth: '1370px',
      height: '641px',
      borderRadius: '8px',
      display: 'flex',
      flexDirection: 'column'
    }}>
     

      <Box sx={{ width: '100%' }}>
        <Box sx={{
          position: 'fixed',
          borderBottom: 1,
          borderColor: 'divider',
          width: '29.7%',
          marginTop: '35px',
          marginLeft: '40px',
        }}>
          <Tabs
            style={{ borderRadius: '20px', background: '#222222' }}
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            TabIndicatorProps={{ sx: { display: 'none' } }}
          >
            <Tab label="New Uploads" sx={tabStyles} />
            <Tab label="Ongoing Revision" sx={tabStyles} />
            <Tab label="Defenders" sx={tabStyles} />
            <Tab label="Monitoring" sx={tabStyles} />
          </Tabs>
        </Box>

        {/* Render based on selected tab */}
        <Box sx={{ p: 4 }}>
          {value === 0 && (
            <ListManuscript adviserName={adviserName} adviserImage={adviserImage} students={students} selectedCategory={selectedCategory} />
          )}
          {value === 1 && (
            <OngoingRevise adviserName={adviserName} adviserImage={adviserImage} students={students} selectedCategory={selectedCategory} />
          )}
          {value === 2 && (
            <ReadyforDefense adviserName={adviserName} adviserImage={adviserImage} students={students} selectedCategory={selectedCategory} />
          )}
          {value === 3 && (
            <MonitoringAdvicer adviserName={adviserName} adviserImage={adviserImage} students={students} selectedCategory={selectedCategory} />
          )}
        </Box>
      </Box>
    </div>
  );
};

const tabStyles = {
  marginLeft: '5px',
  borderRadius: '20px',
  color: 'green',
  '&:hover': { color: 'white', backgroundColor: 'green' },
  '&.Mui-selected': { color: 'white', backgroundColor: 'green' }
};

export default Tables;
