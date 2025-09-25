package com.cesar.superstats.model.entities;// Resposta.java
import lombok.Data;

import java.util.Date;

@Data
public class Resposta {

    private Integer id;
    private Date dataResposta;
    private Personagem personagem;
    private Fa fa;
    private Pergunta pergunta;

    // getters e setters
}
