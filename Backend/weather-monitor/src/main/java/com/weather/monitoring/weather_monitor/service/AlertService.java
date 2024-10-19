package com.weather.monitoring.weather_monitor.service;

import com.weather.monitoring.weather_monitor.model.AlertThreshold;
import com.weather.monitoring.weather_monitor.repository.AlertThresholdRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;

@Service
public class AlertService {

    @Autowired
    private AlertThresholdRepository alertThresholdRepository;

    private HashMap<String, Integer> consecutiveBreaches = new HashMap<>();

    public void checkForAlerts(String city, Double latestTemperature) {
        List<AlertThreshold> thresholds = alertThresholdRepository.findByCity(city);

        for (AlertThreshold threshold : thresholds) {
            // Check that latest temperature exceeds the threshold or not
            if (latestTemperature > threshold.getTemperatureThreshold()) {
                consecutiveBreaches.put(city, consecutiveBreaches.getOrDefault(city, 0) + 1);
            } else {
                consecutiveBreaches.put(city, 0); // Reset if no breach
            }

            // Check consecutive breaches exceeds the threshold
            if (consecutiveBreaches.get(city) >= threshold.getConsecutiveUpdatesThreshold()) {
                triggerAlert(city, latestTemperature);
                consecutiveBreaches.put(city, 0); // Reset after alert
            }
        }
    }

    private void triggerAlert(String city, double temperature) {

        System.out.println("ALERT: Temperature in " + city + " has exceeded the threshold! Current temp: " + temperature);

    }
}
