package com.cesar.superstats.model.entities;// Evento.java
import jakarta.persistence.*;
import java.util.Date;

@Entity
public class Evento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String nome;
    private Date data;
    private String rua;
    private String cep;
    private String bairro;
    private String cidade;

    // Relações N:N com Fa em ParticipaEvento
    // getters e setters
}
