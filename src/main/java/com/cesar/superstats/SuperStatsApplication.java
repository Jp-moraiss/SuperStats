package com.cesar.superstats;

import javax.sql.DataSource;
import org.flywaydb.core.Flyway;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class SuperStatsApplication {

	public static void main(String[] args) {
		SpringApplication.run(SuperStatsApplication.class, args);
	}
}