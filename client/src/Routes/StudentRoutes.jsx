import React from 'react';
import { Route, Routes } from 'react-router-dom';

import MyManuscript from '../Dashboards/StudentDashboard/MyManuscript/MyManuscriptComponent';
import ExploreManuscript from '../Dashboards/StudentDashboard/ExploreManuscript/SearchArticles';
import ViewAnalytics from '../Dashboards/StudentDashboard/ViewAnalytics/ViewAnalyticsComponent';



import TitleProposal from '../Components/Sidebar/TitleProposals'
import Sidebar from '../Components/Sidebar/sidebar';
import UnauthorizedAccess from './UnauthorizedAccess'; // Import the UnauthorizedAccess component
import Grading from '../Dashboards/StudentDashboard/MyManuscript/Grading'
function StudentRoutes() {
  const user = JSON.parse(localStorage.getItem('user'));

  if (user.role !== 'student') {
    // Display a more polished unauthorized access component
    return <UnauthorizedAccess />;
  }

  return (
    <>
      <Sidebar />
      <Routes>
        <Route path="/" element={<ViewAnalytics />} />
        <Route path="StudentDashboard/MyManuscript" element={<MyManuscript />} />
        <Route path="StudentDashboard/Grading" element={<Grading />} />


        <Route path="StudentDashboard/TitleProposal" element={<TitleProposal />} />

        <Route path="StudentDashboard/ExploreManuscript" element={<ExploreManuscript />} />
        <Route path="StudentDashboard/ViewAnalytics" element={<ViewAnalytics />} />
     
      </Routes>
    </>
  );
}

export default StudentRoutes;
