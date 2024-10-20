import React, { useState } from 'react';
import axios from 'axios';

function CurrentWeather() {
    const [city, setCity] = useState('');
    const [currentWeather, setCurrentWeather] = useState(null);
    const [error, setError] = useState('');

    const fetchCurrentWeather = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.get(`/currentWeather`, { params: { city } });
            if (response.data.length === 0) {
                throw new Error('City not found or no data available.');
            }
            setCurrentWeather(response.data[0]); // Assuming response returns an array, we take the first object
        } catch (error) {
            setError(error.message);
            setCurrentWeather(null);
        }
    };

    return (
        <div className="current-weather">
            <h2>Current Weather</h2>
            <form onSubmit={fetchCurrentWeather}>
                <input
                    type="text"
                    placeholder="Enter city name"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                />
                <button type="submit">Get Current Weather</button>
            </form>
            {error && <p className="error">{error}</p>}
            {currentWeather && (
                <div className="weather-info">
                    <h3>{currentWeather.city}</h3>
                    <p>Temperature: {currentWeather.temperatureCelsius.toFixed(2)}°C</p>
                    <p>Condition: {currentWeather.mainCondition}</p>
                </div>
            )}
        </div>
    );
}

export default CurrentWeather;
