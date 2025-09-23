package com.cesar.superstats.model.entities;// Filme.java
import jakarta.persistence.*;
import java.util.Date;

@Entity
public class Filme {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String titulo;
    private String produtora;
    private String diretor;
    private Date dataLancamento;

    // getters e setters
}
