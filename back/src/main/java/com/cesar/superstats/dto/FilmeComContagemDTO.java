package com.cesar.superstats.dto;

import com.cesar.superstats.model.entities.Filme;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FilmeComContagemDTO {
    private Filme filme;
    private long totalAssistido;

}