import React, { useState, useEffect } from 'react';
import WeatherSummary from './components/WeatherSummary';
import Alerts from './components/Alerts';
import ThresholdForm from './components/ThresholdForm';
import ThresholdList from './components/ThresholdList';
import CurrentWeather from './components/CurrentWeather';
import WeatherChart from './components/WeatherChart';
import './App.css';

function App() {
    const [thresholds, setThresholds] = useState([]);
    const [currentWeatherData, setCurrentWeatherData] = useState([]);
    const [city, setCity] = useState('');

    useEffect(() => {
        fetchThresholds();
    }, []);

    const fetchThresholds = async () => {
        try {
            const response = await fetch('/listThresholds');
            const data = await response.json();
            setThresholds(data);
        } catch (error) {
            console.error('Error fetching thresholds:', error);
        }
    };

    const deleteThreshold = async (id) => {
        if (window.confirm('Are you sure you want to delete this threshold?')) {
            try {
                await fetch(`/deleteThreshold/${id}`, {
                    method: 'DELETE',
                });
                fetchThresholds(); // Refresh the list after deletion
            } catch (error) {
                console.error('Error deleting threshold:', error);
            }
        }
    };

    const fetchCurrentWeather = async () => {
        if (city) {
            try {
                const response = await fetch(`/currentWeather?city=${city}`);
                const data = await response.json();
                setCurrentWeatherData(data); // Set the current weather data
            } catch (error) {
                console.error('Error fetching current weather:', error);
            }
        }
    };

    return (
        <div className="container">
            <div className="header">
                <h1>Weather Monitoring Dashboard</h1>
                <div className="supported-cities">
                    Supported Cities: Delhi, Mumbai, Chennai, Bangalore, Kolkata, Hyderabad
                    <br />
                    Current Temperature can be fetched for any city in the world.
                </div>
            </div>

            <div>
                <WeatherSummary/>
                <Alerts/>
                <hr/>

                {/* Current Weather Section */}
                <CurrentWeather weatherData={currentWeatherData}/> {/* Pass the current weather data */}
                <hr/>

                <h2>Weather Data Chart</h2>

                <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter city name"
                />
                <button onClick={fetchCurrentWeather}>Get Weather Chart</button>
                <WeatherChart weatherData={currentWeatherData}/> {/* Pass current weather data to chart */}
                <hr/>

                <h2>Alert Thresholds</h2>
                <ThresholdForm onThresholdSet={fetchThresholds}/>
                <ThresholdList thresholds={thresholds} onDeleteThreshold={deleteThreshold}/>
            </div>
        </div>
    );
}

export default App;
