package com.weather.monitoring.weather_monitor.alert;

import com.weather.monitoring.weather_monitor.model.WeatherData;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WeatherAlertService {

    private static final double TEMP_THRESHOLD = 35.0;

    public void checkForTemperatureAlerts(List<WeatherData> weatherDataList) {
        for (WeatherData weatherData : weatherDataList) {
            if (weatherData.getTemperature() > TEMP_THRESHOLD) {
                System.out.println("Alert: High temperature in " + weatherData.getCity());
            }
        }
    }
}
