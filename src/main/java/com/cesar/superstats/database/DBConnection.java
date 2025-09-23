package com.cesar.superstats.database;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class DBConnection {

    private static final String SCHEMA = "superstats";
    private static final String BASE_URL = "jdbc:mysql://localhost/";
    private static final String FULL_URL = BASE_URL + SCHEMA;

    public static Connection getConnection() throws SQLException {
        String user = System.getenv("MYSQL_USER");
        String password = System.getenv("MYSQL_PASSWORD");

        if (user == null || password == null) {
            throw new SQLException("Variáveis de ambiente MYSQL_USER ou MYSQL_PASSWORD não definidas.");
        }

        // 1) Conecta sem schema
        try (Connection conn = DriverManager.getConnection(BASE_URL, user, password);
             Statement stmt = conn.createStatement()) {
            // 2) Cria o schema se não existir
            stmt.executeUpdate("CREATE DATABASE IF NOT EXISTS " + SCHEMA);
        }

        // 3) Retorna conexão já com schema selecionado
        return DriverManager.getConnection(FULL_URL, user, password);
    }
}
