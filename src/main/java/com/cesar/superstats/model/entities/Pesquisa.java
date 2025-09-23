package com.cesar.superstats.model.entities;// Pesquisa.java
import jakarta.persistence.*;
import java.util.List;

@Entity
public class Pesquisa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idPesquisa;

    private String nome;

    @OneToMany(mappedBy = "pesquisa", cascade = CascadeType.ALL)
    private List<Pergunta> perguntas;

    // getters e setters
}
