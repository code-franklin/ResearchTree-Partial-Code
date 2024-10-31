import React from 'react';
import { Chart, Line, Point, Tooltip, Axis, Legend } from 'bizcharts';
import './Linechart.css';
const data = [
  { year: 2024, value: 50 },
  { year: 2025, value: 120 },
  { year: 2026, value: 80 },
  { year: 2027, value: 150 },
  { year: 2028, value: 100 },
  { year: 2029, value: 300 },
];

const scale = {
  value: { min: 0, alias: 'Best Thesis' },
  year: { range: [0, 1] },
};

export const LineChart = () => {
  return (
    <div className="linechart">
      <Chart height={300} width={900} data={data} scale={scale} autoFit>
        <Axis name="year" />
        <Axis name="value" />
        <Tooltip showCrosshairs />
        <Legend />
        <Line shape="smooth" position="year*value" color="#00FF00" />
        <Point position="year*value" size={10} shape="circle" color="#00FF00" />
      </Chart>
    </div>
  );
};
