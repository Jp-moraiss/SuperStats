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

	/**
	 * Este Bean executa a lógica do Flyway assim que a aplicação Spring Boot inicia.
	 * Ele injeta o DataSource configurado pelo Spring para usar no Flyway.
	 */
	@Bean
	public CommandLineRunner flywayInitializer(DataSource dataSource) {
		return args -> {
			System.out.println("Executando Flyway clean e migrate...");

			Flyway flyway = Flyway.configure()
					.dataSource(dataSource) // Usa a fonte de dados gerenciada pelo Spring
					.cleanDisabled(false)   // Permite a execução do clean
					.load();

			// Executa as operações
			flyway.clean();
			flyway.migrate();

			System.out.println("Flyway executado com sucesso.");
		};
	}
}