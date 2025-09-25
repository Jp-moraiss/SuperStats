package com.cesar.superstats.model.entities;// PersonagemNovo.java
import lombok.Data;

@Data
public class PersonagemNovo {

    private Integer id;
    private String nome;
    private String alinhamento;
    private Double altura;
    private Double peso;
    private String poder;
    private String genero;
    private Fa faCriador;

}
