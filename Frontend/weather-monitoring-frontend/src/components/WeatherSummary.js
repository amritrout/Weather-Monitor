import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WeatherSummary = () => {
    const [city, setCity] = useState('Chennai');  // Default city
    const [summary, setSummary] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchWeatherSummary();
    }, [city]);

    const fetchWeatherSummary = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/dailyWeatherSummary`, {
                params: { city: city }
            });
            setSummary(response.data);
        } catch (error) {
            console.error('Error fetching weather summary:', error);
        }
        setLoading(false);
    };

    return (
        <div>
            <h2>Daily Weather Summary</h2>
            <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city"
            />
            <button onClick={fetchWeatherSummary}>Get Weather</button>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    {summary.map((data, index) => (
                        <div key={index}>
                            <p>Date: {data.date}</p>
                            <p>Temperature: {data.averageTemperature.toFixed(2)}</p>
                            <p>Max Temp: {data.maxTemperature.toFixed(2)}</p>
                            <p>Min Temp: {data.minTemperature.toFixed(2)}</p>
                            <p>Condition: {data.dominantCondition}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WeatherSummary;
