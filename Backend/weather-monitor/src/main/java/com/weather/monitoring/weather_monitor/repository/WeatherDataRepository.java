package com.weather.monitoring.weather_monitor.repository;

import com.weather.monitoring.weather_monitor.model.WeatherData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface WeatherDataRepository extends JpaRepository<WeatherData, Long> {

    @Query("SELECT AVG(w.temperature), MAX(w.temperature), MIN(w.temperature), w.mainCondition " +
            "FROM WeatherData w WHERE w.city = :city AND w.date = :date " +
            "GROUP BY w.mainCondition ORDER BY COUNT(w.mainCondition) DESC")
    List<Object[]> calculateWeatherSummary(@Param("city") String city, @Param("date") LocalDate date);
}
