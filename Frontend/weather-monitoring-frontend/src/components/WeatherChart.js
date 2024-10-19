// src/components/WeatherChart.js

import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale } from 'chart.js';

// Register the required components
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale);

const WeatherChart = ({ weatherData }) => {
    // Prepare data for the chart
    const labels = weatherData.map(data => new Date(data.date).toLocaleDateString()); // Format date for x-axis
    const temperatures = weatherData.map(data => data.temperature); // Get temperature for y-axis

    const data = {
        labels,
        datasets: [
            {
                label: 'Temperature (°C)',
                data: temperatures,
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1,
            },
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Temperature (°C)',
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'Date',
                },
            },
        },
    };

    return (
        <div>
            <h2>Weather Data Chart</h2>
            <Line data={data} options={options} />
        </div>
    );
};

export default WeatherChart;
