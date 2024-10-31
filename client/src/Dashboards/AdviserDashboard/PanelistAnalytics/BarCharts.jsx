import React from 'react';
import { Chart, Interval, Tooltip, Axis, Legend } from 'bizcharts';
import './BarCharts.css'; // Ensure this file contains the necessary styles

const data = [
  { category: 'AI', value: 150 },
  { category: 'Internet of Things (IoT)', value: 150 },
  { category: 'Mobile App', value: 50 },
  { category: 'Web Application', value: 250 },
  { category: 'Machine Learning', value: 120 },
  { category: 'CyberSecurity', value: 20 },
  { category: 'Government', value: 120 },
  { category: 'Block Chain', value: 170 },
  { category: 'Community', value: 120 },
  { category: 'Business', value: 190 }
];

export const BarChart = () => {
  // Create a copy of data to modify
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
    <div className="p-5 mr-5 mt-1.5 rounded-lg shadow-custom-shadow bg-[#1E1E1E] border border-[#4B4B4B]">
      <h2 className="text-[#0BF677] text-xl mb-4">Trending Manuscript</h2>
      <Chart 
            height={300} 
            width={900} 
            autoFit data={sortedData} 
            interactions={['active-region']} >
            
        <Axis name="value" visible={true} />
        <Axis name="category" label={null} visible={true} />
        <Legend 
          position="right" 
          offsetY={-20} 
          marker={{
           
            symbol: 'circle',
            style: { fill: '#0BF677', r: 5}, // Radius set to 8
          }}
          itemName={{
            style: { fill: '#FFFFFF', fontSize: 14 } // Set legend text color to white
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
