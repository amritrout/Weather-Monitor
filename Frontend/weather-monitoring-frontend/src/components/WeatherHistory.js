import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WeatherHistory = () => {
    const [city, setCity] = useState('Chennai');
    const [days, setDays] = useState(0);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchWeatherHistory();
    }, [city, days]);

    const fetchWeatherHistory = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/weatherHistory`, {
                params: { city: city, days: days }
            });
            console.log(response.data); // Log the response for debugging
            setHistory(response.data);
        } catch (error) {
            console.error('Error fetching weather history:', error);
        }
        setLoading(false);
    };

    return (
        <div>
            <h2>Weather History (Last {days} days)</h2>
            <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city"
            />
            <input
                type="number"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                placeholder="Days"
            />
            <button onClick={fetchWeatherHistory}>Get History</button>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    {history.map((data, index) => (
                        <div key={index}>
                            <p>Date: {data.date}</p>
                            <p>Avg Temp: {data.averageTemperature.toFixed(2)}</p>
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

export default WeatherHistory;
