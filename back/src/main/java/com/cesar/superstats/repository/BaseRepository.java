package com.cesar.superstats.repository;

import com.cesar.superstats.model.entities.Base;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@RequiredArgsConstructor
@Repository
public class BaseRepository {

    private final JdbcTemplate jdbcTemplate;

    public void save(Base base) {
        String sql = "INSERT INTO Base (nome_base, fk_id_personagem) VALUES (?, ?)";
        jdbcTemplate.update(sql,
                base.getNomeBase(),
                base.getPersonagem().getId());
    }
}