package com.cesar.superstats.model.entities;// Base.java
import jakarta.persistence.*;

@Entity
public class Base {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer basePK;

    private String nomeBase;

    @ManyToOne
    @JoinColumn(name = "fk_id_personagem")
    private Personagem personagem;

    // getters e setters
}
