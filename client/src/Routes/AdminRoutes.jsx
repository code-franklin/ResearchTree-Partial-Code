import React from 'react'
import { Route, Routes, Link } from 'react-router-dom';


import ExploreManuscript from '../Dashboards/AdminDashboard/ExploreManuscript/ArticleList'
import ViewAnalytics from '../Dashboards/AdminDashboard/ViewAnalytics/Chart'
import AdviserManuscript from '../Dashboards/AdminDashboard/Publishing/Advisers'
import AdviserRegistered from '../Dashboards/AdminDashboard/ProfileManagement/AdviserRegistered'
import AdviserPending from '../Dashboards/AdminDashboard/ProfileManagement/AdviserPending'
import PanelistManuscript from '../Dashboards/AdminDashboard/Publishing/Panelist'
import Sidebar from '../Dashboards/AdminDashboard/Sidebar/sidebar'


function AdviserRoutes() {
  return (
    <>
    
      <Sidebar />
              <Routes>
                <Route path="/" element={<ViewAnalytics/>} />
                <Route path="AdminDashboard/ViewAnalytics" element={<ViewAnalytics/>} />
                <Route path="AdminDashboard/ExploreManuscript" element={<ExploreManuscript/>} />
                <Route path="AdminDashboard/AdviserManuscript" element={<AdviserManuscript/>} />
                <Route path="AdminDashboard/PanelistManuscript" element={<PanelistManuscript/>} />
                <Route path="AdminDashboard/AdviserRegistered" element={<AdviserRegistered/>} />
                <Route path="AdminDashboard/AdviserPending" element={<AdviserPending/>} />
              </Routes>
          
    </>
  )
}

export default AdviserRoutes