package com.cesar.superstats.model.entities;
import lombok.Data;
import java.time.LocalDate;
@Data
public class Resposta {
    private Integer id;
    private Personagem personagem;
    private Fa fa;
    private Pergunta pergunta;
    private LocalDate dataResposta;
}