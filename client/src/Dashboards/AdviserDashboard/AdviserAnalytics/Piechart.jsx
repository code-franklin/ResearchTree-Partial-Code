import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import variablePie from 'highcharts/modules/variable-pie';
import "tailwindcss/tailwind.css"; // Import Tailwind CSS

// Initialize the variable pie module
variablePie(Highcharts);

// Define the VariablePieChart component
export const PieChart = () => {
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
                y: 20,
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
            }]
        }]
    };

    return (
        <div className="flex justify-center items-center w-[566px] mt-[130px] ml-[-180px] border-t border-[#4B4B4B] rounded-t">
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
            />
        </div>
    );
};

export default PieChart;
