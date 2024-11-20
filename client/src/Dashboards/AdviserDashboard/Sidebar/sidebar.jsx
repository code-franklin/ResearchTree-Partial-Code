import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import UserAvatar from './Avatar';
import PDFUploader from './PDFUploader'
import './Sidebar.css';

const Sidebar = ({ onSelect }) => {
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
        <img src="/src/assets/rstreelogo.png" alt="Logo" />
        <img className="absolute mt-[210px] ml-[20px]" src="/src/assets/adviser-side.png" alt="Logo" />
        <img className="absolute mt-[480px] ml-[20px]" src="/src/assets/panelist-side.png" alt="Logo" />
      </div>

      
        <div className="max-w-xs mx-auto p-4 flex flex-col items-center mt-5">
          <UserAvatar />
          <span className="myName text-[21px] font-bold text-white text-center">{user.name}</span>
          <p className="text-gray-600 text-center">{user.role}</p>
        </div>
      

     

      <div className="mr-5 mt-[60px] space-y-2 text-[15px] ml-[12px]">
        {/* My Advisee */}
        <Link
          to="AdviserDashboard/MyAdvisee"
          className={`myManuscript mx-10 whitespace-nowrap px-2 ${
            activeLink === '/AdviserDashboard/MyAdvisee'
              ? 'font-semibold ml-[4rem] bg-gradient-to-r from-[#0BF677] to-[#079774]'
              : 'hover:font-medium hover:ml-[4rem] text-white'
          }`}
          onClick={() => handleLinkClick('/AdviserDashboard/MyAdvisee')}
        >
          <img className="inline-block mr-2 mb-1" src="/src/assets/my-manuscript.png" alt="My Manuscript" />
          My Advisee
        </Link>

      

        {/* Explore Manuscript */}
        <Link
          to="AdviserDashboard/ExploreManuscript"
          className={`exploreManuscript mx-10 px-2 ${
            activeLink === '/AdviserDashboard/ExploreManuscript'
              ? 'font-semibold ml-[4rem] bg-gradient-to-r from-[#0BF677] to-[#079774]'
              : 'hover:font-medium hover:ml-[4rem] text-white'
          }`}
          onClick={() => handleLinkClick('/AdviserDashboard/ExploreManuscript')}
        >
          <img className="inline-block mr-2 mb-1" src="/src/assets/explore-manuscript.png" alt="Explore Manuscript" />
          Explore Manuscript
        </Link>
        

        {/* View Analytics */}
        <Link
          to="AdviserDashboard/ViewAnalytics"
          className={`viewAnalytics mx-10 px-2 ${
            activeLink === '/AdviserDashboard/ViewAnalytics'
              ? 'font-semibold ml-[4rem] bg-gradient-to-r from-[#0BF677] to-[#079774]'
              : 'hover:font-medium hover:ml-[4rem] text-white'
          }`}
          onClick={() => handleLinkClick('/AdviserDashboard/ViewAnalytics')}
        >
          <img className="inline-block mr-2 mb-1" src="/src/assets/User.png" alt="View Analytics" />
          View Analytics
        </Link>

        {/* Title Proposal */}
        <Link
          to="AdviserDashboard/TitleProposal"
          className={`revision mx-10 px-2 ${
            activeLink === '/AdviserDashboard/TitleProposal'
              ? 'font-semibold ml-[4rem] bg-gradient-to-r from-[#0BF677] to-[#079774]'
              : 'hover:font-medium hover:ml-[4rem] text-white'
          }`}
          onClick={() => handleLinkClick('/AdviserDashboard/TitleProposal')}
        >
          <img className="inline-block mr-2 mb-1" src="/src/assets/revision-icon.png" alt="Title Proposal" />
          Title Proposal
        </Link>

        {/* Grading */}
        {/* <Link
          to="AdviserDashboard/Grading"
          className={`revision mx-10 px-2 ${
            activeLink === '/AdviserDashboard/Grading'
              ? 'font-semibold ml-[4rem] bg-gradient-to-r from-[#0BF677] to-[#079774]'
              : 'hover:font-medium hover:ml-[4rem] text-white'
          }`}
          onClick={() => handleLinkClick('/AdviserDashboard/Grading')}
        >
          <img className="inline-block mr-2 mb-1" src="/src/assets/revision-icon.png" alt="Grading" />
          Grading
        </Link> */}

         
          
      </div>
       {/* Panelist Mode */}
       <div className='mt-[155px]  ml-[12px]'>
          <Link
          to="AdviserDashboard/Publishing"
          className={`exploreManuscript mx-10 px-2 ${
            activeLink === '/AdviserDashboard/Publishing'
              ? 'font-semibold ml-[4rem] bg-gradient-to-r from-[#0BF677] to-[#079774]'
              : 'hover:font-medium hover:ml-[4rem] text-white'
          }`}
          onClick={() => handleLinkClick('/AdviserDashboard/Publishing')}
        >
          <img className="inline-block mr-2 mb-1" src="/src/assets/my-manuscript.png" alt="Panelist Group" />
          My Defendee
        </Link>

            <PDFUploader/>
          </div>
    </div>
  );
};

export default Sidebar;
