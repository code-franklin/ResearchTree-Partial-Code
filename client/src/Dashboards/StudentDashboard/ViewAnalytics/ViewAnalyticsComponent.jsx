import React from 'react'
import { BarChart } from './BarCharts'
import { PieChart } from './Piechart'
import { Cards } from './Statistics'
import "./Styles/viewAnalytics.css";


const Chart = () => {
  return (
       <div className="h-[800px]">
     <div className="chart-1">
   <div className="bar-charts">
        <BarChart />
        <Cards/>    

   </div>
  
  <div className="chart-2">
  <PieChart/>    
  </div> 
     </div>
       </div>
  )
}

export default Chart;