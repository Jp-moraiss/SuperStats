package com.cesar.superstats.model.entities;// Fa.java
import jakarta.persistence.*;
import java.util.List;

@Entity
public class Fa {
    @Id
    private String email;

    private String nome;
    private String genero;
    private Integer idade;
    private String univFav;
    private Integer tempoGeek;
    private String ocupacao;

    @OneToMany(mappedBy = "fa", cascade = CascadeType.ALL)
    private List<Resposta> respostas;

    // Relações com eventos, filmes, HQs ficam em tabelas associativas
    // getters e setters
}
