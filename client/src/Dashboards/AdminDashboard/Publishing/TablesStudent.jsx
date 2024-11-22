import React, { useEffect, useState } from "react";
import axios from "axios";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// Advicer Side
import ListManuscript from './StudentsTables/ListManuscript';
import OngoingRevise from './StudentsTables/OngoingRevise';
import ReadyforDefense from './StudentsTables/ReadyforDefense';

// Panel Side
import AdvicerApproved from './StudentsTables/AdvicerApproved';
import RevisePanelist from './StudentsTables/RevisePanelist';
import ApprovedOnPanel from './StudentsTables/ApprovedOnPanel';

const Tables = () => {
  const [value, setValue] = useState(0);
  const [admin, setAdmin] = useState(null);
  const [studentData, setStudentsData] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setAdmin(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("http://localhost:7000/api/admin/list-student/manuscript");
      setStudentsData(response.data.students);
    };
    fetchData();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{
      position: 'relative',
      left: '400px',
      top: '20px',
      maxWidth: '1400px',
      height: 'auto',
      borderRadius: '30px',
      padding: '16px',
      backgroundColor: '#222222',
    }}>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: 1,
          borderColor: 'divider',
          marginBottom: '16px',
        }}
      >
        <Box display="flex" flexDirection="column" alignItems="center" sx={{ width: '45%' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white', mb: 1 }}>
            Advicer Side
          </Typography>
          <Tabs
            value={value < 3 ? value : false}
            onChange={handleChange}
            TabIndicatorProps={{ sx: { display: 'none' } }}
          >
            <Tab label="New Uploads" sx={tabStyles} />
            <Tab label="Ongoing Revision" sx={tabStyles} />
            <Tab label="Defenders" sx={tabStyles} />
          </Tabs>
        </Box>
        <Box display="flex" flexDirection="column" alignItems="center" sx={{ width: '45%' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white', mb: 1 }}>
            Panel Side
          </Typography>
          <Tabs
            value={value >= 3 ? value - 3 : false}
            onChange={(e, newValue) => handleChange(e, newValue + 3)}
            TabIndicatorProps={{ sx: { display: 'none' } }}
          >
            <Tab label="Defenders" sx={tabStyles} />
            <Tab label="Ongoing Revision" sx={tabStyles} />
            <Tab label="Finished" sx={tabStyles} />
          </Tabs>
        </Box>
      </Box>

      <Box sx={{ p: 6, backgroundColor: '#1E1E1E', borderRadius: '8px', boxShadow: 1, height: '' }}>
        {value === 0 && <ListManuscript studentData={studentData} />}
        {value === 1 && <OngoingRevise studentData={studentData} />}
        {value === 2 && <ReadyforDefense studentData={studentData} />}
        {value === 3 && <AdvicerApproved studentData={studentData} />}
        {value === 4 && <RevisePanelist studentData={studentData} />}
        {value === 5 && <ApprovedOnPanel studentData={studentData} />}
      </Box>
    </Box>
  );
};

const tabStyles = {
  margin: '0 5px',
  borderRadius: '20px',
  color: 'green',
  minWidth: '120px',
  '&:hover': { color: 'white', backgroundColor: 'green' },
  '&.Mui-selected': { color: 'white', backgroundColor: 'green' },
  textTransform: 'none',
};

export default Tables;
