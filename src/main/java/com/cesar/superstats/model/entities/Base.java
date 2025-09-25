package com.cesar.superstats.model.entities;// Base.java
import lombok.Data;

@Data
public class Base {
    private Integer basePK;
    private String nomeBase;
    private Personagem personagem;

}
