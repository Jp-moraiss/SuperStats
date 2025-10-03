package com.cesar.superstats.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class HQDTO {

    private String titulo;
    private String edicao;
    private String editora;
    private LocalDate dataLancamento;
}
