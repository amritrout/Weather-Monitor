package com.weather.monitoring.weather_monitor.scheduler;

import org.quartz.*;
import org.quartz.spi.JobFactory;
import org.springframework.scheduling.quartz.SpringBeanJobFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.quartz.SchedulerFactoryBean;

@Configuration
public class QuartzSchedulerConfig {

    @Autowired
    private ApplicationContext applicationContext;

    @Bean
    public JobFactory jobFactory() {
        SpringBeanJobFactory jobFactory = new SpringBeanJobFactory();
        jobFactory.setApplicationContext(applicationContext);
        return jobFactory;
    }

    @Bean
    public SchedulerFactoryBean schedulerFactoryBean(JobFactory jobFactory) {
        SchedulerFactoryBean factory = new SchedulerFactoryBean();
        factory.setJobFactory(jobFactory);
        return factory;
    }

    @Bean
    public Scheduler scheduler(SchedulerFactoryBean factory) throws SchedulerException {
        Scheduler scheduler = factory.getScheduler();

        JobDetail weatherJobDetail = JobBuilder.newJob(WeatherJob.class)
                .withIdentity("weatherJob", "group1")
                .build();

        Trigger weatherTrigger = TriggerBuilder.newTrigger()
                .withIdentity("weatherTrigger", "group1")
                .startNow()
                .withSchedule(SimpleScheduleBuilder.simpleSchedule()
                        .withIntervalInMinutes(5)
                        .repeatForever())
                .build();

        JobDetail summaryJobDetail = JobBuilder.newJob(WeatherSummaryJob.class)
                .withIdentity("weatherSummaryJob", "group2")
                .build();

        Trigger summaryTrigger = TriggerBuilder.newTrigger()
                .withIdentity("summaryTrigger", "group2")
                .withSchedule(CronScheduleBuilder.dailyAtHourAndMinute(23, 50))
                .build();

        scheduler.scheduleJob(weatherJobDetail, weatherTrigger);
        scheduler.scheduleJob(summaryJobDetail, summaryTrigger);
        scheduler.start();

        return scheduler;
    }
}
