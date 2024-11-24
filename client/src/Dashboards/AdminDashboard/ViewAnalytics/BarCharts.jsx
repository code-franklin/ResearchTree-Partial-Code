import React, { useEffect, useState } from 'react';
import { Chart, Interval, Tooltip, Axis, Legend } from 'bizcharts';
import axios from 'axios';  // Import axios to make the API request


export const BarChart = () => {
  // State to store the fetched data
  const [data, setData] = useState([]);

  // Fetch data from the backend API only if there's no data already
  useEffect(() => {
    if (data.length === 0) {  // Only fetch if the data is empty
      const fetchPdfDetailsCount = async () => {
        try {
          const response = await axios.get('http://localhost:7000/api/student/PdfKeywordsCount'); // Adjust the endpoint as needed
          
          if (response.data.length > 0) { // Check if data exists
            const top10Data = response.data.slice(0, 10); // Limit to the first 10 items
            setData(top10Data); // Set the response data to state
          }
        } catch (error) {
          console.error("Error fetching PDF details count:", error);
        }
      };

      fetchPdfDetailsCount();
    }
  }, [data]); // Only re-run effect if data changes (but initially checks if data is empty)

  // Create a copy of the fetched data to modify
  const sortedData = [...data];

  // Find the index of 'Machine Learning'
  const mlIndex = sortedData.findIndex(item => item.category === 'Machine Learning');

  // Move 'Machine Learning' to the middle of the array
  if (mlIndex > 0) {
    const mlItem = sortedData.splice(mlIndex, 1)[0];
    const middleIndex = Math.floor(sortedData.length / 2);
    sortedData.splice(middleIndex, 0, mlItem);
  }

  return (
    <div className="p-10 mr-5  mt-[125px] rounded-lg shadow-custom-shadow bg-[#1E1E1E] border border-[#4B4B4B] w-[920px]">
      <h2 className="text-[#0BF677] text-xl mb-4">Top 10 Trending Manuscript</h2>
      <Chart height={300}   width={870}   autoFit data={sortedData} interactions={['active-region']} >
        <Axis name="value" visible={true} />
        <Axis name="category" label={null} visible={true} />
        <Legend 
          position="right" 
          offsetY={-20} 
          offsetX={10} 
          marker={{
            symbol: 'circle',
            style: { fill: '#0BF677', r: 5}, // Radius set to 8
          }}
          itemName={{
            style: { fill: '#FFFFFF', fontSize: 14, } // Set legend text color to white
          }}
        />
        <Tooltip shared />
        <Interval
          position="category*value"
          size={50} // Adjust this value to make the bars thicker
          color={['category', category => {
            switch (category) {
              case 'Machine Learning':
                return 'l(270) 0:#00FFC2 1:#0BF677'; // Gradient for 'Machine Learning'
              default:
                return 'l(270) 0:#00FFC2 1:#0BF677'; // Generic gradient for other categories
            }
          }]}
        />
      </Chart>
    </div>
  );
};

export default BarChart;
