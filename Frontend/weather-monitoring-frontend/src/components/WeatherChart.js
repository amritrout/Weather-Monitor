import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, TimeScale,
    CategoryScale, Tooltip, Legend, } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import 'chartjs-adapter-date-fns';
import axios from 'axios';

ChartJS.register(LineElement, PointElement, LinearScale, TimeScale, CategoryScale,
    Tooltip, Legend, zoomPlugin);

const WeatherChart = ({ weatherData }) => {
    const [unit, setUnit] = useState('C');
    const [dataType, setDataType] = useState('today');
    const [historicalData, setHistoricalData] = useState([]);
    const [triggeredAlerts, setTriggeredAlerts] = useState([]);
    const [city, setCity] = useState('Chennai');

    useEffect(() => {
        if (dataType === 'history') {
            fetchHistoricalData(city);
        } else if (dataType === 'alerts') {
            fetchTriggeredAlerts(city);
        }
    }, [dataType, city]);

    const fetchHistoricalData = async (city) => {
        try {
            const response = await axios.get(`/weatherHistorybyCity`, { params: { city } });
            setHistoricalData(response.data);
        } catch (error) {
            console.error('Error fetching historical weather data:', error);
        }
    };

    const fetchTriggeredAlerts = async (city) => {
        try {
            const response = await axios.get(`/triggeredAlertsbyCity`, { params: { city } });
            console.log('Triggered Alerts Response:', response.data); // Log the response data
            setTriggeredAlerts(response.data);
        } catch (error) {
            console.error('Error fetching triggered alerts:', error);
        }
    };

    if (!weatherData || weatherData.length === 0) {
        return <p>No weather data available</p>;
    }

    const prepareChartData = () => {
        let labels = [];
        let datasets = [];

        if (dataType === 'today') {
            const dateTimeMap = new Map();

            weatherData.forEach(data => {
                const dateTime = new Date(`${data.date}T${data.time}`);
                const key = dateTime.getTime();

                if (!dateTimeMap.has(key) || dateTime > dateTimeMap.get(key).dateTime) {
                    dateTimeMap.set(key, {
                        dateTime,
                        temperature: unit === 'C' ? data.temperatureCelsius : data.temperatureFahrenheit,
                        feelsLike: unit === 'C' ? data.feelsLikeCelsius : data.feelsLikeFahrenheit,
                    });
                }
            });

            // Extract labels and data from the map, ensuring consistent order
            const sortedData = Array.from(dateTimeMap.values()).sort((a, b) => a.dateTime - b.dateTime);
            labels = sortedData.map(v => v.dateTime);
            datasets = [
                {
                    label: `Temperature (°${unit})`,
                    data: sortedData.map(v => v.temperature),
                    borderColor: 'rgba(75, 192, 192, 1)',
                    tension: 0.1,
                },
                {
                    label: `Feels Like (°${unit})`,
                    data: sortedData.map(v => v.feelsLike),
                    borderColor: 'rgba(255, 99, 132, 1)',
                    tension: 0.1,
                }
            ];
        } else if (dataType === 'history') {
            labels = historicalData.map(data => new Date(data.date));
            const getTemp = (data, type) => unit === 'C' ? data[`${type}TemperatureCelsius`] : data[`${type}TemperatureFahrenheit`];

            datasets = [
                {
                    label: `Average Temperature (°${unit})`,
                    data: historicalData.map(data => getTemp(data, 'average')),
                    borderColor: 'rgba(75, 192, 192, 1)',
                    tension: 0.1,
                },
                {
                    label: `Max Temperature (°${unit})`,
                    data: historicalData.map(data => getTemp(data, 'max')),
                    borderColor: 'rgba(255, 99, 132, 1)',
                    tension: 0.1,
                },
                {
                    label: `Min Temperature (°${unit})`,
                    data: historicalData.map(data => getTemp(data, 'min')),
                    borderColor: 'rgba(54, 162, 235, 1)',
                    tension: 0.1,
                }
            ];
        } else if (dataType === 'alerts') {
            labels = triggeredAlerts.map(alert => new Date(alert.timestamp));

            datasets = [
                {
                    label: `Triggered Temperature (°${unit})`,
                    data: triggeredAlerts.map(alert => alert.triggeredTemperature),
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    tension: 0.1,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                }
            ];
        }

        return { labels, datasets };
    };

    const { labels, datasets } = prepareChartData();
    const data = { labels, datasets };

    const options = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: false,
                title: {
                    display: true,
                    text: `Temperature (°${unit})`,
                },
            },
            x: {
                type: 'time',
                time: {
                    unit: dataType === 'today' ? 'hour' : 'day',
                    tooltipFormat: dataType === 'today' ? 'MMM dd, HH:mm' : 'MMM dd, yyyy',
                    displayFormats: {
                        hour: 'MMM dd, HH:mm',
                        day: 'MMM dd',
                    },
                },
                title: {
                    display: true,
                    text: dataType === 'today' ? 'Date and Time' : 'Date',
                },
            },
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: (context) => {
                        let label = `${context.dataset.label}: ${context.parsed.y.toFixed(2)}`;
                        if (dataType === 'history') {
                            const dataIndex = context.dataIndex;
                            label += ` | Dominant Condition: ${historicalData[dataIndex].DominantCondition}`;
                        }
                        return label;
                    },
                },
            },
            zoom: {
                zoom: {
                    wheel: { enabled: true },
                    pinch: { enabled: true },
                    mode: 'x',
                },
                pan: {
                    enabled: true,
                    mode: 'x',
                },
            },
            legend: {
                display: true,
                position: 'top',
            },
        },
    };

    const handleUnitChange = (e) => setUnit(e.target.value);
    const handleDataTypeChange = (e) => setDataType(e.target.value);
    const handleCityChange = (e) => setCity(e.target.value);

    return (
        <div>
            <h2>Weather Data Chart</h2>
            <div>
                <label>
                    <input type="radio" value="C" checked={unit === 'C'} onChange={handleUnitChange} /> Celsius
                </label>
                <label>
                    <input type="radio" value="F" checked={unit === 'F'} onChange={handleUnitChange} /> Fahrenheit
                </label>
            </div>
            <div>
                <label>Select Data Type: </label>
                <select value={dataType} onChange={handleDataTypeChange}>
                    <option value="today">Today's Temp Data</option>
                    <option value="history">Historical Trends</option>
                    <option value="alerts">Triggered Alerts</option>
                </select>
            </div>
            {dataType === 'history' && (
                <div>
                    <label>City: </label>
                    <input type="text" value={city} onChange={handleCityChange} placeholder="Enter city" />
                </div>
            )}
            <Line data={data} options={options} />
        </div>
    );
};

export default WeatherChart;
