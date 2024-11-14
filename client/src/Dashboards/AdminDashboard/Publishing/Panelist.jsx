import React, { useEffect, useState } from "react";
import { Avatar, ConfigProvider } from "antd";
import axios from "axios";
import { Button } from "@mui/material";
import TablesPanel from "./TablesPanel";

const App = () => {
  const [selectedPanel, setSelectedPanel] = useState(null);
  const [selectedPanelProfile, setSelectedPanelProfile] = useState(null);
  const [panelData, setPanelData] = useState([]);
  const [selectedPanelStudents, setSelectedPanelStudents] = useState([]);
  
  const [admin, setAdmin] = useState(null);

  // Fetch admin data from localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setAdmin(JSON.parse(storedUser));
    }
  }, []);

  const handlePanelClick = (panel) => {
    setSelectedPanel(panel.name);
    setSelectedPanelProfile(panel.profileImage);
    setSelectedPanelStudents(panel.panelistStudents ); 
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        "http://localhost:7000/api/admin/panelist/handle/manuscript"
      );
      const data = response.data;
      setPanelData(data.advisors);
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
        {!selectedPanel ? (
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
            {panelData &&
              panelData.length > 0 &&
              panelData.map((panel) => (
                <tbody key={panel.name} className='divide-y divide-gray-200'>
                  <tr>
                    <td className='flex whitespace-nowrap text-center px-4 py-3 font-medium text-white '>
                      <div className="transition-transform duration-300 ease-in-out transform hover:scale-110">
                        <Avatar
                          src={`http://localhost:7000/public/uploads/${
                            panel.profileImage || "default-avatar.png"}`}
                          sx={{ width: 79, height: 79 }}
                          className="opacity-0 transition-opacity duration-500 ease-in-out"
                          onLoad={(e) => (e.currentTarget.style.opacity = 1)}
                        />
                      </div>
                      <p className='text-xl ml-[10px]'>{panel.name}</p>
                    </td>
                    <td className='whitespace-nowrap text-center  px-4 py-2 text-gray-700'>
                      <span className='whitespace-nowrap rounded-full bg-[blue] px-2.5 py-0.5 text-sm text-white'>
                      Panelist
                      </span>
                    </td>
                    <td className='whitespace-nowrap text-center  px-4 py-2'>
                      <Button
                        variant='contained'
                        color="success"
                        onClick={() => handlePanelClick(panel)}
                      >
                        View Defenders
                      </Button>
                    </td>
                  </tr>
                </tbody>
              ))}
          </table>
        ) : (
        <TablesPanel
          panelName={selectedPanel}
          panelImage={selectedPanelProfile}
          panelistStudents={selectedPanelStudents}
        />

        )}
      </div>
    </ConfigProvider>
  );
};

export default App;