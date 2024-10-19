// src/components/ThresholdForm.js
import React, { useState } from 'react';

const ThresholdForm = ({ onThresholdSet }) => {
    const [city, setCity] = useState('');
    const [temperatureThreshold, setTemperatureThreshold] = useState('');
    const [consecutiveUpdatesThreshold, setConsecutiveUpdatesThreshold] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await fetch('/setThreshold', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    city,
                    temperatureThreshold,
                    consecutiveUpdatesThreshold,
                }),
            });

            // Clear the form fields
            setCity('');
            setTemperatureThreshold('');
            setConsecutiveUpdatesThreshold('');

            // Refresh the thresholds list
            onThresholdSet();
        } catch (error) {
            console.error('Error setting threshold:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
            />
            <input
                type="number"
                placeholder="Temperature Threshold"
                value={temperatureThreshold}
                onChange={(e) => setTemperatureThreshold(e.target.value)}
                required
            />
            <input
                type="number"
                placeholder="Consecutive Updates Threshold"
                value={consecutiveUpdatesThreshold}
                onChange={(e) => setConsecutiveUpdatesThreshold(e.target.value)}
                required
            />
            <button type="submit">Set Threshold</button>
        </form>
    );
};

export default ThresholdForm;
