import React, { useState, useEffect } from 'react';
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
    course: '', // For student course
    year: '', // For student year
    handleNumber: '', // For adviser handle number
    groupMembers: [] // New field for group members
  });
  const [specializationsOptions, setSpecializationsOptions] = useState([]);
  const [message, setMessage] = useState('');

  // Generate years from 1900 to 2100
  const startYear = 2000;
  const endYear = 2100;
  const yearOptions = Array.from({ length: endYear - startYear + 1 }, (_, i) => ({
    value: startYear + i,
    label: startYear + i,
  }));

  const courseOptions = [
    { value: 'BSIT', label: 'BSIT' },
    { value: 'BSCS', label: 'BSCS' },
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

    try {
      const response = await axios.post('http://localhost:7000/api/advicer/register', data);
      setMessage(response.data.message);
    } catch (error) {
      console.error(error.response.data);
      setMessage('Registration failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <section className="bg-white">
  <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
    <aside className="relative block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6">
      <img
        alt=""
       src="/src/assets/login-bg.png"
        className="absolute inset-0 h-full w-full object-cover"
      />
    </aside>

    <main
      className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6"
    >
      <div className="max-w-xl lg:max-w-3xl">
        <a className="block text-blue-600" href="#">
          <span className="sr-only">Home</span>
          <img
        alt=""
       src="/src/assets/Researchtree-logo.png"
       className="absolute mt-[-65px] ml-[-20px]"
      />
        </a>

        <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
          Welcome to ResearchTree 
        </h1>

        <p className="mt-4 leading-relaxed text-gray-500">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eligendi nam dolorum aliquam,
          quibusdam aperiam voluptatum.
        </p>

        <TextField
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Group Members (comma-separated)"
        name="groupMembers"
        value={formData.groupMembers}
        onChange={handleGroupMembersChange}
        fullWidth
        margin="normal"
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
      />
      <FormControl fullWidth margin="normal">
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
          <FormControl fullWidth margin="normal">
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
          <FormControl fullWidth margin="normal">
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
          <label>Specializations:</label>
          <Select
            isMulti
            name="specializations"
            options={specializationsOptions}
            onChange={handleSpecializationsChange}
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
          />
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
      />
      
      <Button type="submit" variant="contained" color="success" fullWidth>
        Register
      </Button>
      {message && <p>{message}</p>}
      </div>
    </main>
  </div>
</section>

    </form>
  );
};

export default LoginFunction;
