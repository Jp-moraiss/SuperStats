package com.cesar.superstats.model.entities;// Personagem.java
import jakarta.persistence.*;
import java.util.List;

@Entity
public class Personagem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String nome;
    private String genero;
    private Double altura;
    private Double peso;
    private String ocupacao;
    private String raca;
    private String nomeCompleto;
    private String naturalidade;
    private String primeiraAparicao;
    private String editora;
    private String alinhamento;
    private Integer inteligencia;
    private Integer forca;
    private Integer velocidade;
    private Integer durabilidade;
    private Integer poder;
    private Integer combate;

    @OneToMany(mappedBy = "personagem", cascade = CascadeType.ALL)
    private List<Base> bases;

    @OneToMany(mappedBy = "personagem", cascade = CascadeType.ALL)
    private List<AlterEgo> alterEgos;

    // Conexões e participações ficam em tabelas próprias
    // getters e setters
}
