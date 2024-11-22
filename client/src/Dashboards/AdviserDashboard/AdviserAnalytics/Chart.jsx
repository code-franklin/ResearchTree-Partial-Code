import React from 'react'
import { BarChart } from './BarCharts'
import { PieChart } from './Piechart'
import { LineChart } from './LineChart'
import { Cards } from './Cards'



import "./ViewAnalytics.css";



const Chart = () => {
  return (
   <div className="">
    
   <div className="chart-1">
   < Cards />
   <div className="bar-charts">

            <BarChart />
     
     
         
   </div>

  <div className="chart-2">
     
  <PieChart/>

  </div> 
   </div>
   </div>
  )
}

export default Chart;