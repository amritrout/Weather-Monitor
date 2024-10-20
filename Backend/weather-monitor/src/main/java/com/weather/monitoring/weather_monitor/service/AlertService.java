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

    public void checkForAlerts(String city, Double latestTemperature, String latestTemperatureUnit) {
        List<AlertThreshold> thresholds = alertThresholdRepository.findByCity(city);

        for (AlertThreshold threshold : thresholds) {
            String thresholdUnit = threshold.getTemperatureUnit();

            double temperatureToCompare = latestTemperature;

            if (!latestTemperatureUnit.equals(thresholdUnit)) {
                if (thresholdUnit.equals("C")) {
                    temperatureToCompare = (latestTemperature - 32) * 5 / 9;
                } else if (thresholdUnit.equals("F")) {
                    temperatureToCompare = (latestTemperature * 9 / 5) + 32;
                }
            }

            //TODO:Add support for when Temp drops below Threshold
            // Check if the temperature exceeds the threshold
            if (temperatureToCompare > threshold.getTemperatureThreshold()) {
                consecutiveBreaches.put(city, consecutiveBreaches.getOrDefault(city, 0) + 1);
            } else {
                consecutiveBreaches.put(city, 0); // Reset if no breach
            }

            // Check if consecutive breaches exceed the threshold
            if (consecutiveBreaches.get(city) >= threshold.getConsecutiveUpdatesThreshold()) {
                triggerAlert(city, latestTemperature, latestTemperatureUnit);
                consecutiveBreaches.put(city, 0); // Reset after alert
            }
        }
    }

    private void triggerAlert(String city, double temperature, String unit) {
        String message = "ALERT: Temperature in " + city + " has exceeded the threshold! Current temp: " + temperature + " " + unit;
        System.out.println(message);
    }
}
