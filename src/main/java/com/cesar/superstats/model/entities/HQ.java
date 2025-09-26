package com.cesar.superstats.model.entities;
import lombok.Data;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
public class HQ {

    private Integer id;
    private String edicao;
    private String editora;
    private String titulo;
    private Date dataLancamento;

    List<Personagem> participantes = new ArrayList<Personagem>();

}
