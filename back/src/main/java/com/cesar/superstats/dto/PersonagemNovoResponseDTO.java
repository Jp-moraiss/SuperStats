package com.cesar.superstats.dto;

import com.cesar.superstats.model.entities.PersonagemNovo;
import lombok.Data;

@Data
public class PersonagemNovoResponseDTO {

    private Integer id;
    private String nome;
    private String alinhamento;
    private String poder;
    private String genero;
    private Double altura;
    private Double peso;
    private CriadorDTO criador;

    public PersonagemNovoResponseDTO(PersonagemNovo p) {
        this.id = p.getId();
        this.nome = p.getNome();
        this.alinhamento = p.getAlinhamento();
        this.poder = p.getPoder();
        this.genero = p.getGenero();
        this.altura = p.getAltura();
        this.peso = p.getPeso();

        if (p.getFaCriador() != null) {
            this.criador = new CriadorDTO(p.getFaCriador().getId(), p.getFaCriador().getUsername());
        }
    }
}