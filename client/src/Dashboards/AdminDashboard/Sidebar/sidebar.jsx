import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import UserAvatar from "./Avatar";
import "./Sidebar.css";

const Sidebar = ({ onSelect }) => {
  const location = useLocation();
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    // Fetch stored user data from localStorage and set it to the admin state
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setAdmin(JSON.parse(storedUser));
    }
  }, []);

  const [activeLink, setActiveLink] = useState(location.pathname);

  const handleLinkClick = (path) => {
    setActiveLink(path);
  };

  return (
    <div className='sidebar z-1 h-screen w-[313px] bg-[#1E1E1E] text-white flex flex-col fixed'>
      <div>
        <img src='/src/assets/rstreelogo.png' alt='Logo' />

        <img
          className='absolute mt-[630px] ml-[20px]'
          src='/src/assets/ListStudent.png'
          alt='Logo'
        />
        <img
          className='absolute mt-[480px] ml-[20px]'
          src='/src/assets/profile-management.png'
          alt='Logo'
        />
      </div>

      <div className='flex ml-[9px] '>
        <div className='myName ml-[50px] mt-[20px] p-4 text-center'>
          <UserAvatar />
          {/* <span className="text-[21px] font-semibold">{user.name}</span>   I Comment muna pansamantala
          <p className="font-light text-[#4B4B4B]">{user.role}</p> */}

          {admin && (
            <>
              <span className='text-[21px] ml-6 font-semibold'>
                {admin.name}
              </span>
              <p className='font-light ml-5 text-[#4B4B4B]'>Admin</p>
            </>
          )}
          {/*               <p className="text-xl mb-2">Welcome, {admin.name}</p>
      {admin.profileImage && <p><img className="w-32 h-32 rounded-full" src={`http://localhost:7000${admin.profileImage}`} alt="Profile" /></p>}
      <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600" onClick={handleLogout}>Logout</button> */}
        </div>
      </div>

      <div className='mr-5 mt-[30px] space-y-2 text-[20px] '>
        {/* View Analytics */}
        <Link
          to='AdminDashboard/ViewAnalytics'
          className={`viewAnalytics mx-10 px-2 ${
            activeLink === "/AdminDashboard/ViewAnalytics"
              ? "font-semibold ml-[4rem] bg-gradient-to-r from-[#0BF677] to-[#079774]"
              : "hover:font-medium hover:ml-[4rem] text-white"
          }`}
          onClick={() => handleLinkClick("/AdminDashboard/ViewAnalytics")}
        >
          <img
            className='inline-block mr-2 mb-1'
            src='/src/assets/User.png'
            alt='View Analytics'
          />
          View Analytics
        </Link>

        {/* Explore Manuscript */}
        <Link
          to='AdminDashboard/ExploreManuscript'
          className={`exploreManuscript mx-10 px-2  ${
            activeLink === "/AdminDashboard/ExploreManuscript"
              ? "font-semibold ml-[4rem] bg-gradient-to-r from-[#0BF677] to-[#079774]"
              : "hover:font-medium hover:ml-[4rem] text-white"
          }`}
          onClick={() => handleLinkClick("/AdminDashboard/ExploreManuscript")}
        >
          <img
            className='inline-block mr-2 mb-1'
            src='/src/assets/explore-manuscript.png'
            alt='Explore Manuscript'
          />
          Explore Manuscript
        </Link>

        {/* Adviser Manuscript*/}
        <Link
          to='AdminDashboard/AdviserManuscript'
          className={`myManuscript mx-10  px-2 ${
            activeLink === "/AdminDashboard/AdviserManuscript"
              ? "font-semibold ml-[4rem] bg-gradient-to-r from-[#0BF677] to-[#079774]"
              : "hover:font-medium hover:ml-[4rem] text-white"
          }`}
          onClick={() => handleLinkClick("/AdminDashboard/AdviserManuscript")}
        >
          <img
            className='inline-block mr-2 mb-1'
            src='/src/assets/my-manuscript.png'
            alt='My Manuscript'
          />
          Adviser Manuscript
        </Link>

        <Link
          to='AdminDashboard/PanelistManuscript'
          className={`myManuscript mx-10 px-2 ${
            activeLink === "/AdminDashboard/PanelistManuscript"
              ? "font-semibold ml-[4rem] bg-gradient-to-r from-[#0BF677] to-[#079774]"
              : "hover:font-medium hover:ml-[4rem] text-white"
          }`}
          onClick={() => handleLinkClick("/AdminDashboard/PanelistManuscript")}
        >
          <img
            className='inline-block mr-2 mb-1'
            src='/src/assets/my-manuscript.png'
            alt='My Manuscript'
          />
          Panelist Manuscript
        </Link>
      </div>
      {/* Panelist Mode */}
      <div className='mt-[175px]  ml-[70px] '>
        <Link
          to='AdminDashboard/AdviserPending'
          className={`exploreManuscript mx-10 px-2  ${
            activeLink === "/AdminDashboard/AdviserPending"
              ? "font-semibold ml-[4rem]  "
              : "hover:font-medium hover:ml-[4rem] "
          }`}
          onClick={() => handleLinkClick("/AdminDashboard/AdviserPending")}
        >
          <br></br>
          Pending Adviser
        </Link>

        <Link
          to='AdminDashboard/AdviserRegistered'
          className={`exploreManuscript mx-10 px-2 ${
            activeLink === "/AdminDashboard/AdviserRegistered"
              ? "font-semibold ml-[4rem]"
              : "hover:font-medium hover:ml-[4rem] text=[#0BF677]"
          }`}
          onClick={() => handleLinkClick("/AdminDashboard/AdviserRegistered")}
        >
          <br></br>
          Registered Adviser
        </Link>
      </div>

      <div className='mt-[45px]  ml-[70px] '>
        <Link
          to='AdminDashboard/StudentPending'
          className={`exploreManuscript mx-10 px-2  ${
            activeLink === "/AdminDashboard/StudentPending"
              ? "font-semibold ml-[4rem]  "
              : "hover:font-medium hover:ml-[4rem] "
          }`}
          onClick={() => handleLinkClick("/AdminDashboard/StudentPending")}
        >
          <br></br>
          Pending Student
        </Link>

        <Link
          to='AdminDashboard/StudentRegistered'
          className={`exploreManuscript mx-10 px-2  ${
            activeLink === "/AdminDashboard/StudentRegistered"
              ? "font-semibold ml-[4rem]  "
              : "hover:font-medium hover:ml-[4rem] "
          }`}
          onClick={() => handleLinkClick("/AdminDashboard/StudentRegistered")}
        >
          <br></br>
          Register Student
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
