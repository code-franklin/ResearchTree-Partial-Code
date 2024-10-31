import React from 'react';
import './App.css';

import { ThemeProvider, createTheme } from "@mui/material/styles"
import { Container, CssBaseline } from "@mui/material";

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './Auth/Login'
import Register from './Auth/Registration'


import StudentRoutes from './Routes/StudentRoutes';
import AdviserRoutes from './Routes/AdviserRoutes';
import AdminRoutes from './Routes/AdminRoutes';



function App() {

  
  return (
    <div className="App">
      <Router>
           
        <Routes>

          <Route path="/" element={<Login/>} />
          <Route path="/Register" element={<Register/>} />

          <Route path="/StudentDashboard/*" element={<StudentRoutes/>} />
          <Route path="/AdviserDashboard/*" element={<AdviserRoutes/>} />
          <Route path="/AdminDashboard/*" element={<AdminRoutes/>} />
          


        </Routes>
    </Router>
    </div>
  );
}


export default App;