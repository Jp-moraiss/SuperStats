package com.cesar.superstats.dto;

import lombok.Data;

@Data
public class PopularidadeEmpresaDTO {
    private String empresaNome;
    private String tipoMidia;
    private long totalConsumido;
}