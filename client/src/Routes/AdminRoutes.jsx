import React from 'react'
import { Route, Routes, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

import ExploreManuscript from '../Dashboards/AdminDashboard/ExploreManuscript/SearchArticles'
import ViewAnalytics from '../Dashboards/AdminDashboard/ViewAnalytics/Chart'

import StudentManuscript from '../Dashboards/AdminDashboard/Publishing/TablesStudent'
import AdviserManuscript from '../Dashboards/AdminDashboard/Publishing/Advisers'
import PanelistManuscript from '../Dashboards/AdminDashboard/Publishing/Panelist'

import AdviserRegistered from '../Dashboards/AdminDashboard/ProfileManagement/AdviserRegistered'
import AdviserPending from '../Dashboards/AdminDashboard/ProfileManagement/AdviserPending'
import StudentRegistered from '../Dashboards/AdminDashboard/ProfileManagement/StudentRegistered'
import StudentPending from '../Dashboards/AdminDashboard/ProfileManagement/StudentPending'

import Sidebar from '../Dashboards/AdminDashboard/Sidebar/sidebar'
import UnauthorizedAccess from './UnauthorizedAccess'; // Import the UnauthorizedAccess component


function AdviserRoutes() {

  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    // Fetch stored user data from localStorage and set it to the admin state
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setAdmin(JSON.parse(storedUser));
    }
  }, []);

  // If no admin is found, render UnauthorizedAccess
  if (!admin) {
    console.log('Admin already Login: ', admin)
  }

  return (
    <>
    
      <Sidebar />
              <Routes>
                <Route path="/" element={<ViewAnalytics/>} />
                <Route path="AdminDashboard/ViewAnalytics" element={<ViewAnalytics/>} />
                <Route path="AdminDashboard/ExploreManuscript" element={<ExploreManuscript/>} />
                <Route path="AdminDashboard/StudentManuscript" element={<StudentManuscript/>} />
                <Route path="AdminDashboard/AdviserManuscript" element={<AdviserManuscript/>} />
                <Route path="AdminDashboard/PanelistManuscript" element={<PanelistManuscript/>} />
                <Route path="AdminDashboard/AdviserRegistered" element={<AdviserRegistered/>} />
                <Route path="AdminDashboard/AdviserPending" element={<AdviserPending/>} />
                <Route path="AdminDashboard/StudentRegistered" element={<StudentRegistered/>} />
                <Route path="AdminDashboard/StudentPending" element={<StudentPending/>} />

           

              </Routes>
          
    </>
  )
}

export default AdviserRoutes