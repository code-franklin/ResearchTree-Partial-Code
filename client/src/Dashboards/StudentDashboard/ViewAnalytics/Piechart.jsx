import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import variablePie from 'highcharts/modules/variable-pie';
import "./Styles/pieChart.css";

// Initialize the variable pie module
variablePie(Highcharts);

export const PieChart = ({ user }) => {
    const [tasks, setTasks] = useState([]);
    const [progress, setProgress] = useState(0);

    // Fetch tasks data
    const fetchUpdatedTasks = async () => {
        try {
            const response = await fetch(`http://localhost:7000/api/student/tasks/${user._id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Failed to fetch updated tasks:', errorData.message || 'Unknown error');
                return;
            }

            const data = await response.json();
            setTasks(data.tasks || []);
        } catch (error) {
            console.error('Error fetching updated tasks:', error.message);
        }
    };

    // Fetch task progress
    const fetchTaskProgress = async (userId) => {
        try {
          const response = await fetch(`http://localhost:7000/api/student/tasks/progress/${userId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
      
          if (!response.ok) {
            const errorData = await response.json();
            console.error('Error fetching task progress:', errorData.message);
            return;
          }
      
          const { progress } = await response.json();
          setProgress(progress >= 0 && progress <= 100 ? progress : 0); // Ensure valid range
        } catch (error) {
          console.error('Error fetching task progress:', error);
        }
    };
    
    // Fetch task data when user is updated
    useEffect(() => {
        if (user && user._id) {
          fetchUpdatedTasks();  // Fetch tasks
          fetchTaskProgress(user._id); // Fetch progress
        }
    }, [user]);  // Runs every time `user` is updated
    
    // Dynamic chart options based on the progress state
    const options = {
        chart: {
            type: 'variablepie',
            className: 'highcharts-custom-chart',
            backgroundColor: '#1E1E1E',
            spacingBottom: 0,
            spacingTop: 200,
            spacingLeft: 20,
            spacingRight: 0,
            height: 805,
            width: 450,
        },
        title: {
            text: null,
        },
        legend: {
            align: 'center',
            verticalAlign: 'bottom',
            layout: 'horizontal',
            itemStyle: {
                color: '#FFFFFF',
            },
        },
        series: [{
            minPointSize: 10,
            innerSize: '30%',
            zMin: 0,
            showInLegend: true,
            dataLabels: {
                enabled: false,
            },
            borderColor: 'none',
            borderWidth: 0,
            data: [
                {
                    name: 'Tasks',
                    y: progress,
                    z: 92.9,
                    color: '#222222'
                },
                {
                    name: 'Progress',
                    y: progress,
                    z: 201.8,
                    color: '#0BF677'
                }
            ]
        }]
    };

    return (
        <div className="highcharts-container">
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
            />
        </div>
    );
};

export default PieChart;
