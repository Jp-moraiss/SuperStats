package com.cesar.superstats.model.entities;// HQ.java
import jakarta.persistence.*;
import java.util.Date;

@Entity
public class HQ {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String edicao;
    private String editora;
    private String titulo;
    private Date dataLancamento;

    // getters e setters
}
