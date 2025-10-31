package com.cesar.superstats.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FaConsumoDTO {

    private Integer faId;
    private String username;
    private String nome;
    private String tipoConsumo;

}