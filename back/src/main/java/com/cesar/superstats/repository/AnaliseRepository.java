package com.cesar.superstats.repository;

import com.cesar.superstats.dto.PopularidadeEmpresaDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@RequiredArgsConstructor
@Repository
public class AnaliseRepository {

    private final JdbcTemplate jdbcTemplate;

    public List<PopularidadeEmpresaDTO> findPopularidadeEmpresas() {
        String sql = "SELECT * FROM vw_popularidade_empresas ORDER BY total_consumido DESC";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(PopularidadeEmpresaDTO.class));
    }
}