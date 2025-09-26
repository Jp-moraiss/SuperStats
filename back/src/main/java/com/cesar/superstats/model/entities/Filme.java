package com.cesar.superstats.model.entities;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
public class Filme {

    private Integer id;
    private String titulo;
    private String produtora;
    private String diretor;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dataLancamento;

    List<Personagem> participantes = new ArrayList<Personagem>();

}
