import React, { useEffect, useState } from "react";
import { Avatar, ConfigProvider } from "antd";
import axios from "axios";
import { Button } from "@mui/material";
import Tables from "./Tables";

const App = () => {
  const [selectedAdviser, setSelectedAdviser] = useState(null);
  const [selectedAdviserProfile, setSelectedAdviseProfile] = useState(null);
  const [advicerData, setAdvicersData] = useState([]);
  const [selectedAdvicerStudents, setSelectedAdvicerStudents] = useState([]);
  
  const [admin, setAdmin] = useState(null);

  // Fetch admin data from localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setAdmin(JSON.parse(storedUser));
    }
  }, []);

  const handleAdviserClick = (advicer) => {
    setSelectedAdviser(advicer.name);
    setSelectedAdviseProfile(advicer.profileImage);
    setSelectedAdvicerStudents(advicer.students); 
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        "http://localhost:7000/api/admin/advicer/handle/manuscript"
      );
      const data = response.data;
      setAdvicersData(data.advisers);
    };
    fetchData();
  }, []);

  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            colorBgContainer: "#222222",
            borderRadius: 10,
            colorText: "white",
            colorTextHeading: "white",
            fontSize: "25px",
          },
        },
      }}
    >
      <div className='flex items-center justify-center h-[900px] ml-[120px] w-[1500px] pl-96 px-6 overflow-x-auto'>
        {!selectedAdviser ? (
          <table className='w-[1000px] divide-y-2 divide-gray-200 text-sm'>
            <thead className='ltr:text-left rtl:text-right'>
              <tr>
                <th className='whitespace-nowrap px-4 py-2  text-white font-bold text-2xl'>
                
                </th>
                <th className='whitespace-nowrap px-4 py-2  text-white font-bold text-2xl'>
                 
                </th>
                <th className='whitespace-nowrap px-4 py-2  text-white font-bold text-2xl'>
                 
                </th>
              </tr>
            </thead>
            {advicerData &&
              advicerData.length > 0 &&
              advicerData.map((advicer) => (
                <tbody key={advicer.name} className=' divide-y divide-gray-200'>
                  <tr>
                    <td className='flex whitespace-nowrap text-center px-4 py-3 font-medium text-white '>
                      <div className="transition-transform duration-300 ease-in-out transform hover:scale-110">
                        <Avatar
                          src={`http://localhost:7000/public/uploads/${
                            advicer.profileImage || "default-avatar.png"}`}
                          sx={{ width: 79, height: 79 }}
                          className="opacity-0 transition-opacity duration-500 ease-in-out"
                          onLoad={(e) => (e.currentTarget.style.opacity = 1)}
                        />
                      </div>
                      <p className='text-xl ml-[10px]'>{advicer.name}</p>
                    </td>
                    <td className='whitespace-nowrap text-center  px-4 py-2 text-gray-700'>
                      <span className='whitespace-nowrap rounded-full bg-[blue] px-2.5 py-0.5 text-sm text-white'>
                      {advicer.role}
                      </span>
                    </td>
                    <td className='whitespace-nowrap text-center  px-4 py-2'>
                      <Button
                        variant='contained'
                        color="success"
                        onClick={() => handleAdviserClick(advicer)}
                      >
                        View Advisees
                      </Button>
                    </td>
                  </tr>
                </tbody>
              ))}
          </table>
        ) : (
        <Tables
          adviserName={selectedAdviser}
          adviserImage={selectedAdviserProfile}
          students={selectedAdvicerStudents}
        />

        )}
      </div>
    </ConfigProvider>
  );
};

export default App;