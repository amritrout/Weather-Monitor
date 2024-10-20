package com.weather.monitoring.weather_monitor.repository;

import com.weather.monitoring.weather_monitor.model.DailyWeatherSummary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DailyWeatherSummaryRepository extends JpaRepository<DailyWeatherSummary, Long> {

    List<DailyWeatherSummary> findByCityAndDate(String city, LocalDate date);

    List<DailyWeatherSummary> findByCity(String city);
}
