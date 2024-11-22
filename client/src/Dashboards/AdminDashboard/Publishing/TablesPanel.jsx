import React, { useState } from 'react';
import { Select } from 'antd';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import AdvicerApproved from './PanelistTables/AdvicerApproved';
import RevisePanelist from './PanelistTables/RevisePanelist';
import ApprovedOnPanel from './PanelistTables/ApprovedOnPanel';

const { Option } = Select;

const Tables = ({ panelName, panelImage, panelistStudents }) => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
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
          width: '20.7%',
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
            <Tab label="Defenders" sx={tabStyles} />
            <Tab label="Ongoing Revision" sx={tabStyles} />
            <Tab label="Finished" sx={tabStyles} />
          </Tabs>
        </Box>
        
        {/* Render based on selected tab */}
        <Box sx={{ p: 3 }}>
          {value === 0 && (
            <AdvicerApproved panelName={panelName} panelImage={panelImage} panelistStudents={panelistStudents} />
          )}
          {value === 1 && (
            <RevisePanelist panelName={panelName} panelImage={panelImage} panelistStudents={panelistStudents} />
          )}
          {value === 2 && (
            <ApprovedOnPanel panelName={panelName} panelImage={panelImage} panelistStudents={panelistStudents} />
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
