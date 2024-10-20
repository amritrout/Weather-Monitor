package com.weather.monitoring.weather_monitor.scheduler;

import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.beans.factory.annotation.Autowired;
import com.weather.monitoring.weather_monitor.service.WeatherService;

public class WeatherJob implements Job {

    @Autowired
    private WeatherService weatherService;

    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        String[] cities = {"Delhi", "Mumbai", "Chennai", "Bangalore", "Kolkata", "Hyderabad"};

        for (String city : cities) {
            weatherService.fetchAndSaveWeatherData(city,true);
            System.out.println("Weather data for " + city + " fetched and saved.");
        }
    }
}

