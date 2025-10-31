package com.cesar.superstats.repository;

import com.cesar.superstats.model.entities.Pergunta;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@RequiredArgsConstructor
@Repository
public class PerguntaRepository {

    private final JdbcTemplate jdbcTemplate;

    public List<Pergunta> findByPesquisaId(int pesquisaId) {
        String sql = "SELECT * FROM Pergunta WHERE fk_Pesquisa_id = ?";
        return jdbcTemplate.query(sql, new PerguntaRowMapper(), pesquisaId);
    }

    private static class PerguntaRowMapper implements RowMapper<Pergunta> {
        @Override
        public Pergunta mapRow(ResultSet rs, int rowNum) throws SQLException {
            Pergunta p = new Pergunta();
            p.setId(rs.getInt("id"));
            p.setTipo(rs.getString("tipo"));
            p.setTextoPergunta(rs.getString("texto_pergunta"));
            return p;
        }
    }
}