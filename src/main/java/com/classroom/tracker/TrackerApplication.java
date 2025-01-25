package com.classroom.tracker;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class TrackerApplication {

	public static void main(String[] args) {
		SpringApplication.run(TrackerApplication.class, args);
	}

	// Calling loadData() manually when the application starts
	@Bean
	public CommandLineRunner loadData(DataLoader dataLoader) {
		return args -> dataLoader.loadData();
	}

}
