package com.cesar.superstats.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class FilmeDTO {

    private String titulo;
    private String produtora;
    private String diretor;
    private LocalDate dataLancamento;
}
