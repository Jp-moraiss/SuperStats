package com.cesar.superstats.dto;

import lombok.Data;

@Data
public class PerfilAtividadeFaDTO {
    private Integer faId;
    private String username;
    private String nome;
    private String genero;
    private Integer idade;
    private String univ_fav;
    private Integer tempoGeek;
    private String ocupacao;
    private long totalFilmesAssistidos;
    private long totalHqsLidas;
    private long totalPersonagensCriados;

}