package com.weather.monitoring.weather_monitor.repository;

import com.weather.monitoring.weather_monitor.model.TriggeredAlert;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TriggeredAlertRepository extends JpaRepository<TriggeredAlert, Long> {

    List<TriggeredAlert> findByCity(String city);
}
