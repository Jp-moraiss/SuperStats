package com.cesar.superstats.repository;

import com.cesar.superstats.model.entities.Resposta;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@RequiredArgsConstructor
@Repository
public class RespostaRepository {

    private final JdbcTemplate jdbcTemplate;

    public Optional<Integer> findIdByFaAndPergunta(Integer faId, Integer perguntaId) {
        String sql = "SELECT id FROM Resposta WHERE fk_Fa_id = ? AND fk_Pergunta_id = ?";
        try {
            Integer id = jdbcTemplate.queryForObject(sql, Integer.class, faId, perguntaId);
            return Optional.ofNullable(id);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public void save(Resposta resposta) {
        String sql = "INSERT INTO Resposta (fk_Personagem_id, fk_Fa_id, fk_Pergunta_id, data_resposta) VALUES (?, ?, ?, ?)";
        jdbcTemplate.update(sql,
                resposta.getPersonagem().getId(),
                resposta.getFa().getId(),
                resposta.getPergunta().getId(),
                resposta.getDataResposta()
        );
    }

    public void update(Resposta resposta) {
        String sql = "UPDATE Resposta SET fk_Personagem_id = ?, data_resposta = ? WHERE id = ?";
        jdbcTemplate.update(sql,
                resposta.getPersonagem().getId(),
                resposta.getDataResposta(),
                resposta.getId()
        );
    }
}