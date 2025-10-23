package com.cesar.superstats.repository;

import com.cesar.superstats.model.entities.Personagem;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@Repository
public class PersonagemRepository {

    private final JdbcTemplate jdbcTemplate;

    public PersonagemRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void save(Personagem personagem) {
        String sql = "INSERT INTO Personagem (id, nome, genero, altura, peso, ocupacao, raca, nome_completo, " +
                "naturalidade, primeira_aparicao, editora, alinhamento, inteligencia, forca, " +
                "velocidade, durabilidade, poder, combate, imagem_url) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        jdbcTemplate.update(sql,
                personagem.getId(), personagem.getNome(), personagem.getGenero(),
                personagem.getAltura(), personagem.getPeso(), personagem.getOcupacao(),
                personagem.getRaca(), personagem.getNomeCompleto(), personagem.getNaturalidade(),
                personagem.getPrimeiraAparicao(), personagem.getEditora(), personagem.getAlinhamento(),
                personagem.getInteligencia(), personagem.getForca(), personagem.getVelocidade(),
                personagem.getDurabilidade(), personagem.getPoder(), personagem.getCombate(),
                personagem.getImagemUrl()
        );
    }

    public List<Personagem> findAll() {
        return jdbcTemplate.query("SELECT * FROM Personagem ORDER BY nome", new PersonagemRowMapper());
    }

    public Optional<Personagem> findById(Integer id) {
        try {
            Personagem p = jdbcTemplate.queryForObject("SELECT * FROM Personagem WHERE id = ?", new PersonagemRowMapper(), id);
            return Optional.ofNullable(p);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    private static class PersonagemRowMapper implements RowMapper<Personagem> {
        @Override
        public Personagem mapRow(ResultSet rs, int rowNum) throws SQLException {
            Personagem p = new Personagem();
            p.setId(rs.getInt("id"));
            p.setNome(rs.getString("nome"));
            p.setGenero(rs.getString("genero"));
            p.setAltura(rs.getObject("altura") != null ? rs.getInt("altura") : null);
            p.setPeso(rs.getObject("peso") != null ? rs.getInt("peso") : null);
            p.setOcupacao(rs.getString("ocupacao"));
            p.setRaca(rs.getString("raca"));
            p.setNomeCompleto(rs.getString("nome_completo"));
            p.setNaturalidade(rs.getString("naturalidade"));
            p.setPrimeiraAparicao(rs.getString("primeira_aparicao"));
            p.setEditora(rs.getString("editora"));
            p.setAlinhamento(rs.getString("alinhamento"));
            p.setInteligencia(rs.getObject("inteligencia") != null ? rs.getInt("inteligencia") : null);
            p.setForca(rs.getObject("forca") != null ? rs.getInt("forca") : null);
            p.setVelocidade(rs.getObject("velocidade") != null ? rs.getInt("velocidade") : null);
            p.setDurabilidade(rs.getObject("durabilidade") != null ? rs.getInt("durabilidade") : null);
            p.setPoder(rs.getObject("poder") != null ? rs.getInt("poder") : null);
            p.setCombate(rs.getObject("combate") != null ? rs.getInt("combate") : null);
            p.setImagemUrl(rs.getString("imagem_url"));

            return p;
        }
    }
}