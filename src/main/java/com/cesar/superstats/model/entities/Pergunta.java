package com.cesar.superstats.model.entities;// Pergunta.java
import jakarta.persistence.*;

@Entity
public class Pergunta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String tipo;

    @ManyToOne
    @JoinColumn(name = "fk_Pesquisa_id")
    private Pesquisa pesquisa;

    // getters e setters
}
