package com.cesar.superstats.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class ConquistaRepository {

    private final JdbcTemplate jdbcTemplate;

    public ConquistaRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void callSpAtualizaConquistasLeitor(Integer faId) {
        jdbcTemplate.update("CALL sp_atualiza_conquistas_leitor_por_fa(?)", faId);
    }

    public void callSpAtualizaConquistasCinefilo(Integer faId) {
        jdbcTemplate.update("CALL sp_atualiza_conquistas_cinefilo_por_fa(?)", faId);
    }
}