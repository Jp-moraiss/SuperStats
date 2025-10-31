package com.cesar.superstats.dto;
import lombok.Data;

import java.time.LocalDate;

@Data
public class SimpleFilmeDTO {
    private int id;
    private String titulo;
    private String posterUrl;
    private String trailerUrl;
    private String produtora;
    private LocalDate dataLancamento;
}