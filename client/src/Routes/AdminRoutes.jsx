import React from 'react'
import { Route, Routes, Link } from 'react-router-dom';


import ExploreManuscript from '../Dashboards/AdminDashboard/ExploreManuscript/ArticleList'
import ViewAnalytics from '../Dashboards/AdminDashboard/ViewAnalytics/Chart'
import AdviserManuscript from '../Dashboards/AdminDashboard/Publishing/Advisers'

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
      
              </Routes>
          
    </>
  )
}

export default AdviserRoutes