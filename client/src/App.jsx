import React from 'react';
import './App.css';
import { useEffect, useState } from 'react';

import { ThemeProvider, createTheme } from "@mui/material/styles"
import { Container, CssBaseline } from "@mui/material";

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// User Login and Admin
import Login from './Auth/Login'
import Register from './Auth/Registration'
import LoginAdmin from './Auth/LoginAdmin'

// Dashboards
import StudentRoutes from './Routes/StudentRoutes';
import AdviserRoutes from './Routes/AdviserRoutes';
import AdminRoutes from './Routes/AdminRoutes';

// 


import TestComponent from '../../client/src/Dashboards/StudentDashboard/ViewAnalytics/testing';



function App() {

  const [token, setToken] = useState(localStorage.getItem('token'));

  const saveToken = (userToken) => {
    localStorage.setItem('token', userToken);
    setToken(userToken);
  };
  
  return (
    <div className="App">
      <Router>
           
        <Routes>

          {/* Student and Advicer */}
          <Route path="/" element={<Login/>} />
          <Route path="/Register" element={<Register/>} />



          <Route path="/Testing" element={<TestComponent />} />


          <Route path="/StudentDashboard/*" element={<StudentRoutes/>} />
          <Route path="/AdviserDashboard/*" element={<AdviserRoutes/>} />

          {/* Admin */}
          <Route path="/adminSignIn" element={<LoginAdmin setToken={saveToken} />} />
          <Route path="/AdminDashboard/*" element={token ? <AdminRoutes /> : <LoginAdmin setToken={saveToken} />} />
          

          


        </Routes>
    </Router>
    </div>
  );
}


export default App;