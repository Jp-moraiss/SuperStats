package com.cesar.superstats.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class FaDTO {

    private String username;
    private String email;
    private String nome;
    private String password;
    private String genero;
    private LocalDate dataNascimento;
    private String univ_fav;
    private Integer tempoGeek;
    private String ocupacao;
}
