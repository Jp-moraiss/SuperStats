package com.cesar.superstats.model.entities;// Resposta.java
import jakarta.persistence.*;
import java.util.Date;

@Entity
public class Resposta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Date dataResposta;

    @ManyToOne
    @JoinColumn(name = "fk_Personagem_id")
    private Personagem personagem;

    @ManyToOne
    @JoinColumn(name = "fk_Fa_email")
    private Fa fa;

    @ManyToOne
    @JoinColumn(name = "fk_Pergunta_id", nullable = false)
    private Pergunta pergunta;

    // getters e setters
}
