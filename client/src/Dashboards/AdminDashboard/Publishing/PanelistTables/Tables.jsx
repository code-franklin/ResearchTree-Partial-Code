import React, { useEffect, useState } from 'react';
import { style } from '@mui/system';

import { List, Typography, Button, Input, ConfigProvider, Progress } from 'antd';
import { EditOutlined, CheckOutlined, SearchOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TextHeader from './TextHeader'


import CkEditorDocuments from './CkEditorDocuments';

import AdvicerApproved from './AdvicerApproved'
import RevisePanelist from './RevisePanelist';
import ApprovedOnPanel from './ApprovedOnPanel'






const ListManuscript = () => {

  const [value, setValue] = useState(0); // Set to 0 (index of the first tab)

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  }
  
  CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };
  
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  return (
    <div style={{ position: 'absolute', left: '440px', top: '200px', maxWidth: '1370px', height: '641px', borderRadius: '8px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '16px' }}>
        <ConfigProvider
          theme={{
            components: {
              Input: {
                colorPrimary: '#222222',
                colorBgBase: '#222222',
                colorTextBase: 'white',
                colorBorder: '#1E1E1E',
                colorPrimaryHover: '#1E1E1E',
                colorPrimaryActive: '#222222',
                controlOutline: '#1E1E1E',
                algorithm: true,
              },
              Button: {
                colorPrimary: '#222222',
                colorBgBase: '#222222',
                colorPrimaryHover: 'none',
                colorPrimaryActive: 'none',
                colorBorder: 'white',
                controlOutline: 'none',
              }
            },
          }}
        >

          <div>
            
            <div className='absolute w-[1000px]'>
            <TextHeader/>
            </div>
           

            <Input
                placeholder="Search articles..."
                /* value={searchText}
                onChange={(e) => handleSearch(e.target.value)} */
                style={{  position: 'fixed',top: '194px', right: '770px', width: '35%', height: '50px', borderRadius: '20px', paddingLeft: '60px'  }}
            />
            <SearchOutlined style={{ position: 'absolute', marginTop: '6px', marginLeft: '60px', color: 'grey', fontSize: '28px' }} />
          </div>

        </ConfigProvider>
      </div>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'flex-end' }}>
    </div>

    <Box sx={{ width: '100%',  }}>
    <Box sx={{ width: '100%' }}>
    <Box sx={{ width: '100%' }}>
  <Box
  
    sx={{
      position: 'fixed',
      borderBottom: 1,
      borderColor: 'divider',
     
      width: '27.7%',
      marginTop: '-36px',
      marginLeft: '740px',
    }}
  >
    <Tabs 
      style={{borderRadius: '20px', background: '#222222'}}
      value={value} 
      onChange={handleChange} 
      aria-label="basic tabs example"
      TabIndicatorProps={{ sx: { display: 'none' } }} // This hides the underline
    >
      <Tab
      
        sx={{
          borderRadius: '20px',
          color: 'green', // Default color
          '&:hover': {
            color: 'white', // Customize active text color
            backgroundColor: 'green', // Customize active background color
          },
          '&.Mui-selected': {
            color: 'white', // Customize active text color
            backgroundColor: 'green', // Customize active background color
          },
        }}
        label="Defenders"
        {...a11yProps(0)}
      />
      <Tab
        sx={{
          marginLeft: '5px',
          borderRadius: '20px',
          color: 'green',
          '&:hover': {
            color: 'white', // Customize active text color
            backgroundColor: 'green', // Customize active background color
          },
          '&.Mui-selected': {
            color: 'white', // Customize active text color
            backgroundColor: 'green', // Customize active background color
          },
        }}
        label="Ongoing Revision "
        {...a11yProps(1)}
      />
      <Tab
        sx={{
          marginLeft: '5px',
          borderRadius: '20px',
          color: 'green',
          '&:hover': {
            color: 'white', // Customize active text color
            backgroundColor: 'green', // Customize active background color
          },
          '&.Mui-selected': {
            color: 'white', // Customize active text color
            backgroundColor: 'green', // Customize active background color
          },
        }}
        label="Finished"
        {...a11yProps(2)}
      />

    </Tabs>
  </Box>
</Box>

</Box>


      <CustomTabPanel value={value} index={0}>
        <AdvicerApproved/>
      </CustomTabPanel>

      <CustomTabPanel value={value} index={1}>
        <RevisePanelist/>
      </CustomTabPanel>

      <CustomTabPanel value={value} index={2}>
        <ApprovedOnPanel/>
      </CustomTabPanel>
  
    </Box>

      <ConfigProvider

      theme={{ components: { Modal: { colorPrimary: '#1E1E1E', colorBgBase: '#1E1E1E', colorTextBase: 'white', colorBorder: '#1E1E1E', algorithm: true, },
     },
  }}
      >


      </ConfigProvider>
     
    </div>
  );
};

export default ListManuscript;
