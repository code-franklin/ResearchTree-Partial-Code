import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import variablePie from "highcharts/modules/variable-pie";
import axios from "axios";
import "tailwindcss/tailwind.css";
import 'ldrs/dotSpinner'

// Initialize the variable pie module
variablePie(Highcharts);

export const PieChart = () => {
  const [error, setError] = useState(null); // State for error handling
  const [chartData, setChartData] = useState([]); // State for storing fetched chart data
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchKeywordCounts = async () => {
      try {
        setLoading(true); // Start loading
        // Fetch keyword counts
        const response = await axios.get(
          "http://localhost:7000/api/student/PdfKeywordsCount"
        );

        // Check if valid data is returned
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          const top5Data = response.data.slice(0, 6); // Limit to top 5
          setChartData(top5Data); // Update state with the data
        } else {
          setChartData([]); // Set chartData to an empty array if no data is found
          setError("No keyword data available.");
        }
      } catch (error) {
        setError("Failed to fetch keyword counts.");
        console.error("Error fetching keyword counts:", error);
      } finally {
        setLoading(false);
        
      }// End loading
    };

    fetchKeywordCounts(); // Fetch data on component mount
  }, []); // Empty dependency array ensures this runs only once

  const colors = [
    "#222222",  // Dark color (perhaps for background)
    "#0C8900",  // Rich Green (used in your trending graph)
    "#2BC20E",  // Bright Green (for accents)
    "#9CFF00",  // Light Green (for highlights or success)
    "#39FF13",  // Neon Green (for highlights or accents)
    "#31572c",  // Forest Green (for background or text contrast)
];
  

  const options = {
    chart: {
      type: "variablepie",
      backgroundColor: "#1E1E1E",
      spacingBottom: 10,
      spacingTop: 10,
      spacingLeft: 0,
      spacingRight: 0,
      height: 425,
      width: 402,
      borderColor: "#4B4B4B",
      borderWidth: 3,
    },
    title: {
      text: null,
    },
    legend: {
      enabled: true,
      itemStyle: {
        color: "#FFFFFF",
      },
    },
    series: [
      {
        minPointSize: 20,
        innerSize: "30%",
        zMin: 0,
        showInLegend: true,
        borderColor: null, // Remove border color for pie segments
            borderWidth: 0, // Remove border width for pie segments
        dataLabels: {
          enabled: false,
        },
        data: chartData.map((item, index) => ({
            name: item.category,
            y: item.value,
            z: 20 + index * 5, // Different z value for each category
            color: colors[index % colors.length], // Cycle through colors
          })),
      },
    ],
  };

  return (
    <div className="flex justify-center items-center w-[566px] mt-[125px] ml-[-125px] border-t border-[#4B4B4B] rounded-t">
       {loading ? (


            <div className="mt-[150px]"> 
           
            <l-dot-spinner
            size="70"
            speed="0.9"
            color="#0BF677" 
            ></l-dot-spinner>
            </div>
       
      ) : error ? (
        <div className="text-white">{error}</div>
      ) : chartData.length > 0 ? (
        <HighchartsReact highcharts={Highcharts} options={options} />
      ) : (
        <div className="text-white">No data available.</div>
      )}
    </div>
  );
};

export default PieChart;
