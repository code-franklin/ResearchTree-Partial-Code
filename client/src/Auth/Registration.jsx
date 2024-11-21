import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import Select from 'react-select';
import { TextField, MenuItem, Button, FormControl, InputLabel, Select as MUISelect } from '@mui/material';

// Define constants at the top of the file
const courseOptions = [
  { value: 'BSIT', label: 'BSIT' },
  { value: 'BSCS', label: 'BSCS' },
];

const designOptions = [
  { value: 'Subject Expert', label: 'Subject Expert' },
  { value: 'Statistician', label: 'Statistician' },
  { value: 'Technical Expert', label: 'Technical Expert' }
];

const LoginFunction = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    profileImage: null,
    specializations: [],
    course: '', 
    year: '', 
    handleNumber: '', 
    groupMembers: [],
    design: designOptions[0].value // Initialize design with a default value
  });
  const [specializationsOptions, setSpecializationsOptions] = useState([]);
  const [message, setMessage] = useState('');

  // Generate years from 1900 to 2100
  const startYear = 2024;
  const endYear = 2100;
  const yearOptions = Array.from({ length: endYear - startYear + 1 }, (_, i) => ({
    value: startYear + i,
    label: startYear + i,
  }));

  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const response = await axios.get('http://localhost:7000/api/advicer/specializations');
        setSpecializationsOptions(response.data.map(spec => ({ value: spec.name, label: spec.name })));
      } catch (error) {
        console.error('Error fetching specializations:', error);
      }
    };

    fetchSpecializations();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const handleFileChange = (e) => {
    setFormData({ ...formData, profileImage: e.target.files[0] });
  };

  const handleSpecializationsChange = (selectedOptions) => {
    setFormData({ ...formData, specializations: selectedOptions.map(option => option.value) });
  };

  const handleGroupMembersChange = (e) => {
    setFormData({ ...formData, groupMembers: e.target.value.split(',').map(member => member.trim()) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('password', formData.password);
    data.append('role', formData.role);
    data.append('profileImage', formData.profileImage);
    data.append('specializations', JSON.stringify(formData.specializations));
    data.append('course', formData.course);
    data.append('year', formData.year);
    data.append('handleNumber', formData.handleNumber);
    data.append('groupMembers', JSON.stringify(formData.groupMembers)); // Add group members
    data.append('design', formData.design); // Send design data

    try {
      const response = await axios.post('http://localhost:7000/api/advicer/register', data);
      setMessage(response.data.message);
    } catch (error) {
      console.error(error.response.data);
      setMessage('User already exists!".');
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data" className="flex justify-center items-center bg-[#1E1E1E]">
      <div className="bg-white p-8 shadow-lg w-[500px] h-[790px] mt-[100px] ml-[-680px] rounded-tl-[20px] rounded-bl-[20px]">
      <Link to="/" className="absolute ml-[-140px] mt-[-40px]">
          <img className="inline-block mb-1" src="/src/assets/back-icon.png" />
      </Link>
      {message && <p className="absolute text-[18px] text-center mt-[-80px] ml-[380px] text-green-600">  <img className="inline-block mb-1" src="/src/assets/check-icon.png" />{message}</p>}
      <img
        className="absolute ml-[469px] h-[789px] w-[700px] mt-[-31px] rounded-tr-[20px] rounded-br-[20px]"
        src="./src/assets/registration.gif"
        alt="Background"
      />

          {/* <img
            className="absolute ml-[470px]rounded-tr-[20px] rounded-br-[20px]"
            src="./src/assets/student-register.png"
            alt="Background"
          /> */}

        {/* <div className="text-center mb-6">
          <img src="/src/assets/Researchtree-logo.png" alt="ResearchTree Logo" className="mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">Welcome to ResearchTree</h1>
        </div> */}

        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          className="mb-4"
          style={{marginTop: '30px'}}
        />

        <TextField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          type="email"
          fullWidth
          margin="normal"
          required
          className="mb-4"
        />

        <TextField
          label="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          type="password"
          fullWidth
          margin="normal"
          required
          className="mb-4"
        />

        <FormControl fullWidth margin="normal" className="mb-4">
          <InputLabel>Role</InputLabel>
          <MUISelect
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <MenuItem value="student">Student</MenuItem>
            <MenuItem value="adviser">Adviser</MenuItem>
          </MUISelect>
        </FormControl>

        {formData.role === 'student' && (
          <>
        
            <TextField
              label="Group Members (comma-separated)"
              name="groupMembers"
              value={formData.groupMembers}
              onChange={handleGroupMembersChange}
              fullWidth
              margin="normal"
              className="mb-4"
            />

            <FormControl fullWidth margin="normal" className="mb-4">
              <InputLabel>Course</InputLabel>
              <MUISelect
                name="course"
                value={formData.course || ''}
                onChange={handleChange}
                required
              >
                {courseOptions.map((course) => (
                  <MenuItem key={course.value} value={course.value}>
                    {course.label}
                  </MenuItem>
                ))}
              </MUISelect>
            </FormControl>

            {/* <FormControl fullWidth margin="normal" className="mb-4">
              <InputLabel>Year</InputLabel>
              <MUISelect
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
              >
                {yearOptions.map((year) => (
                  <MenuItem key={year.value} value={year.value}>{year.label}</MenuItem>
                ))}
              </MUISelect>
            </FormControl> */}
          </>
        )}

        {formData.role === 'adviser' && (

          <>
             {/* <img
            className="absolute ml-[470px]rounded-tr-[20px] rounded-br-[20px]"
            src="./src/assets/student-register.png"
            alt="Background"
          /> */}
            <label className=" mb-12 text-gray-700">Specializations:</label>
            <Select
              isMulti
              name="specializations"
              options={specializationsOptions}
              onChange={handleSpecializationsChange}
              styles={{
              
                control: (provided) => ({
                  ...provided,
                  backgroundColor: 'white',  // Set the background color here
                  color: 'white',  // Optional: set text color to white
                }),
                option: (provided) => ({
                  ...provided,
                  backgroundColor: '#222222', // Set background color for options as well
                  color: 'white', // Optional: set text color for options
                }),
                menu: (provided) => ({
                  ...provided,
                  backgroundColor: 'white', // Set background color for the dropdown menu
                }),
              }}
            />
            <TextField
              label="Handle Number (No. of Advisees)"
              name="handleNumber"
              value={formData.handleNumber}
              onChange={handleChange}
              type="number"
              fullWidth
              margin="normal"
              required
              className="mb-4"
              
            />
            {/* Add Design Dropdown */}
            <FormControl fullWidth margin="normal" className="mb-4">
              <InputLabel>Panelist Role</InputLabel>
              <MUISelect
                name="design"
                value={formData.design}
                onChange={handleChange}
                required
              >
                {designOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                ))}
              </MUISelect>
            </FormControl>
          </>
        )}

        <TextField
          label="Profile Image"
          name="profileImage"
          type="file"
          onChange={handleFileChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          className="mb-4"
        />

        <Button type="submit" variant="contained" color="success" fullWidth className="mb-4">
          Register
        </Button>

        <div className="text-center mt-4">
         
          
        </div>

    
      </div>
    </form>

  );
};

export default LoginFunction;
