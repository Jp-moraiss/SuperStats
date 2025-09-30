package com.cesar.superstats.repository;

import com.cesar.superstats.dto.ContagemAlinhamentoDTO;
import com.cesar.superstats.dto.PersonagemNovoDTO;
import com.cesar.superstats.model.entities.Fa;
import com.cesar.superstats.model.entities.PersonagemNovo;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@Repository
public class PersonagemNovoRepository {

    private final JdbcTemplate jdbcTemplate;

    public PersonagemNovoRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final String BASE_SQL =
            "SELECT pn.*, f.id as fa_id, f.username as fa_username, f.email as fa_email, f.nome as fa_nome " +
                    "FROM Personagem_Novo pn " +
                    "LEFT JOIN Fa f ON pn.fa_criador_id = f.id ";

    private static class PersonagemNovoRowMapper implements RowMapper<PersonagemNovo> {
        @Override
        public PersonagemNovo mapRow(ResultSet rs, int rowNum) throws SQLException {
            PersonagemNovo pn = new PersonagemNovo();
            pn.setId(rs.getInt("id"));
            pn.setNome(rs.getString("nome"));
            pn.setAlinhamento(rs.getString("alinhamento"));
            pn.setAltura(rs.getObject("altura") != null ? rs.getDouble("altura") : null);
            pn.setPeso(rs.getObject("peso") != null ? rs.getDouble("peso") : null);
            pn.setPoder(rs.getString("poder"));
            pn.setGenero(rs.getString("genero"));

            if (rs.getObject("fa_criador_id") != null) {
                Fa criador = new Fa();
                criador.setId(rs.getInt("fa_id"));
                criador.setUsername(rs.getString("fa_username"));
                criador.setEmail(rs.getString("fa_email"));
                criador.setNome(rs.getString("fa_nome"));
                pn.setFaCriador(criador);
            }
            return pn;
        }
    }

    public List<PersonagemNovo> findAll() {
        return jdbcTemplate.query(BASE_SQL + "ORDER BY pn.id", new PersonagemNovoRowMapper());
    }

    public Optional<PersonagemNovo> findById(Integer id) {
        try {
            PersonagemNovo pn = jdbcTemplate.queryForObject(BASE_SQL + "WHERE pn.id = ?", new PersonagemNovoRowMapper(), id);
            return Optional.of(pn);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public List<PersonagemNovo> findByCreatorId(Integer creatorId) {
        String sql = BASE_SQL + "WHERE pn.fa_criador_id = ? ORDER BY pn.id";
        return jdbcTemplate.query(sql, new PersonagemNovoRowMapper(), creatorId);
    }

    public List<PersonagemNovo> findByAlinhamento(String alinhamento) {
        String sql = BASE_SQL + "WHERE LOWER(pn.alinhamento) = LOWER(?)";
        return jdbcTemplate.query(sql, new PersonagemNovoRowMapper(), alinhamento);
    }

    public List<ContagemAlinhamentoDTO> countByAlinhamento() {
        String sql = "SELECT alinhamento, COUNT(*) as total " +
                "FROM Personagem_Novo " +
                "WHERE alinhamento IS NOT NULL AND alinhamento != '' " +
                "GROUP BY alinhamento " +
                "ORDER BY total DESC";

        RowMapper<ContagemAlinhamentoDTO> rowMapper = (rs, rowNum) -> new ContagemAlinhamentoDTO(
                rs.getString("alinhamento"),
                rs.getLong("total")
        );

        return jdbcTemplate.query(sql, rowMapper);
    }

    public void save(PersonagemNovo personagem) {
        String sql = "INSERT INTO Personagem_Novo (nome, alinhamento, altura, peso, poder, genero, fa_criador_id) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql,
                personagem.getNome(),
                personagem.getAlinhamento(),
                personagem.getAltura(),
                personagem.getPeso(),
                personagem.getPoder(),
                personagem.getGenero(),
                personagem.getFaCriador().getId());
    }

    public void update(Integer id, PersonagemNovoDTO dto) {
        String sql = "UPDATE Personagem_Novo SET nome = ?, alinhamento = ?, altura = ?, peso = ?, poder = ?, genero = ? " +
                "WHERE id = ?";
        jdbcTemplate.update(sql,
                dto.getNome(),
                dto.getAlinhamento(),
                dto.getAltura(),
                dto.getPeso(),
                dto.getPoder(),
                dto.getGenero(),
                id);
    }

    public int deleteById(Integer id) {
        return jdbcTemplate.update("DELETE FROM Personagem_Novo WHERE id = ?", id);
    }
}