package com.weather.monitoring.weather_monitor.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WeatherData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String city;
    private LocalDate date;
    private LocalTime time;
    private double temperatureCelsius;
    private double feelsLikeCelsius;
    private double temperatureFahrenheit;
    private double feelsLikeFahrenheit;
    private String mainCondition;
}
