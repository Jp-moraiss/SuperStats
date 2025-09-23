package com.cesar.superstats.model.entities;// AlterEgos.java
import jakarta.persistence.*;

@Entity
public class AlterEgo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer alterEgosPK;

    private String alterEgoName;

    @ManyToOne
    @JoinColumn(name = "fk_Personagem_id")
    private Personagem personagem;

    // getters e setters
}
