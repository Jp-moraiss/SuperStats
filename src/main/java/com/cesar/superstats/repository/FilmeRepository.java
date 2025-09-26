package com.cesar.superstats.repository;

import com.cesar.superstats.dto.FilmeDTO;
import com.cesar.superstats.model.entities.Filme;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@Repository
public class FilmeRepository {

    private final JdbcTemplate jdbcTemplate;

    public FilmeRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Filme> findAll() {
        String sql = "SELECT * FROM filme";
        return jdbcTemplate.query(sql, new FilmeRowMapper());
    }

    public Optional<Filme> findById(Integer id) {
        String sql = "SELECT * FROM filme WHERE id = ?";
        try {
            Filme filme = jdbcTemplate.queryForObject(sql, new FilmeRowMapper(), id);
            return Optional.ofNullable(filme);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public List<Filme> findByTitle(String titulo) {
        String sql = "SELECT * FROM filme WHERE LOWER(titulo) LIKE LOWER(?)";
        return jdbcTemplate.query(
                sql,
                new FilmeRowMapper(),
                "%" + titulo + "%"
        );
    }

    public List<Filme> findByProdutora(String produtora) {
        String sql = "SELECT * FROM filme WHERE produtora = ?";
        return jdbcTemplate.query(sql, new FilmeRowMapper(), produtora);
    }

    public void save(Filme filme) {
        String sql = "INSERT INTO filme (titulo, produtora, diretor, data_lancamento) VALUES (?, ?, ?, ?)";
        jdbcTemplate.update(sql,
                filme.getTitulo(),
                filme.getProdutora(),
                filme.getDiretor(),
                filme.getDataLancamento() != null ? new java.sql.Date(filme.getDataLancamento().getTime()) : null
        );
    }

    public void update(Integer id, FilmeDTO filme) {
        String sql = "UPDATE filme SET titulo = ?, produtora = ?, diretor = ?, data_lancamento = ? WHERE id = ?";
        jdbcTemplate.update(sql,
                filme.getTitulo(),
                filme.getProdutora(),
                filme.getDiretor(),
                filme.getDataLancamento() != null ? new java.sql.Date(filme.getDataLancamento().getTime()) : null,
                id
        );
    }

    public void deleteById(Integer id) {
        String sql = "DELETE FROM filme WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    public boolean existsById(Integer id) {
        String sql = "SELECT COUNT(*) FROM filme WHERE id = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, id);
        return count != null && count > 0;
    }

    private static class FilmeRowMapper implements RowMapper<Filme> {
        @Override
        public Filme mapRow(ResultSet rs, int rowNum) throws SQLException {
            Filme filme = new Filme();
            filme.setId(rs.getInt("id"));
            filme.setTitulo(rs.getString("titulo"));
            filme.setProdutora(rs.getString("produtora"));
            filme.setDiretor(rs.getString("diretor"));
            filme.setDataLancamento(rs.getDate("data_lancamento")); // corrigido
            return filme;
        }
    }
}

