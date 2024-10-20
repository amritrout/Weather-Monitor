import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import '../App.css';

const Alerts = () => {
    const [displayedAlerts, setDisplayedAlerts] = useState([]);
    const [stompClient, setStompClient] = useState(null);
    const [popupQueue, setPopupQueue] = useState([]);
    const [currentPopup, setCurrentPopup] = useState(null);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const alertBufferRef = useRef([]);

    useEffect(() => {
        // Connect to WebSocket
        const socket = new SockJS('/ws');
        const client = Stomp.over(socket);

        client.connect({}, (frame) => {
            console.log('Connected to WebSocket:', frame);
            setStompClient(client);

            client.subscribe('/topic/alerts', (message) => {
                const newAlert = JSON.parse(message.body);
                alertBufferRef.current.push(newAlert);
                setPopupQueue(prevQueue => [...prevQueue, newAlert]);
            });
        }, (error) => {
            console.error('WebSocket connection error:', error);
        });

        // Set up interval to update displayed alerts
        const intervalId = setInterval(() => {
            if (alertBufferRef.current.length > 0) {
                setDisplayedAlerts(alertBufferRef.current);
                alertBufferRef.current = [];
            }
        }, 5000);

        // Cleanup function
        return () => {
            if (client) {
                client.disconnect();
            }
            clearInterval(intervalId);
        };
    }, []);

    // Handle showing popups one by one
    useEffect(() => {
        if (!isPopupVisible && popupQueue.length > 0) {
            const nextPopup = popupQueue[0];
            setCurrentPopup(nextPopup);
            setIsPopupVisible(true);

            // Automatically close the popup after 5 seconds
            setTimeout(() => {
                setIsPopupVisible(false);
                setPopupQueue(prevQueue => prevQueue.slice(1));
            }, 5000);
        }
    }, [isPopupVisible, popupQueue]);

    const handleClosePopup = () => {
        setIsPopupVisible(false);
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Triggered Alerts</h2>
            <div>
                {displayedAlerts.length > 0 ? (
                    displayedAlerts.map((alert, index) => (
                        <div key={index} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                            <p><strong>City:</strong> {alert.city}</p>
                            <p><strong>Triggered Temperature:</strong> {alert.triggeredTemperature.toFixed(2)}°{alert.temperatureUnit}</p>
                            <p><strong>Timestamp:</strong> {new Date(alert.timestamp).toLocaleString()}</p>
                            <p><strong>Message:</strong> {alert.message}</p>
                        </div>
                    ))
                ) : (
                    <p>No alerts triggered</p>
                )}
            </div>

            {/* Popup component */}
            {isPopupVisible && currentPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <p><strong>New Alert Received!</strong></p>
                        <p>{currentPopup.message}</p>
                        <button
                            onClick={handleClosePopup}
                            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Alerts;
