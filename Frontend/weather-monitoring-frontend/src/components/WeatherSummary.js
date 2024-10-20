import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const WeatherSummary = () => {
    const [city, setCity] = useState('Chennai');
    const [availableDates, setAvailableDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [dailySummary, setDailySummary] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [unit, setUnit] = useState('C');

    useEffect(() => {
        fetchWeatherHistory();
    }, [city]);

    // Helper function to format date as YYYY-MM-DD
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Helper function to parse date string to Date object
    const parseDate = (dateString) => {
        const [year, month, day] = dateString.split('-');
        return new Date(year, parseInt(month) - 1, day);
    };

    const fetchWeatherHistory = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('/weatherHistorybyCity', {
                params: { city: city }
            });
            console.log('Weather History Response:', response.data);

            if (!response.data || !Array.isArray(response.data)) {
                throw new Error('Invalid data format received from API');
            }

            // Convert date strings to Date objects
            const dates = [...new Set(response.data.map(entry => parseDate(entry.date)))];
            //console.log('Available dates:', dates);
            setAvailableDates(dates);

            // Optionally select the most recent date
            if (dates.length > 0) {
                const mostRecentDate = new Date(Math.max(...dates));
                handleDateSelect(mostRecentDate);
            }
        } catch (error) {
            //console.error('Error fetching weather history:', error);
            setError('Failed to fetch weather history. Please try again.');
            setAvailableDates([]);
        }
        setLoading(false);
    };

    const fetchDailyWeatherSummary = async (date) => {
        setLoading(true);
        setError(null);
        try {
            const formattedDate = formatDate(date);
            //console.log('Fetching summary for date:', formattedDate);

            const response = await axios.get('/dailyWeatherSummary', {
                params: {
                    city: city,
                    date: formattedDate
                }
            });

            console.log('Summary Response:', response.data);

            if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                setDailySummary(response.data[0]);
            } else {
                throw new Error('No summary data available for selected date');
            }
        } catch (error) {
            //console.error('Error fetching daily weather summary:', error);
            setError('Failed to fetch weather summary for the selected date.');
            setDailySummary(null);
        }
        setLoading(false);
    };

    const handleDateSelect = (date) => {
        console.log('Selected date:', date);
        setSelectedDate(date);
        fetchDailyWeatherSummary(date);
    };

    const isDateDisabled = (date) => {
        return !availableDates.some(availableDate =>
            formatDate(availableDate) === formatDate(date)
        );
    };

    return (
        <div className="p-4 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Daily Weather Summary</h2>

            <div className="mb-6">
                <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter city"
                    className="border p-2 mr-2 rounded"
                />
                <button
                    onClick={fetchWeatherHistory}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Get Weather History'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <DatePicker
                        selected={selectedDate}
                        onChange={handleDateSelect}
                        filterDate={date => !isDateDisabled(date)}
                        inline
                        dateFormat="yyyy-MM-dd"
                        calendarClassName="border rounded-lg shadow-sm bg-white"
                        disabled={loading}
                        placeholderText="Select a date"
                        highlightDates={availableDates}
                    />
                </div>

                <div>
                    <div className="mb-4 space-x-4">
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                value="C"
                                checked={unit === 'C'}
                                onChange={() => setUnit('C')}
                                className="mr-2"
                            />
                            Celsius
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                value="F"
                                checked={unit === 'F'}
                                onChange={() => setUnit('F')}
                                className="mr-2"
                            />
                            Fahrenheit
                        </label>
                    </div>

                    {loading && (
                        <div className="p-4 border rounded bg-white shadow-sm">
                            <p className="text-gray-600">Loading weather summary...</p>
                        </div>
                    )}

                    {error && !loading && (
                        <div className="p-4 border rounded bg-white shadow-sm">
                            <p className="text-red-500">{error}</p>
                        </div>
                    )}

                    {dailySummary && !loading && !error && (
                        <div className="p-4 border rounded bg-white shadow-sm">
                            <h3 className="text-xl font-semibold mb-2">
                                Weather Summary for {selectedDate ? formatDate(selectedDate) : ''}
                            </h3>
                            <div className="space-y-2">
                                <p>
                                    Avg Temp: {unit === 'C'
                                    ? `${dailySummary.averageTemperatureCelsius.toFixed(2)}°C`
                                    : `${dailySummary.averageTemperatureFahrenheit.toFixed(2)}°F`}
                                </p>
                                <p>
                                    Max Temp: {unit === 'C'
                                    ? `${dailySummary.maxTemperatureCelsius.toFixed(2)}°C`
                                    : `${dailySummary.maxTemperatureFahrenheit.toFixed(2)}°F`}
                                </p>
                                <p>
                                    Min Temp: {unit === 'C'
                                    ? `${dailySummary.minTemperatureCelsius.toFixed(2)}°C`
                                    : `${dailySummary.minTemperatureFahrenheit.toFixed(2)}°F`}
                                </p>
                                <p>Dominant Condition: {dailySummary.dominantCondition}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WeatherSummary;