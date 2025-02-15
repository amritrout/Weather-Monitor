package com.weather.monitoring.weather_monitor.controller;

import com.weather.monitoring.weather_monitor.model.*;
import com.weather.monitoring.weather_monitor.service.WeatherService;
import com.weather.monitoring.weather_monitor.repository.*;
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

    @Autowired
    private TriggeredAlertRepository triggeredAlertRepository;


    @GetMapping("/currentWeather")
    public List<WeatherData> getCurrentWeather(@RequestParam String city) {
        weatherService.fetchAndSaveWeatherData(city,false);
        return weatherDataRepository.findLatestWeatherData(city);
    }

    @PostMapping("/setThreshold")
    public String setThreshold(
            @RequestParam String city,
            @RequestParam double temperatureThreshold,
            @RequestParam String temperatureUnit,
            @RequestParam int consecutiveUpdatesThreshold) {

        if (!temperatureUnit.equals("C") && !temperatureUnit.equals("F")) {
            return "Invalid temperature unit. Please use 'C' for Celsius or 'F' for Fahrenheit.";
        }

        AlertThreshold alertThreshold = new AlertThreshold();
        alertThreshold.setCity(city);
        alertThreshold.setTemperatureThreshold(temperatureThreshold);
        alertThreshold.setTemperatureUnit(temperatureUnit);
        alertThreshold.setConsecutiveUpdatesThreshold(consecutiveUpdatesThreshold);

        alertThresholdRepository.save(alertThreshold);

        return "Alert threshold set for " + city + ": " +
                "Temperature > " + temperatureThreshold + " " + temperatureUnit +
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

    @GetMapping("/weatherHistorybyCity")
    public List<DailyWeatherSummary> getWeatherHistory(@RequestParam String city) {
        return dailyWeatherSummaryRepository.findByCity(city);
    }

    @GetMapping("/alerts")
    public List<AlertThreshold> getAlerts() {
        return alertThresholdRepository.findAll();
    }

    @GetMapping("/triggeredAlertsbyCity")
    public List<TriggeredAlert> getTriggeredAlerts(@RequestParam String city) {
        return triggeredAlertRepository.findByCity(city);
    }


}
