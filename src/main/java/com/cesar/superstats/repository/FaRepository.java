package com.cesar.superstats.repository;

import com.cesar.superstats.dto.FaDTO;
import com.cesar.superstats.model.entities.Fa;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@Repository
public class FaRepository {

    private final JdbcTemplate jdbcTemplate;

    public FaRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Optional<Fa> findByEmail(String email) {
        String sql = "SELECT * FROM Fa WHERE email = ?";
        try {
            Fa result = jdbcTemplate.queryForObject(sql, new FaRowMapper(), email);
            return Optional.ofNullable(result);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public List<Fa> findAll() {
        String sql = "SELECT * FROM Fa ORDER BY email";
        return jdbcTemplate.query(sql, new FaRowMapper());
    }

    public void save(FaDTO fa) {
        String sql = "INSERT INTO Fa (email, nome, genero, idade, univ_fav, tempo_geek, ocupacao) VALUES (?, ?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql,
                fa.getEmail(),
                fa.getNome(),
                fa.getGenero(),
                fa.getIdade(),
                fa.getUniv_fav(),
                fa.getTempoGeek(),
                fa.getOcupacao());
    }

    public void update(String email, FaDTO fa) {
        String sql = "UPDATE Fa SET nome = ?, genero = ?, idade = ?, univ_fav = ?, tempo_geek = ?, ocupacao = ? WHERE email = ?";
        jdbcTemplate.update(sql,
                fa.getNome(),
                fa.getGenero(),
                fa.getIdade(),
                fa.getUniv_fav(),
                fa.getTempoGeek(),
                fa.getOcupacao(),
                email);
    }

    public void deleteByEmail(String email) {
        String sql = "DELETE FROM Fa WHERE email = ?";
        jdbcTemplate.update(sql, email);
    }

    private static class FaRowMapper implements RowMapper<Fa> {
        @Override
        public Fa mapRow(ResultSet rs, int rowNum) throws SQLException {
            Fa fa = new Fa();
            fa.setEmail(rs.getString("email"));
            fa.setNome(rs.getString("nome"));
            fa.setGenero(rs.getString("genero"));
            fa.setIdade(rs.getInt("idade"));
            fa.setUniv_fav(rs.getString("univ_fav"));
            fa.setTempo_geek(rs.getInt("tempo_geek"));
            fa.setOcupacao(rs.getString("ocupacao"));
            // a lista de respostas pode ser preenchida em outro repository
            return fa;
        }
    }
}
