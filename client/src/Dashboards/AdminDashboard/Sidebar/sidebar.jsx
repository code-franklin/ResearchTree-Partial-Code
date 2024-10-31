import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import UserAvatar from './Avatar';
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
  
        <img className="absolute mt-[480px] ml-[20px]" src="/src/assets/profile-management.png" alt="Logo" />
      </div>

      <div className="flex ml-[9px] ">
        <div className="myName ml-[50px] mt-[20px] p-4 text-center">
          <UserAvatar />
          {/* <span className="text-[21px] font-semibold">{user.name}</span>   I Comment muna pansamantala
          <p className="font-light text-[#4B4B4B]">{user.role}</p> */}  

        <span className="text-[21px] font-semibold">Jonardo Asor</span>
        <p className="font-light text-[#4B4B4B]">Admin</p>
        </div>
      </div>

     

      <div className="mr-5 mt-[30px] space-y-2 text-[20px] ">

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

       
        {/* Explore Manuscript */}
        <Link
          to="AdminDashboard/ExploreManuscript"
          className={`exploreManuscript mx-10 px-2  ${
            activeLink === '/AdminDashboard/ExploreManuscript'
              ? 'font-semibold ml-[4rem] bg-gradient-to-r from-[#0BF677] to-[#079774]'
              : 'hover:font-medium hover:ml-[4rem] text-white'
          }`}
          onClick={() => handleLinkClick('/AdminDashboard/ExploreManuscript')}
        >
          <img className="inline-block mr-2 mb-1" src="/src/assets/explore-manuscript.png" alt="Explore Manuscript" />
          Explore Manuscript
        </Link>

           {/* Adviser Manuscript*/}
        <Link
          to="AdminDashboard/AdviserManuscript"
          className={`myManuscript mx-10  px-2 ${
            activeLink === '/AdminDashboard/AdviserManuscript'
              ? 'font-semibold ml-[4rem] bg-gradient-to-r from-[#0BF677] to-[#079774]'
              : 'hover:font-medium hover:ml-[4rem] text-white'
          }`}
          onClick={() => handleLinkClick('/AdminDashboard/AdviserManuscript')}
        >
          <img className="inline-block mr-2 mb-1" src="/src/assets/my-manuscript.png" alt="My Manuscript" />
          Adviser Manuscript
        </Link>

        <Link
          to="AdminDashboard/PanelistManuscript"
          className={`myManuscript mx-10 px-2 ${
            activeLink === '/AdminDashboard/PanelistManuscript'
              ? 'font-semibold ml-[4rem] bg-gradient-to-r from-[#0BF677] to-[#079774]'
              : 'hover:font-medium hover:ml-[4rem] text-white'
          }`}
          onClick={() => handleLinkClick('/AdminDashboard/PanelistManuscript')}
        >
          <img className="inline-block mr-2 mb-1" src="/src/assets/my-manuscript.png" alt="My Manuscript" />
          Panelist Manuscript
        </Link>
        

       
         
          
      </div>
       {/* Panelist Mode */}
       <div className='mt-[175px]  ml-[70px] '>
          <Link
          to="AdviserDashboard/Publishing"
          className={`exploreManuscript mx-10 px-2  ${
            activeLink === '/AdviserDashboard/Publishing'
              ? 'font-semibold ml-[4rem]  '
              : 'hover:font-medium hover:ml-[4rem] '
          }`}
          onClick={() => handleLinkClick('/AdviserDashboard/Publishing')}
        >
          <br></br>
          Pending Adviser
        </Link>

        <Link
          to="AdviserDashboard/PanelistAnalytics"
          className={`exploreManuscript mx-10 px-2 ${
            activeLink === '/AdviserDashboard/PanelistAnalytics'
              ? 'font-semibold ml-[4rem]'
              : 'hover:font-medium hover:ml-[4rem] text=[#0BF677]'
          }`}
          onClick={() => handleLinkClick('/AdviserDashboard/PanelistAnalytics')}
        >
        <br></br>
          Registered Adviser
        </Link>
          </div>
    </div>
  );
};

export default Sidebar;
