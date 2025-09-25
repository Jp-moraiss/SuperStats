package com.cesar.superstats.model.entities;// AlterEgos.java
import lombok.Data;

@Data
public class AlterEgo {

    private Integer alterEgosPK;
    private String alterEgoName;
    private Personagem personagem;

}
