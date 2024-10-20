package com.weather.monitoring.weather_monitor.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AlertThreshold {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String city;
    private double temperatureThreshold;
    private String temperatureUnit; // "C" for Celsius or "F" for Fahrenheit
    private int consecutiveUpdatesThreshold;
}
