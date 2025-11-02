package com.cesar.superstats.dto;// Em PerfilViewDTO.java

import lombok.Data;

@Data
public class PerfilViewDTO {
    private Integer faId;
    private String username, nome, genero, ocupacao, univFav;
    private Integer idade;
    private String tempoGeekFormatado;
    private String perfilConsumo;
    private String filmesAssistidosJson;
    private String hqsLidasJson;
    private String conquistas;

}