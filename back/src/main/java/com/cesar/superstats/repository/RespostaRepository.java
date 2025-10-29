package com.cesar.superstats.repository;

import com.cesar.superstats.model.entities.Resposta;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class RespostaRepository {

    private final JdbcTemplate jdbcTemplate;
    public RespostaRepository(JdbcTemplate jdbcTemplate) { this.jdbcTemplate = jdbcTemplate; }

    public void save(Resposta resposta) {
        String sql = "INSERT INTO Resposta (fk_Personagem_id, fk_Fa_id, fk_Pergunta_id, data_resposta) VALUES (?, ?, ?, ?)";
        jdbcTemplate.update(sql,
                resposta.getPersonagem().getId(),
                resposta.getFa().getId(),
                resposta.getPergunta().getId(),
                resposta.getDataResposta()
        );
    }
}