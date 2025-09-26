package com.cesar.superstats.model.entities;
import lombok.Data;

import java.util.Date;

@Data
public class Evento {

    private Integer id;
    private String nome;
    private Date data;
    private String rua;
    private String cep;
    private String bairro;
    private String cidade;

}
