package com.weather.monitoring.weather_monitor.service;

import com.weather.monitoring.weather_monitor.model.AlertThreshold;
import com.weather.monitoring.weather_monitor.model.TriggeredAlert;
import com.weather.monitoring.weather_monitor.repository.AlertThresholdRepository;
import com.weather.monitoring.weather_monitor.repository.TriggeredAlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

@Service
public class AlertService {

    @Autowired
    private AlertThresholdRepository alertThresholdRepository;

    @Autowired
    private TriggeredAlertRepository triggeredAlertRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    private final RestTemplate restTemplate = new RestTemplate();

    private HashMap<String, Integer> consecutiveBreaches = new HashMap<>();

    @Value("${TELEGRAM_BOT_TOKEN}")
    private String TELEGRAM_BOT_TOKEN;
    @Value("${CHAT_ID}")
    private String CHAT_ID;


    public void checkForAlerts(String city, Double latestTemperature, String latestTemperatureUnit) {
        List<AlertThreshold> thresholds = alertThresholdRepository.findByCity(city);

        for (AlertThreshold threshold : thresholds) {
            String thresholdUnit = threshold.getTemperatureUnit();
            double temperatureToCompare = latestTemperature;

            // Convert temperature if needed
            if (!latestTemperatureUnit.equals(thresholdUnit)) {
                if (thresholdUnit.equals("C")) {
                    temperatureToCompare = (latestTemperature - 32) * 5 / 9;
                } else if (thresholdUnit.equals("F")) {
                    temperatureToCompare = (latestTemperature * 9 / 5) + 32;
                }
            }

            // Check if the temperature exceeds the threshold
            if (temperatureToCompare > threshold.getTemperatureThreshold()) {
                consecutiveBreaches.put(city, consecutiveBreaches.getOrDefault(city, 0) + 1);
            } else {
                consecutiveBreaches.put(city, 0); // Reset if no breach
            }

            // Check if consecutive breaches exceed the threshold
            if (consecutiveBreaches.get(city) >= threshold.getConsecutiveUpdatesThreshold()) {
                triggerAlert(city, latestTemperature, latestTemperatureUnit);
                consecutiveBreaches.put(city, 0); // Reset after alert
            }
        }
    }

    private void triggerAlert(String city, double temperature, String unit) {
        String message = "ALERT: Temperature in " + city + " has exceeded the threshold! Current temp: " + String.format("%.2f", temperature) + " " + unit;
        System.out.println(message);

        TriggeredAlert triggeredAlert = new TriggeredAlert();
        triggeredAlert.setCity(city);
        triggeredAlert.setTriggeredTemperature(temperature);
        triggeredAlert.setTemperatureUnit(unit);
        triggeredAlert.setTimestamp(LocalDateTime.now());
        triggeredAlert.setMessage(message);

        TriggeredAlert savedAlert = triggeredAlertRepository.save(triggeredAlert);

        // Send WebSocket message
        messagingTemplate.convertAndSend("/topic/alerts", savedAlert);

        // Send alert to Telegram
        sendTelegramAlert(message);
    }

    private void sendTelegramAlert(String message) {
        String telegramApiUrl = "https://api.telegram.org/bot" + TELEGRAM_BOT_TOKEN + "/sendMessage";
        String url = telegramApiUrl + "?chat_id=" + CHAT_ID + "&text=" + message;

        try {
            restTemplate.getForObject(url, String.class);
            System.out.println("Telegram alert sent successfully.");
        } catch (Exception e) {
            System.err.println("Failed to send Telegram alert: " + e.getMessage());
        }
    }
}
