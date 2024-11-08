import React, { useEffect, useState } from "react";
import { Avatar, ConfigProvider } from "antd";
import axios from "axios";
import { Button } from "@mui/material";
import Tables from "./Tables";

const App = () => {
  const [selectedAdviser, setSelectedAdviser] = useState(null);
  const [advicerData, setAdvicersData] = useState([]);
  const [selectedPanelistStudents, setSelectedPanelistStudents] = useState([]);

  const handleAdviserClick = (advicer) => {
    setSelectedAdviser(advicer.name);
    setSelectedPanelistStudents(advicer.students); 
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
      <div className='flex items-center justify-center w-full h-screen pl-96 px-6 overflow-x-auto'>
        {!selectedAdviser ? (
          <table className='min-w-full divide-y-2 divide-gray-200 bg-transparent text-sm'>
            <thead className='ltr:text-left rtl:text-right'>
              <tr>
                <th className='whitespace-nowrap px-4 py-2  text-white font-bold text-2xl'>
                  Name
                </th>
                <th className='whitespace-nowrap px-4 py-2  text-white font-bold text-2xl'>
                  Role
                </th>
                <th className='whitespace-nowrap px-4 py-2  text-white font-bold text-2xl'>
                  Actions
                </th>
              </tr>
            </thead>
            {advicerData &&
              advicerData.length > 0 &&
              advicerData.map((advicer) => (
                <tbody key={advicer.name} className='divide-y divide-gray-200'>
                  <tr>
                    <td className='whitespace-nowrap text-center px-4 py-3 font-medium text-white'>
                      <div className=''>
                        <Avatar
                          src={advicer.profileImage}
                          sx={{ width: 79, height: 79 }}
                        />
                      </div>
                      <p className='text-xl'>{advicer.name}</p>
                    </td>
                    <td className='whitespace-nowrap text-center  px-4 py-2 text-gray-700'>
                      <span className='whitespace-nowrap rounded-full bg-lime-100 px-2.5 py-0.5 text-sm text-lime-700'>
                        Panelists
                      </span>
                    </td>
                    <td className='whitespace-nowrap text-center  px-4 py-2'>
                      <Button
                        variant='contained'
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
            students={selectedPanelistStudents}
          />
        )}
      </div>
    </ConfigProvider>
  );
};

export default App;