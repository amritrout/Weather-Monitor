package com.weather.monitoring.weather_monitor.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DailyWeatherSummary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String city;
    private LocalDate date;
    private double averageTemperatureCelsius;
    private double averageTemperatureFahrenheit;
    private double maxTemperatureCelsius;
    private double maxTemperatureFahrenheit;
    private double minTemperatureCelsius;
    private double minTemperatureFahrenheit;
    private String DominantCondition;

}
