package com.weather.monitoring.weather_monitor.controller;

import com.weather.monitoring.weather_monitor.service.WeatherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class WeatherController {

    @Autowired
    private WeatherService weatherService;

    @GetMapping("/fetchWeather")
    public String fetchWeather(@RequestParam String city) {
        weatherService.fetchAndSaveWeatherData(city);
        return "Weather data fetched and stored!";
    }
}
