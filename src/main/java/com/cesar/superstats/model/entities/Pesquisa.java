package com.cesar.superstats.model.entities;// Pesquisa.java
import lombok.Data;

import java.util.List;

@Data
public class Pesquisa {

    private Integer idPesquisa;
    private String nome;
    private List<Pergunta> perguntas;

}
