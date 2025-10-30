package com.cesar.superstats.model.entities;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class Personagem {
    private Integer id;
    private String nome;
    private String genero;
    private Integer altura;
    private Integer peso;
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
    private String imagemUrl;

    private List<String> bases = new ArrayList<>();
    private List<String> alterEgos = new ArrayList<>();

}
