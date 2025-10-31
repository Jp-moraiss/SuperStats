package com.cesar.superstats.dto;
import lombok.Data;

import java.time.LocalDate;

@Data
public class SimpleHqDTO {
    private int id;
    private String titulo;
    private String coverUrl;
    private String edicao;
    private String editora;
    private LocalDate dataLancamento;

}