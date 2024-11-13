import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import Select from 'react-select';
import { TextField, MenuItem, Button, FormControl, InputLabel, Select as MUISelect } from '@mui/material';

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
    design: ''
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

  const courseOptions = [
    { value: 'BSIT', label: 'BSIT' },
    { value: 'BSCS', label: 'BSCS' },
  ];

  const designOptions = [
    { value: 'Subject Expert', label: 'Subject Expert' },
    { value: 'Statistician', label: 'Statistician' },
    { value: 'Technical Expert', label: 'Technical Expert' }
  ];

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
    <form onSubmit={handleSubmit} encType="multipart/form-data" className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="text-center mb-6">
          <img src="/src/assets/Researchtree-logo.png" alt="ResearchTree Logo" className="mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">Welcome to ResearchTree</h1>
        </div>

        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          className="mb-4"
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

            <FormControl fullWidth margin="normal" className="mb-4">
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
            </FormControl>
          </>
        )}

        {formData.role === 'adviser' && (
          <>
            <label className=" mb-2 text-gray-700">Specializations:</label>
            <Select
              isMulti
              name="specializations"
              options={specializationsOptions}
              onChange={handleSpecializationsChange}
              className="mb-4"
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
              <InputLabel>Designation</InputLabel>
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
          <p className="text-gray-600">Already have an account?</p>
          <Link to="/" className="text-blue-500 hover:underline">
            Sign In here
          </Link>
        </div>

        {message && <p className="text-center mt-4 text-green-600">{message}</p>}
      </div>
    </form>

  );
};

export default LoginFunction;
