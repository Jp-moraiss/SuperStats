package com.cesar.superstats.model.entities;
import lombok.Data;

@Data
public class Pergunta {
    private Integer id;
    private String tipo;
    private Pesquisa pesquisa;

}
