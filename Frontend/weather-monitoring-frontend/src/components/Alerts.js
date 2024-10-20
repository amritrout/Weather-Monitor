import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Alerts = () => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAlerts();
    }, []);

    const fetchAlerts = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/alerts`); // Endpoint adjusted to match your backend
            setAlerts(response.data);
        } catch (error) {
            console.error('Error fetching alerts:', error);
        }
        setLoading(false);
    };

    return (
        <div>
            <h2>Triggered Alerts</h2>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    {alerts.length > 0 ? (
                        alerts.map((alert, index) => (
                            <div key={index}>
                                <p>City: {alert.city}</p>
                                <p>Temperature Threshold: {alert.temperatureThreshold}°{alert.temperatureUnit}</p>
                                <p>Consecutive Updates: {alert.consecutiveUpdatesThreshold}</p>
                            </div>
                        ))
                    ) : (
                        <p>No alerts triggered</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Alerts;
