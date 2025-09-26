package com.cesar.superstats.model.entities;
import lombok.Data;

import java.util.List;

@Data
public class Fa {

    private Integer id;
    private String username;
    private String email;
    private String nome;
    private String genero;
    private Integer idade;
    private String univ_fav;
    private Integer tempo_geek;
    private String ocupacao;
    private List<Resposta> respostas;

}
