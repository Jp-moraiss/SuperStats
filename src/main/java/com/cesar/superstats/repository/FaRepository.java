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

    public Optional<Fa> findById(Integer id) {
        String sql = "SELECT * FROM Fa WHERE id = ?";
        try {
            Fa result = jdbcTemplate.queryForObject(sql, new FaRowMapper(), id);
            return Optional.ofNullable(result);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
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

    public Optional<Fa> findByUsername(String username) {
        String sql = "SELECT * FROM Fa WHERE username = ?";
        try {
            Fa result = jdbcTemplate.queryForObject(sql, new FaRowMapper(), username);
            return Optional.ofNullable(result);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public List<Fa> findAll() {
        String sql = "SELECT * FROM Fa ORDER BY id";
        return jdbcTemplate.query(sql, new FaRowMapper());
    }

    public void save(FaDTO fa) {
        String sql = "INSERT INTO Fa (username, email, nome, genero, idade, univ_fav, tempo_geek, ocupacao) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql,
                fa.getUsername(),
                fa.getEmail(),
                fa.getNome(),
                fa.getGenero(),
                fa.getIdade(),
                fa.getUniv_fav(),
                fa.getTempoGeek(),
                fa.getOcupacao());
    }

    public void update(Integer id, FaDTO fa) {
        String sql = "UPDATE Fa SET username = ?, nome = ?, genero = ?, idade = ?, univ_fav = ?, tempo_geek = ?, ocupacao = ? WHERE id = ?";
        jdbcTemplate.update(sql,
                fa.getUsername(),
                fa.getNome(),
                fa.getGenero(),
                fa.getIdade(),
                fa.getUniv_fav(),
                fa.getTempoGeek(),
                fa.getOcupacao(),
                id);
    }

    public void deleteById(Integer id) {
        String sql = "DELETE FROM Fa WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    private static class FaRowMapper implements RowMapper<Fa> {
        @Override
        public Fa mapRow(ResultSet rs, int rowNum) throws SQLException {
            Fa fa = new Fa();
            fa.setId(rs.getInt("id"));
            fa.setUsername(rs.getString("username"));
            fa.setEmail(rs.getString("email"));
            fa.setNome(rs.getString("nome"));
            fa.setGenero(rs.getString("genero"));
            fa.setIdade(rs.getInt("idade"));
            fa.setUniv_fav(rs.getString("univ_fav"));
            fa.setTempo_geek(rs.getInt("tempo_geek"));
            fa.setOcupacao(rs.getString("ocupacao"));
            return fa;
        }
    }
}

