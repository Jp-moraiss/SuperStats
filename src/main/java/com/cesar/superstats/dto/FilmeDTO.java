package com.cesar.superstats.dto;

import lombok.Data;

import java.util.Date;

@Data
public class FilmeDTO {

    private String titulo;
    private String produtora;
    private String diretor;
    private Date dataLancamento;
}
