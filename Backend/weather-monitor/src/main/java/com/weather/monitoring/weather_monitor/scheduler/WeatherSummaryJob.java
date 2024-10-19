package com.weather.monitoring.weather_monitor.scheduler;

import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.beans.factory.annotation.Autowired;
import com.weather.monitoring.weather_monitor.service.WeatherService;

import java.time.LocalDate;

public class WeatherSummaryJob implements Job {

    @Autowired
    private WeatherService weatherService;

    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        String[] cities = {"Delhi", "Mumbai", "Chennai", "Bangalore", "Kolkata", "Hyderabad"};

        LocalDate date = LocalDate.now();

        for (String city : cities) {
            weatherService.calculateAndSaveDailySummary(city,date);
            System.out.println("Calculated Summary for " + city );
        }
    }
}

