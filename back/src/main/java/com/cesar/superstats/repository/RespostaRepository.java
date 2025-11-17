package com.cesar.superstats.repository;

import com.cesar.superstats.dto.ChartDataDTO;
import com.cesar.superstats.model.entities.Resposta;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
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

    public List<ChartDataDTO> getResultadosPorPergunta(Integer perguntaId) {
        String sql = """
            SELECT 
                p.nome AS nome, 
                COUNT(r.id) AS votos
            FROM Resposta r
            JOIN Personagem p ON r.fk_Personagem_id = p.id
            WHERE r.fk_Pergunta_id = ?
            GROUP BY p.nome
            ORDER BY votos DESC
        """;

        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(ChartDataDTO.class), perguntaId);
    }
}