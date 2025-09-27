package com.cesar.superstats.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContagemAlinhamentoDTO {
    private String alinhamento;
    private Long total;
}