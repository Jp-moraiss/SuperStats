package com.cesar.superstats.repository;

import com.cesar.superstats.dto.HQDTO;
import com.cesar.superstats.model.entities.HQ;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public class HQRepository {

    private final JdbcTemplate jdbcTemplate;

    public HQRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<HQ> findAll(Integer faId) {
        String sql = "SELECT h.*, (ch.fk_Fa_id IS NOT NULL) AS lido " +
                "FROM HQ h " +
                "LEFT JOIN Consome_HQ ch ON h.id = ch.fk_HQ_id AND ch.fk_Fa_id = ? " +
                "ORDER BY h.id";
        return jdbcTemplate.query(sql, new HQRowMapper(), faId);
    }

    public Optional<HQ> findById(Integer id) {
        String sql = "SELECT * FROM hq WHERE id = ?";
        try {
            HQ hq = jdbcTemplate.queryForObject(sql, new HQRowMapper(), id);
            return Optional.ofNullable(hq);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public List<HQ> findByTitle(String titulo) {
        String sql = "SELECT * FROM hq WHERE LOWER(titulo) LIKE LOWER(?)";
        return jdbcTemplate.query(sql, new HQRowMapper(), "%" + titulo + "%");
    }

    public List<HQ> findByEditora(String editora) {
        String sql = "SELECT * FROM hq WHERE editora = ?";
        return jdbcTemplate.query(sql, new HQRowMapper(), editora);
    }

    public void save(HQ hq) {
        String sql = "INSERT INTO hq (titulo, edicao, editora, data_lancamento) VALUES (?, ?, ?, ?)";
        jdbcTemplate.update(sql,
                hq.getTitulo(),
                hq.getEdicao(),
                hq.getEditora(),
                hq.getDataLancamento()
        );
    }

    public void update(Integer id, HQDTO hq) {
        String sql = "UPDATE hq SET titulo = ?, edicao = ?, editora = ?, data_lancamento = ? WHERE id = ?";
        jdbcTemplate.update(sql,
                hq.getTitulo(),
                hq.getEdicao(),
                hq.getEditora(),
                hq.getDataLancamento(),
                id
        );
    }

    public void deleteById(Integer id) {
        String sql = "DELETE FROM hq WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    public boolean existsById(Integer id) {
        String sql = "SELECT COUNT(*) FROM hq WHERE id = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, id);
        return count != null && count > 0;
    }

    public List<String> findAllEditoras() {
        String sql = "SELECT DISTINCT editora FROM hq WHERE editora IS NOT NULL AND editora != '' ORDER BY editora ASC";
        return jdbcTemplate.queryForList(sql, String.class);
    }

    public void marcarComoLido(Integer faId, Integer hqId) {
        String checkSql = "SELECT COUNT(*) FROM Consome_HQ WHERE fk_Fa_id = ? AND fk_HQ_id = ?";
        Integer count = jdbcTemplate.queryForObject(checkSql, Integer.class, faId, hqId);
        if (count != null && count > 0) {
            return;
        }
        String insertSql = "INSERT INTO Consome_HQ (fk_Fa_id, fk_HQ_id) VALUES (?, ?)";
        jdbcTemplate.update(insertSql, faId, hqId);
    }

    public void removerDosLidos(Integer faId, Integer hqId) {
        String sql = "DELETE FROM Consome_HQ WHERE fk_Fa_id = ? AND fk_HQ_id = ?";
        jdbcTemplate.update(sql, faId, hqId);
    }

    public List<HQ> findLidosByFaId(Integer faId) {
        String sql = "SELECT h.* FROM HQ h " +
                "JOIN Consome_HQ ch ON h.id = ch.fk_HQ_id " +
                "WHERE ch.fk_Fa_id = ?";
        return jdbcTemplate.query(sql, new HQRowMapper(), faId);
    }

    private static class HQRowMapper implements RowMapper<HQ> {
        @Override
        public HQ mapRow(ResultSet rs, int rowNum) throws SQLException {
            HQ hq = new HQ();
            hq.setId(rs.getInt("id"));
            hq.setTitulo(rs.getString("titulo"));
            hq.setEdicao(rs.getString("edicao"));
            hq.setEditora(rs.getString("editora"));
            hq.setDataLancamento(rs.getObject("data_lancamento", LocalDate.class));

            try {
                hq.setLido(rs.getBoolean("lido"));
            } catch (SQLException e) {
            }

            return hq;
        }
    }
}