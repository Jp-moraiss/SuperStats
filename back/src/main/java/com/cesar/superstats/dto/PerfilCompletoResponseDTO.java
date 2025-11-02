package com.cesar.superstats.dto;
import lombok.Data;

import java.util.List;

@Data
public class PerfilCompletoResponseDTO {
    private Integer faId;
    private String username, nome, genero, ocupacao, univFav;
    private Integer idade;
    private String perfilConsumo;
    private String tempoGeekFormatado;
    private List<SimpleFilmeDTO> filmesAssistidos;
    private List<SimpleHqDTO> hqsLidas;
    private String conquistas;
}