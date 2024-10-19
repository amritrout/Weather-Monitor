package com.weather.monitoring.weather_monitor.controller;

import com.weather.monitoring.weather_monitor.model.AlertThreshold;
import com.weather.monitoring.weather_monitor.model.DailyWeatherSummary;
import com.weather.monitoring.weather_monitor.model.WeatherData;
import com.weather.monitoring.weather_monitor.repository.WeatherDataRepository;
import com.weather.monitoring.weather_monitor.service.WeatherService;
import com.weather.monitoring.weather_monitor.repository.AlertThresholdRepository;
import com.weather.monitoring.weather_monitor.repository.DailyWeatherSummaryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
public class WeatherController {

    @Autowired
    private WeatherService weatherService;

    @Autowired
    private AlertThresholdRepository alertThresholdRepository;

    @Autowired
    private DailyWeatherSummaryRepository dailyWeatherSummaryRepository;

    @Autowired
    private WeatherDataRepository weatherDataRepository;

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

    @GetMapping("/listThresholds")
    public List<AlertThreshold> listThresholds() {
        return alertThresholdRepository.findAll();
    }

    @DeleteMapping("/deleteThreshold/{id}")
    public String deleteThreshold(@PathVariable Long id) {
        Optional<AlertThreshold> threshold = alertThresholdRepository.findById(id);

        if (threshold.isPresent()) {
            alertThresholdRepository.deleteById(id);
            return "Alert threshold with ID " + id + " has been deleted.";
        } else {
            return "Alert threshold with ID " + id + " not found.";
        }
    }

    @GetMapping("/dailyWeatherSummary")
    public List<DailyWeatherSummary> getDailyWeatherSummary(
            @RequestParam String city,
            @RequestParam(required = false) String date) {
        LocalDate queryDate = (date != null) ? LocalDate.parse(date) : LocalDate.now();
        return dailyWeatherSummaryRepository.findByCityAndDate(city, queryDate);
    }

    @GetMapping("/weatherHistory")
    public List<DailyWeatherSummary> getWeatherHistory(
            @RequestParam String city,
            @RequestParam(defaultValue = "0") int days) {
        LocalDate startDate = LocalDate.now().minusDays(days);
        return dailyWeatherSummaryRepository.findByCityAndDate(city, startDate);
    }

    @GetMapping("/alerts")
    public List<AlertThreshold> getAlerts() {
        return alertThresholdRepository.findAll();
    }

    @GetMapping("/currentWeather")
    public List<WeatherData> getCurrentWeather(@RequestParam String city) {
        weatherService.fetchAndSaveWeatherData(city);
        return weatherDataRepository.findLatestWeatherData(city);
    }

    @GetMapping("/allWeatherData")
    public List<WeatherData> getAllWeatherData(@RequestParam String city) {
        return weatherDataRepository.findAllWeatherData(city);
    }
}
