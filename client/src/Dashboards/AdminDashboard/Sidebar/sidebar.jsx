import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button, Modal, Box, Typography } from "@mui/joy";
import { Input } from "@mui/material";
import UserAvatar from "./Avatar";
import axios from "axios";
import {DeploymentUnitOutlined } from '@ant-design/icons'
import "./Sidebar.css";

const Sidebar = ({ onSelect }) => {
  const location = useLocation();
  const [admin, setAdmin] = useState(null);
  const [isSpecializationModalOpen, setIsSpecializationModalOpen] = useState(false);
  const [specializations, setSpecializations] = useState([]);
  const [newSpecialization, setNewSpecialization] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  useEffect(() => {
    // Fetch stored user data from localStorage and set it to the admin state
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setAdmin(JSON.parse(storedUser));
    }
  }, []);

  const [activeLink, setActiveLink] = useState(location.pathname);

  const handleLinkClick = (path) => {
    setActiveLink(path);
  };

  const fetchSpecializations = async () => {
    try {
      const response = await axios.get('http://localhost:7000/api/admin/specializations');
      setSpecializations(response.data);
    } catch (error) {
      console.error('Error fetching specializations:', error);
    }
  };

  const handleAddSpecialization = async () => {
    try {
      const response = await axios.post('http://localhost:7000/api/admin/specializations', { name: newSpecialization });
      setSpecializations([...specializations, response.data]);
      setNewSpecialization('');
    } catch (error) {
      console.error('Error adding specialization:', error);
    }
  };

  const handleEditSpecialization = async () => {
    try {
      const response = await axios.put(`http://localhost:7000/api/admin/specializations/${editingId}`, { name: editingName });
      setSpecializations(specializations.map(spec => (spec._id === editingId ? response.data : spec)));
      setEditingId(null);
      setEditingName("");
    } catch (error) {
      console.error("Error editing specialization:", error);
    }
  };

  const handleDeleteSpecialization = async (id) => {
    try {
      await axios.delete(`http://localhost:7000/api/admin/specializations/${id}`);
      setSpecializations(specializations.filter(spec => spec._id !== id));
    } catch (error) {
      console.error('Error deleting specialization:', error);
    }
  };

    // Open the modal and fetch specializations
    const openSpecializationModal = () => {
      setIsSpecializationModalOpen(true);
      fetchSpecializations();
    };

    const startEditing = (id, name) => {
      setEditingId(id);
      setEditingName(name);
    };

  return (
    <div className='sidebar z-1 h-screen w-[313px] bg-[#1E1E1E] text-white flex flex-col fixed'>
      <div>
        <img src='/src/assets/rstreelogo.png' alt='Logo' />

        <img
          className='absolute mt-[610px] ml-[30px]'
          src='/src/assets/ListStudent.png'
          alt='Logo'
        />
        <img
          className='absolute mt-[460px] ml-[35px]'
          src='/src/assets/profile-management.png'
          alt='Logo'
        />
      </div>

      <div className='flex ml-[9px] '>
        <div className='myName ml-[50px] mt-[20px] p-4 text-center'>
          <UserAvatar />
          {/* <span className="text-[21px] font-semibold">{user.name}</span>   I Comment muna pansamantala
          <p className="font-light text-[#4B4B4B]">{user.role}</p> */}

          {admin && (
            <>
              <span className='text-[21px] ml-6 font-semibold'>
                {admin.name}
              </span>
              <p className='font-light ml-5 text-[#4B4B4B]'>Admin</p>
            </>
          )}
          {/*               <p className="text-xl mb-2">Welcome, {admin.name}</p>
      {admin.profileImage && <p><img className="w-32 h-32 rounded-full" src={`http://localhost:7000${admin.profileImage}`} alt="Profile" /></p>}
      <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600" onClick={handleLogout}>Logout</button> */}
        </div>
      </div>

      <div className='mr-5 mt-[30px] space-y-2 text-[20px] '>
        {/* View Analytics */}
        <Link
          to='AdminDashboard/ViewAnalytics'
          className={`viewAnalytics mx-10 px-2 ${
            activeLink === "/AdminDashboard/ViewAnalytics"
              ? "font-semibold ml-[4rem] bg-gradient-to-r from-[#0BF677] to-[#079774]"
              : "hover:font-medium hover:ml-[4rem] text-white"
          }`}
          onClick={() => handleLinkClick("/AdminDashboard/ViewAnalytics")}
        >
          <img
            className='inline-block mr-2 mb-1'
            src='/src/assets/User.png'
            alt='View Analytics'
          />
          View Analytics
        </Link>

        {/* Explore Manuscript */}
        <Link
          to='AdminDashboard/ExploreManuscript'
          className={`exploreManuscript mx-10 px-2  ${
            activeLink === "/AdminDashboard/ExploreManuscript"
              ? "font-semibold ml-[4rem] bg-gradient-to-r from-[#0BF677] to-[#079774]"
              : "hover:font-medium hover:ml-[4rem] text-white"
          }`}
          onClick={() => handleLinkClick("/AdminDashboard/ExploreManuscript")}
        >
          <img
            className='inline-block mr-2 mb-1'
            src='/src/assets/explore-manuscript.png'
            alt='Explore Manuscript'
          />
          Explore Manuscript
        </Link>

          {/* Student Manuscript*/}
                <Link
          to='AdminDashboard/StudentManuscript'
          className={`myManuscript mx-10  px-2 ${
            activeLink === "/AdminDashboard/StudentManuscript"
              ? "font-semibold ml-[4rem] bg-gradient-to-r from-[#0BF677] to-[#079774]"
              : "hover:font-medium hover:ml-[4rem] text-white"
          }`}
          onClick={() => handleLinkClick("/AdminDashboard/StudentManuscript")}
        >
          <img
            className='inline-block mr-2 mb-1'
            src='/src/assets/my-manuscript.png'
            alt='My Manuscript'
          />
          Student Manuscript
        </Link>

        {/* Adviser Manuscript*/}
        <Link
          to='AdminDashboard/AdviserManuscript'
          className={`myManuscript mx-10  px-2 ${
            activeLink === "/AdminDashboard/AdviserManuscript"
              ? "font-semibold ml-[4rem] bg-gradient-to-r from-[#0BF677] to-[#079774]"
              : "hover:font-medium hover:ml-[4rem] text-white"
          }`}
          onClick={() => handleLinkClick("/AdminDashboard/AdviserManuscript")}
        >
          <img
            className='inline-block mr-2 mb-1'
            src='/src/assets/my-manuscript.png'
            alt='My Manuscript'
          />
          Adviser Manuscript
        </Link>

        <Link
          to='AdminDashboard/PanelistManuscript'
          className={`myManuscript mx-10 px-2 ${
            activeLink === "/AdminDashboard/PanelistManuscript"
              ? "font-semibold ml-[4rem] bg-gradient-to-r from-[#0BF677] to-[#079774]"
              : "hover:font-medium hover:ml-[4rem] text-white"
          }`}
          onClick={() => handleLinkClick("/AdminDashboard/PanelistManuscript")}
        >
          <img
            className='inline-block mr-2 mb-1'
            src='/src/assets/my-manuscript.png'
            alt='My Manuscript'
          />
          Panelist Manuscript
        </Link>

        
      </div>
      {/* Panelist Mode */}
      <div className='mt-[125px]  ml-[80px] '>
        <Link
          to='AdminDashboard/AdviserPending'
          className={`exploreManuscript mx-10 px-2  ${
            activeLink === "/AdminDashboard/AdviserPending"
              ? "font-semibold ml-[4rem] whitespace-nowrap"
               : "hover:font-medium hover:ml-[4rem] whitespace-nowrap"
          }`}
          onClick={() => handleLinkClick("/AdminDashboard/AdviserPending")}
        >
          <br></br>
          Pending Adviser
        </Link>

        <Link
          to='AdminDashboard/AdviserRegistered'
          className={`exploreManuscript mx-10 px-2 ${
            activeLink === "/AdminDashboard/AdviserRegistered"
              ? "font-semibold ml-[4rem]"
              : "hover:font-medium hover:ml-[4rem] text=[#0BF677]"
          }`}
          onClick={() => handleLinkClick("/AdminDashboard/AdviserRegistered")}
        >
          <br></br>
          Registered Adviser
        </Link>
      </div>

      <div className='mt-[45px]  ml-[80px] '>
        <Link
          to='AdminDashboard/StudentPending'
          className={`exploreManuscript mx-10 px-2  ${
            activeLink === "/AdminDashboard/StudentPending"
            ? "font-semibold ml-[4rem] whitespace-nowrap"
            : "hover:font-medium hover:ml-[4rem] whitespace-nowrap"
          }`}
          onClick={() => handleLinkClick("/AdminDashboard/StudentPending")}
        >
          <br></br>
          Pending Student
        </Link>

        <Link
          to='AdminDashboard/StudentRegistered'
          className={`exploreManuscript mx-10 px-2 ${
            activeLink === "/AdminDashboard/StudentRegistered"
               ? "font-semibold ml-[4rem] whitespace-nowrap"
               : "hover:font-medium hover:ml-[4rem] whitespace-nowrap"
          }`}
          onClick={() => handleLinkClick("/AdminDashboard/StudentRegistered")}
        >
          <br></br>
          Register Student
        </Link>
      </div>



      <Button
        variant="outlined"
        color=""
        sx={{
          color: 'white',
          background: '#0BF677',
          top: "40px",
          left: "30px",
          width: "250px",
          fontSize: "18px",
          fontWeight: "bold",
          textTransform: "none",
          borderRadius: "8px",
          transition: "all 0.3s ease", // Smooth transition effect for all properties
          '&:hover': {
            background: '#08D667', // Slightly darker shade
            transform: 'scale(1.05)', // Slightly enlarge the button
            boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.3)', // Add a shadow effect
          },
        }}
        
        
        onClick={openSpecializationModal}
      >
     <DeploymentUnitOutlined />  <span className="ml-2"> Manage Specialization </span> 
      </Button>

      <Modal open={isSpecializationModalOpen} onClose={() => setIsSpecializationModalOpen(false)}>
  <Box
    sx={{
      p: 4,
      color: 'white',
      bgcolor: "#1E1E1E",
      borderRadius: 3,
      maxWidth: 700,
      mx: "auto",
      mt: 6,
      boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)"
    }}
  >
    
    <Typography variant="h5" mb={3} fontWeight={800} color="#333">
      Manage Specializations 
    </Typography>

    {/* Specialization List */}
    <Box mb={3} maxHeight="500px" overflow="auto" px={1}>
      {specializations.map((spec) => (
        <Box
          key={spec._id}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1.5}
          p={2}
          borderRadius={2}
          bgcolor="#222222"
          color="white"
          boxShadow="0px 2px 5px rgba(0, 0, 0, 0.05)"
        >
          {editingId === spec._id ? (
            <Input
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              size="small"
         
              sx={{ mr: 2, color: 'white',}}
            />
          ) : (
            <Typography variant="body1" color="white">
              {spec.name}
            </Typography>
          )}
          <div>
            {editingId === spec._id ? (
              <Button
                onClick={handleEditSpecialization}
                variant="contained"
                color="primary"
                size="small"
                sx={{ mr: 1, textTransform: "none", color:'blue' }}
              >
                Save
              </Button>
            ) : (
              <Button
                onClick={() => startEditing(spec._id, spec.name)}
                variant=""
                color="primary"
                size="small"
                sx={{ mr: 1, textTransform: "none" }}
              >
                Edit
              </Button>
            )}
            <Button
              onClick={() => handleDeleteSpecialization(spec._id)}
              variant="outlined"
              color="error"
              size="small"
              sx={{ textTransform: "none", color: 'red'}}
            >
              Delete
            </Button>
          </div>
        </Box>
      ))}
    </Box>

    {/* Add New Specialization */}
    <Input
      placeholder="New Specialization"
      value={newSpecialization}
      onChange={(e) => setNewSpecialization(e.target.value)}
      fullWidth
      sx={{
        mb: 2,
        
        bgcolor: "#ffffff",
        borderRadius: 2,
        px: 2,
        py: 1.5,
        boxShadow: "inset 0px 1px 3px rgba(0, 0, 0, 0.1)"
      }}
    />
    <Button
      onClick={handleAddSpecialization}
      variant=""
      color=""
      sx={{
        marginLeft: '245px',
        background: '#0BF677',
        height: '20px',
        width: "160px",
        fontWeight: "bold",
        py: 1.5,
        textTransform: "none",
        borderRadius: 60,
        boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)"
      }}
    >
      <span className="text-[15px]">
      Add Specialization
      </span>
    
    </Button>
  </Box>
</Modal>


    </div>
  );
};

export default Sidebar;
