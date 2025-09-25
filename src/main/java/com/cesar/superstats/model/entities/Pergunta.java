package com.cesar.superstats.model.entities;// Pergunta.java
import lombok.Data;

@Data
public class Pergunta {
    private Integer id;
    private String tipo;
    private Pesquisa pesquisa;

}
