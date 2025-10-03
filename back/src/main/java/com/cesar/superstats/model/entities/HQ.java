package com.cesar.superstats.model.entities;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
public class HQ {

    private Integer id;
    private String edicao;
    private String editora;
    private String titulo;
    private boolean lido;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dataLancamento;

    List<Personagem> participantes = new ArrayList<Personagem>();

}
