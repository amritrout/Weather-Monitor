package com.weather.monitoring.weather_monitor.controller;

import com.weather.monitoring.weather_monitor.model.AlertThreshold;
import com.weather.monitoring.weather_monitor.service.WeatherService;
import com.weather.monitoring.weather_monitor.repository.AlertThresholdRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
public class WeatherController {

    @Autowired
    private WeatherService weatherService;

    @Autowired
    private AlertThresholdRepository alertThresholdRepository;

    @GetMapping("/fetchWeather")
    public String fetchWeather(@RequestParam String city) {
        weatherService.fetchAndSaveWeatherData(city);
        return "Weather data fetched and stored!";
    }


    @PostMapping("/setThreshold")
    public String setThreshold(
            @RequestParam String city,
            @RequestParam double temperatureThreshold,
            @RequestParam int consecutiveUpdatesThreshold) {

        AlertThreshold alertThreshold = new AlertThreshold();
        alertThreshold.setCity(city);
        alertThreshold.setTemperatureThreshold(temperatureThreshold);
        alertThreshold.setConsecutiveUpdatesThreshold(consecutiveUpdatesThreshold);

        alertThresholdRepository.save(alertThreshold);

        return "Alert threshold set for " + city + ": " +
                "Temperature > " + temperatureThreshold +
                " for " + consecutiveUpdatesThreshold + " consecutive updates.";
    }
}
