// src/components/ThresholdList.js
import React from 'react';

const ThresholdList = ({ thresholds, onDeleteThreshold }) => {
    return (
        <div>
            <h3>Current Alert Thresholds</h3>
            {thresholds.length === 0 ? (
                <p>No thresholds set.</p>
            ) : (
                <ul>
                    {thresholds.map((threshold) => (
                        <li key={threshold.id}>
                            {threshold.city}:
                            Temperature > {threshold.temperatureThreshold}°C for {threshold.consecutiveUpdatesThreshold} updates.
                            <button onClick={() => onDeleteThreshold(threshold.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ThresholdList;
