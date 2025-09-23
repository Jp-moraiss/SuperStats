package com.cesar.superstats.model.entities;// PersonagemNovo.java
import jakarta.persistence.*;

@Entity
public class PersonagemNovo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String nome;
    private String alinhamento;
    private Double altura;
    private Double peso;
    private String poder;
    private String genero;

    @ManyToOne
    @JoinColumn(name = "fa_criador")
    private Fa faCriador;

    // getters e setters
}
