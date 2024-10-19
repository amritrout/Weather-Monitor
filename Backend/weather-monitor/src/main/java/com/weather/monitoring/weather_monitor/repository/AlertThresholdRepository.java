package com.weather.monitoring.weather_monitor.repository;

import com.weather.monitoring.weather_monitor.model.AlertThreshold;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlertThresholdRepository extends JpaRepository<AlertThreshold, Long> {
    List<AlertThreshold> findByCity(String city);
}

