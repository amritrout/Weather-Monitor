// src/components/CurrentWeather.js

import React, { useState } from 'react';

function CurrentWeather() {
    const [city, setCity] = useState('');
    const [currentWeather, setCurrentWeather] = useState([]);
    const [error, setError] = useState('');

    const fetchCurrentWeather = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch(`/currentWeather?city=${city}`);
            if (!response.ok) {
                throw new Error('City not found');
            }
            const data = await response.json();
            setCurrentWeather(data);
        } catch (error) {
            setError(error.message);
            setCurrentWeather([]);
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
            {currentWeather.length > 0 && (
                <div className="weather-info">
                    <h3>{currentWeather[0].city}</h3>
                    <p>Temperature: {currentWeather[0].temperature.toFixed(2)}°C</p>
                    <p>Condition: {currentWeather[0].mainCondition}</p>
                </div>
            )}
        </div>
    );
}

export default CurrentWeather;
