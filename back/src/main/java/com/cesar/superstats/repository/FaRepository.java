package com.cesar.superstats.repository;

import com.cesar.superstats.dto.*;
import com.cesar.superstats.model.entities.Fa;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Repository
public class FaRepository {

    private final JdbcTemplate jdbcTemplate;

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

    public void save(Fa fa) {
        String sql = "INSERT INTO Fa (username, email, nome, password, genero, idade, univ_fav, tempo_geek, ocupacao) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql,
                fa.getUsername(),
                fa.getEmail(),
                fa.getNome(),
                fa.getPassword(),
                fa.getGenero(),
                fa.getIdade(),
                fa.getUniv_fav(),
                fa.getTempo_geek(),
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

    public List<Fa> findFasByTituloFilmeAssistido(String tituloFilme) {
        String sql = "SELECT * FROM Fa WHERE id IN " +
                "  (SELECT fk_Fa_id FROM Consome_Filme WHERE fk_Filme_id = " +
                "      (SELECT id FROM Filme WHERE LOWER(titulo) = LOWER(?))" +
                "  )";

        return jdbcTemplate.query(sql, new FaRowMapper(), tituloFilme);
    }

    public List<FaConsumoDTO> findPerfilDeConsumoDosFas() {
        String sql =
                "WITH " +
                        "  FilmesConsumidos AS (SELECT DISTINCT fk_Fa_id FROM Consome_Filme), " +
                        "  HQsConsumidas AS (SELECT DISTINCT fk_Fa_id FROM Consome_HQ) " +

                        "SELECT " +
                        "  f.id as fa_id, f.username, f.nome, " +
                        "  CASE WHEN hc.fk_Fa_id IS NOT NULL THEN 'Ambos' ELSE 'Apenas Filmes' END as tipo_consumo " +
                        "FROM FilmesConsumidos fc " +
                        "LEFT JOIN HQsConsumidas hc ON fc.fk_Fa_id = hc.fk_Fa_id " +
                        "JOIN Fa f ON f.id = fc.fk_Fa_id " +

                        "UNION " +

                        "SELECT " +
                        "  f.id as fa_id, f.username, f.nome, 'Apenas HQs' as tipo_consumo " +
                        "FROM FilmesConsumidos fc " +
                        "RIGHT JOIN HQsConsumidas hc ON fc.fk_Fa_id = hc.fk_Fa_id " +
                        "JOIN Fa f ON f.id = hc.fk_Fa_id " +
                        "WHERE fc.fk_Fa_id IS NULL " + // A condição que isola os fãs "Apenas HQs"

                        "ORDER BY tipo_consumo, username";

        RowMapper<FaConsumoDTO> rowMapper = (rs, rowNum) -> new FaConsumoDTO(
                rs.getInt("fa_id"),
                rs.getString("username"),
                rs.getString("nome"),
                rs.getString("tipo_consumo")
        );

        return jdbcTemplate.query(sql, rowMapper);
    }

    public Optional<PerfilAtividadeFaDTO> findPerfilAtividadeById(Integer faId) {
        String sql = "SELECT * FROM vw_perfil_atividade_fa WHERE fa_id = ?";

        try {
            PerfilAtividadeFaDTO perfil = jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(PerfilAtividadeFaDTO.class), faId);
            return Optional.ofNullable(perfil);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public Optional<PerfilViewDTO> findPerfilCompletoById(Integer faId) {
        String sql = "SELECT * FROM vw_perfil_completo_fa WHERE fa_id = ?";
        try {
            return Optional.ofNullable(jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(PerfilViewDTO.class), faId));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public String getPerfilDeConsumoPorId(Integer faId) {
        String sql = "SELECT fn_calcula_perfil_consumo(?)";
        return jdbcTemplate.queryForObject(sql, String.class, faId);
    }

    private static class FaRowMapper implements RowMapper<Fa> {
        @Override
        public Fa mapRow(ResultSet rs, int rowNum) throws SQLException {
            Fa fa = new Fa();
            fa.setId(rs.getInt("id"));
            fa.setUsername(rs.getString("username"));
            fa.setEmail(rs.getString("email"));
            fa.setNome(rs.getString("nome"));
            fa.setPassword(rs.getString("password"));
            fa.setGenero(rs.getString("genero"));
            fa.setIdade(rs.getInt("idade"));
            fa.setUniv_fav(rs.getString("univ_fav"));
            fa.setTempo_geek(rs.getInt("tempo_geek"));
            fa.setOcupacao(rs.getString("ocupacao"));
            return fa;
        }
    }
}

