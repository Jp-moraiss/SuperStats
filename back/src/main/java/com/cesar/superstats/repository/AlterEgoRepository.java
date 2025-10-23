package com.cesar.superstats.repository;

import com.cesar.superstats.model.entities.AlterEgo;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@RequiredArgsConstructor
@Repository
public class AlterEgoRepository {

    private final JdbcTemplate jdbcTemplate;

    public void save(AlterEgo alterEgo) {
        String sql = "INSERT INTO Alter_Egos (alter_ego_name, fk_Personagem_id) VALUES (?, ?)";
        jdbcTemplate.update(sql,
                alterEgo.getAlterEgoName(),
                alterEgo.getPersonagem().getId());
    }
}