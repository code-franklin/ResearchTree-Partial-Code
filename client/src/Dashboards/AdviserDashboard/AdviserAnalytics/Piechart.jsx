import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import variablePie from 'highcharts/modules/variable-pie';
import axios from 'axios';  // Make sure axios is imported
import "tailwindcss/tailwind.css"; // Import Tailwind CSS

// Initialize the variable pie module
variablePie(Highcharts);

// Define the VariablePieChart component
export const PieChart = () => {
    // const [readyToDefenseCount, setReadyToDefenseCount] = useState(0);  // Fixed useState initialization
    // const [reviseOnAdviserCount, setReviseOnAdviserCount] = useState(0);  // Declare the state for reviseOnAdviser
    const [error, setError] = useState(null);  // State for error handling

    // // Fetch the 'reviseOnAdviser' count
    // useEffect(() => {
    //     const fetchReviseOnAdviser = async () => {
    //         try {
    //             const response = await axios.get('http://localhost:7000/api/admin/manuscripts/reviseOnAdvicer/count');
    //             setReviseOnAdviserCount(response.data.totalReviseOn); // Set the reviseOnAdviser count to state
    //         } catch (error) {
    //             console.error('Error fetching reviseOnAdviser manuscript count:', error);
    //             setError('Failed to fetch reviseOnAdviser manuscript count');
    //         }
    //     };

    //     fetchReviseOnAdviser();
    // }, []);

    // // Fetch the 'ready to defense' count
    // useEffect(() => {
    //     const fetchReadyToDefenseCount = async () => {
    //         try {
    //             const response = await axios.get('http://localhost:7000/api/admin/manuscripts/readyToDefense/count');
    //             setReadyToDefenseCount(response.data.totalReadyToDefense); // Set the count to state
    //         } catch (error) {
    //             console.error('Error fetching ready to defense manuscript count:', error);
    //             setError('Failed to fetch ready to defense manuscript count');
    //         }
    //     };

    //     fetchReadyToDefenseCount();
    // }, []); // Empty dependency array ensures this effect runs only once after the initial render

    const options = {
        chart: {
            type: 'variablepie',
            className: 'highcharts-custom-chart',
            backgroundColor: '#1E1E1E', // Set background color directly here
            spacingBottom: 10, // Bottom padding
            spacingTop: 270, // Top padding
            spacingLeft: 0, // Left padding
            spacingRight: 0, // Right padding
            height: 760, // Set height
            width: 552, // Set width
            borderColor: '#4B4B4B', // Remove Highcharts border
            borderWidth: 3, // Remove Highcharts border width
        },
        title: {
            text: null // Remove title text
        },
        legend: {
            enabled: true,
            itemStyle: {
                color: '#FFFFFF' // Set legend item text color to white
            },
        },
        series: [{
            minPointSize: 10,
            innerSize: '30%',
            zMin: 0,
            showInLegend: true,
            className: 'highcharts-custom-series',
            borderColor: null, // Remove border color for pie segments
            borderWidth: null, // Remove border width for pie segments
            dataLabels: {
                enabled: false // Disable data labels
            },
            data: [{
                name: 'New Uploads',
                y: 300,
                z: 92.9,
                color: '#FF4444'
            }, {
                name: 'Student Defenders',
                y: 50,
                z: 118.7,
                color: '#0BF677'
            }, {
                name: 'Adviser Revisions',
                y: 200,
                z: 124.6,
                color: '#C70039'
            }, {
                name: 'Panelist Revisions',
                y: 372,
                z: 137.5,
                color: '#272827'
            }, {
                name: 'ReadyDefense',
                y: 200,
                z: 201.8,
                color: '#0BF677'
            }, 
            
            // {
            //     name: 'ReviseOnAdviser',
            //     y: reviseOnAdviserCount,  // Use reviseOnAdviserCount here
            //     z: 50,
            //     color: '#FFD700'
            // }
        
        ]
        }]
    };

    return (
        <div className="flex justify-center items-center w-[566px] mt-[130px] ml-[-180px] border-t border-[#4B4B4B] rounded-t">
            {error ? (
                <div className="text-white">{error}</div>  // Display error message if there's an issue
            ) : (
                <HighchartsReact
                    highcharts={Highcharts}
                    options={options}
                />
            )}
        </div>
    );
};

export default PieChart;
