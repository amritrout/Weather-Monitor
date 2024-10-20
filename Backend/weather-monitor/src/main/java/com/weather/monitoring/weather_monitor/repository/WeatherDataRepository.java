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

    @Query("SELECT AVG(w.temperatureCelsius), MAX(w.temperatureCelsius), MIN(w.temperatureCelsius), " +
            "AVG(w.temperatureFahrenheit), MAX(w.temperatureFahrenheit), MIN(w.temperatureFahrenheit), " +
            "w.mainCondition " +
            "FROM WeatherData w WHERE w.city = :city AND w.date = :date " +
            "GROUP BY w.mainCondition ORDER BY COUNT(w.mainCondition) DESC")
    List<Object[]> calculateWeatherSummary(@Param("city") String city, @Param("date") LocalDate date);


    @Query("SELECT w FROM WeatherData w WHERE w.city = :city ORDER BY w.date DESC")
    List<WeatherData> findLatestWeatherData(@Param("city") String city);

    @Query("SELECT w FROM WeatherData w WHERE w.city = :city ORDER BY w.date DESC")
    List<WeatherData> findAllWeatherData(@Param("city") String city);
}
