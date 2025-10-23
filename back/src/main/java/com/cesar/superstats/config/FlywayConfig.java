package com.cesar.superstats.config;

import org.flywaydb.core.Flyway;
import org.springframework.boot.autoconfigure.flyway.FlywayMigrationStrategy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FlywayConfig {

    @Bean
    public FlywayMigrationStrategy repairStrategy() {
        return flyway -> {
            // Repara o schema do Flyway (limpa o estado de falha)
            flyway.repair();
            // Continua com a migração normal
            flyway.migrate();
        };
    }
}