package com.weather.monitoring.weather_monitor.service;

import com.weather.monitoring.weather_monitor.model.DailyWeatherSummary;
import com.weather.monitoring.weather_monitor.model.WeatherData;
import com.weather.monitoring.weather_monitor.repository.DailyWeatherSummaryRepository;
import com.weather.monitoring.weather_monitor.repository.WeatherDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;

@Service
public class WeatherService {

    @Autowired
    private DailyWeatherSummaryRepository dailyWeatherSummaryRepository;

    @Autowired
    private WeatherDataRepository weatherDataRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private AlertService alertService;

    @Value("${WEATHER_API}")
    private String apiKey;

    private static final String API_URL = "https://api.openweathermap.org/data/2.5/weather?q={city}&appid={apiKey}";

    public void fetchAndSaveWeatherData(String city, boolean checkAlerts) {
        Map<String, Object> response = restTemplate.getForObject(API_URL, Map.class, city, apiKey);

        if (response != null) {
            Map<String, Object> main = (Map<String, Object>) response.get("main");

            double tempKelvin = ((Number) main.get("temp")).doubleValue();
            double feelsLikeKelvin = ((Number) main.get("feels_like")).doubleValue();

            List<Map<String, Object>> weatherList = (List<Map<String, Object>>) response.get("weather");
            String mainCondition = weatherList.isEmpty() ? "Unknown" : (String) weatherList.get(0).get("main");

            double tempCelsius = tempKelvin - 273.15;
            double feelsLikeCelsius = feelsLikeKelvin - 273.15;

            WeatherData weatherData = new WeatherData();
            weatherData.setCity(city);
            weatherData.setTemperatureCelsius(tempCelsius);
            weatherData.setFeelsLikeCelsius(feelsLikeCelsius);
            weatherData.setTemperatureFahrenheit((tempCelsius * 9 / 5) + 32);
            weatherData.setFeelsLikeFahrenheit((feelsLikeCelsius * 9 / 5) + 32);
            weatherData.setMainCondition(mainCondition);

            long timestamp = ((Number) response.get("dt")).longValue();
            LocalDate date = Instant.ofEpochSecond(timestamp).atZone(ZoneId.systemDefault()).toLocalDate();
            weatherData.setDate(date);
            weatherData.setTime(LocalTime.now());

            weatherDataRepository.save(weatherData);

            if (checkAlerts) {
                alertService.checkForAlerts(city, tempCelsius, "C");
            }
        }
    }

    public void calculateAndSaveDailySummary(String city, LocalDate date) {
        List<Object[]> weatherSummary = weatherDataRepository.calculateWeatherSummary(city, date);

        if (weatherSummary.isEmpty()) {
            return;
        }

        Object[] summaryData = weatherSummary.get(0);

        double averageTemperatureCelsius = (Double) summaryData[0];
        double maxTemperatureCelsius = (Double) summaryData[1];
        double minTemperatureCelsius = (Double) summaryData[2];
        String dominantCondition = (String) summaryData[6];

        double averageTemperatureFahrenheit = (Double) summaryData[3];
        double maxTemperatureFahrenheit = (Double) summaryData[4];
        double minTemperatureFahrenheit = (Double) summaryData[5];

        DailyWeatherSummary summary = new DailyWeatherSummary();
        summary.setCity(city);
        summary.setDate(date);
        summary.setAverageTemperatureCelsius(averageTemperatureCelsius);
        summary.setMaxTemperatureCelsius(maxTemperatureCelsius);
        summary.setMinTemperatureCelsius(minTemperatureCelsius);

        summary.setAverageTemperatureFahrenheit(averageTemperatureFahrenheit);
        summary.setMaxTemperatureFahrenheit(maxTemperatureFahrenheit);
        summary.setMinTemperatureFahrenheit(minTemperatureFahrenheit);
        summary.setDominantCondition(dominantCondition);

        dailyWeatherSummaryRepository.save(summary);
    }

}
