// src/Sidebar.js
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import UserAvatar from './Avatar';
import HeaderTools from './TitleProposals';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation(); // Get current location
  const user = JSON.parse(localStorage.getItem('user'));

  // Determine the current path to set the active link
  const [activeLink, setActiveLink] = useState(location.pathname);

  // Function to handle the active link
  const handleLinkClick = (path) => {
    setActiveLink(path); // Set the active link when clicked
  };

  return (
    <div className="sidebar z-1 h-screen w-[313px] bg-[#1E1E1E] text-white flex flex-col fixed">
      <div>
        <img className="" src="/src/assets/rstreelogo.png" />
      </div>

      <div className="max-w-xs mx-auto p-4 flex flex-col items-center mt-5">
      {/* Avatar */}
     
      <UserAvatar />

      {/* Name */}
      <h2 className="myName text-[21px] font-bold text-white text-center">{user.name}</h2>

      {/* Role */}
      <p className="text-gray-600 text-center">{user.role}</p>
    </div>
      
      {/* <div className='flex ml-[9px]'>
        <div className="myName ml-[50px] mt-[20px] p-4 text-center">
          <UserAvatar />
          <span className="text-[21px] font-semibold ml-2">{user.name}</span>
          <p className="font-light text-[#4B4B4B]">{user.role}</p>
        </div>
      </div>
       */}
      <div className="mr-5 mt-[30px] space-y-2 text-[20px]">
        {/* My Manuscript */}
        <Link
          to="StudentDashboard/MyManuscript"
          className={`myManuscript mx-10 whitespace-nowrap px-2 ${
            activeLink === '/StudentDashboard/MyManuscript'
              ? 'font-semibold ml-[4rem] bg-gradient-to-r from-[#0BF677] to-[#079774]'
              : 'hover:font-medium hover:ml-[4rem] text-white'
          }`}
          onClick={() => handleLinkClick('/StudentDashboard/MyManuscript')}
        >
          <img className="inline-block mr-2 mb-1" src="/src/assets/my-manuscript.png" alt="My Manuscript" />
          My Manuscript
        </Link>

        {/* Explore Manuscript */}
        <Link
          to="StudentDashboard/ExploreManuscript"
          className={`exploreManuscript mx-10 px-2 ${
            activeLink === '/StudentDashboard/ExploreManuscript'
              ? 'font-semibold ml-[4rem] bg-gradient-to-r from-[#0BF677] to-[#079774]'
              : 'hover:font-medium hover:ml-[4rem] text-white'
          }`}
          onClick={() => handleLinkClick('/StudentDashboard/ExploreManuscript')}
        >
          <img className="inline-block mr-2 mb-1" src="/src/assets/explore-manuscript.png" alt="Explore Manuscript" />
          Explore Manuscript
        </Link>

        {/* View Analytics */}
        <Link
          to="StudentDashboard/ViewAnalytics"
          className={`viewAnalytics mx-10 px-2 ${
            activeLink === '/StudentDashboard/ViewAnalytics'
              ? 'font-semibold ml-[4rem] bg-gradient-to-r from-[#0BF677] to-[#079774]'
              : 'hover:font-medium hover:ml-[4rem] text-white'
          }`}
          onClick={() => handleLinkClick('/StudentDashboard/ViewAnalytics')}
        >
          <img className="inline-block mr-2 mb-1" src="/src/assets/User.png" alt="View Analytics" />
          View Analytics
        </Link>

      

      
      </div>

      <HeaderTools />
    </div>
  );
};

export default Sidebar;
