package com.cesar.superstats.model.entities;// Filme.java
import lombok.Data;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
public class Filme {

    private Integer id;
    private String titulo;
    private String produtora;
    private String diretor;
    private Date dataLancamento;

    List<Personagem> participantes = new ArrayList<Personagem>();

}
