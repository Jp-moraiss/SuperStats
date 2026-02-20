package com.cesar.superstats;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.flyway.FlywayMigrationStrategy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;

@SpringBootApplication
public class SuperStatsApplication {

	public static void main(String[] args) {
		SpringApplication.run(SuperStatsApplication.class, args);
	}

}