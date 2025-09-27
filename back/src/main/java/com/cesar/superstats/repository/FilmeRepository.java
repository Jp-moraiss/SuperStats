package com.cesar.superstats.repository;

import com.cesar.superstats.dto.FilmeDTO;
import com.cesar.superstats.model.entities.Filme;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate; // Importe LocalDate
import java.util.List;
import java.util.Optional;

@Repository
public class FilmeRepository {

    private final JdbcTemplate jdbcTemplate;

    public FilmeRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Filme> findAll(Integer faId) {
        String sql = "SELECT f.*, (cf.fk_Fa_id IS NOT NULL) AS assistido " +
                "FROM Filme f " +
                "LEFT JOIN Consome_Filme cf ON f.id = cf.fk_Filme_id AND cf.fk_Fa_id = ? " +
                "ORDER BY f.id";
        return jdbcTemplate.query(sql, new FilmeRowMapper(), faId);
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
                filme.getDataLancamento()
        );
    }

    public void update(Integer id, FilmeDTO filme) {
        String sql = "UPDATE filme SET titulo = ?, produtora = ?, diretor = ?, data_lancamento = ? WHERE id = ?";
        jdbcTemplate.update(sql,
                filme.getTitulo(),
                filme.getProdutora(),
                filme.getDiretor(),
                filme.getDataLancamento(),
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

    public List<String> findAllProdutoras() {
        String sql = "SELECT DISTINCT produtora FROM filme WHERE produtora IS NOT NULL AND produtora != '' ORDER BY produtora ASC";
        return jdbcTemplate.queryForList(sql, String.class);
    }

    public void marcarComoAssistido(Integer faId, Integer filmeId) {
        String checkSql = "SELECT COUNT(*) FROM Consome_Filme WHERE fk_Fa_id = ? AND fk_Filme_id = ?";
        Integer count = jdbcTemplate.queryForObject(checkSql, Integer.class, faId, filmeId);
        if (count != null && count > 0) {
            System.out.println("Relação já existe. Nenhuma ação tomada.");
            return;
        }

        String insertSql = "INSERT INTO Consome_Filme (fk_Fa_id, fk_Filme_id) VALUES (?, ?)";
        jdbcTemplate.update(insertSql, faId, filmeId);
    }

    public void removerDosAssistidos(Integer faId, Integer filmeId) {
        String sql = "DELETE FROM Consome_Filme WHERE fk_Fa_id = ? AND fk_Filme_id = ?";
        jdbcTemplate.update(sql, faId, filmeId);
    }

    public List<Filme> findAssistidosByFaId(Integer faId) {
        String sql = "SELECT f.* FROM Filme f " +
                "JOIN Consome_Filme cf ON f.id = cf.fk_Filme_id " +
                "WHERE cf.fk_Fa_id = ?";
        return jdbcTemplate.query(sql, new FilmeRowMapper(), faId);
    }

    private static class FilmeRowMapper implements RowMapper<Filme> {
        @Override
        public Filme mapRow(ResultSet rs, int rowNum) throws SQLException {
            Filme filme = new Filme();
            filme.setId(rs.getInt("id"));
            filme.setTitulo(rs.getString("titulo"));
            filme.setProdutora(rs.getString("produtora"));
            filme.setDiretor(rs.getString("diretor"));
            filme.setDataLancamento(rs.getObject("data_lancamento", LocalDate.class));

            if (rs.getMetaData().getColumnCount() > 5) {
                filme.setAssistido(rs.getBoolean("assistido"));
            }

            return filme;
        }
    }
}