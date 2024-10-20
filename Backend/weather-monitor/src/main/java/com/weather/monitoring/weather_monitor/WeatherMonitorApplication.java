package com.weather.monitoring.weather_monitor;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class WeatherMonitorApplication {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.load();

		System.setProperty("WEATHER_API", dotenv.get("WEATHER_API"));
		System.setProperty("TELEGRAM_BOT_TOKEN", dotenv.get("TELEGRAM_BOT_TOKEN"));
		System.setProperty("CHAT_ID", dotenv.get("CHAT_ID"));

		SpringApplication.run(WeatherMonitorApplication.class, args);
	}
}
