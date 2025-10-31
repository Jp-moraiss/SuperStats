package com.cesar.superstats.dto;

import lombok.Data;

@Data
public class PerfilViewDTO {
    private Integer faId;
    private String username, nome, genero, ocupacao, univFav;
    private Integer idade, tempoGeek;
    private String filmesAssistidosJson;
    private String hqsLidasJson;
}