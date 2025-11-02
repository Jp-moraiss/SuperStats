package com.cesar.superstats.service;

import com.cesar.superstats.repository.ConquistaRepository;
import org.springframework.stereotype.Service;

@Service
public class ConquistaService {

    private final ConquistaRepository repository;

    public ConquistaService(ConquistaRepository repository) {
        this.repository = repository;
    }

    public void atualizarConquistasParaFa(Integer faId) {
        repository.callSpAtualizaConquistasLeitor(faId);
        repository.callSpAtualizaConquistasCinefilo(faId);
    }
}