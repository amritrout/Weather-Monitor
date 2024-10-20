import React, { useState } from 'react';

const ThresholdForm = ({ onThresholdSet }) => {
    const [city, setCity] = useState('');
    const [temperatureThreshold, setTemperatureThreshold] = useState('');
    const [temperatureUnit, setTemperatureUnit] = useState('C'); // Default unit
    const [consecutiveUpdatesThreshold, setConsecutiveUpdatesThreshold] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate that numerical fields are entered
        if (isNaN(temperatureThreshold) || isNaN(consecutiveUpdatesThreshold)) {
            alert("Please enter valid numbers for thresholds.");
            return;
        }

        try {
            // Store the result of the fetch in a variable
            const response = await fetch('/setThreshold', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    city,
                    temperatureThreshold: parseFloat(temperatureThreshold),
                    temperatureUnit,
                    consecutiveUpdatesThreshold: parseInt(consecutiveUpdatesThreshold),
                }),
            });

            // Check if the response is not OK
            if (!response.ok) {
                throw new Error('Failed to set threshold');
            }

            // Clear the form fields
            setCity('');
            setTemperatureThreshold('');
            setTemperatureUnit('C');
            setConsecutiveUpdatesThreshold('');

            // Notify parent component about the update
            onThresholdSet();

        } catch (error) {
            console.error('Error setting threshold:', error);
            alert('An error occurred while setting the threshold.');
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
            <select
                value={temperatureUnit}
                onChange={(e) => setTemperatureUnit(e.target.value)}
                required
            >
                <option value="C">Celsius</option>
                <option value="F">Fahrenheit</option>
            </select>
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
