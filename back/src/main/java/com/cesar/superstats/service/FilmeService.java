package com.cesar.superstats.service;

import com.cesar.superstats.dto.FilmeDTO;
import com.cesar.superstats.exceptions.ResourceNotFoundException;
import com.cesar.superstats.model.entities.Fa;
import com.cesar.superstats.model.entities.Filme;
import com.cesar.superstats.repository.FilmeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FilmeService {

    private final FilmeRepository repository;

    public FilmeService(FilmeRepository repository) {
        this.repository = repository;
    }

    public List<Filme> findAll(Fa faLogado) {
        return repository.findAll(faLogado.getId());
    }

    public Filme findById(Integer id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Id de filme inválido: " + id);
        }

        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Filme de id " + id + " não encontrado"));
    }

    public List<Filme> findByTitle(String titulo) {
        List<Filme> filmes = repository.findByTitle(titulo);
        if (filmes.isEmpty()) {
            throw new ResourceNotFoundException("Nenhum filme encontrado com o título: " + titulo);
        }
        return filmes;
    }

    public List<Filme> findByProdutora(String produtora) {
        if (produtora == null || produtora.isBlank()) {
            throw new IllegalArgumentException("Produtora não pode ser nula ou vazia");
        }
        return repository.findByProdutora(produtora);
    }

    public void save(Filme filme) {
        if (filme.getTitulo() == null || filme.getTitulo().isBlank()) {
            throw new IllegalArgumentException("Título não pode ser nulo ou vazio");
        }
        if (filme.getDataLancamento() == null) {
            throw new IllegalArgumentException("Data de lançamento não pode ser nula");
        }
        repository.save(filme);
    }

    public void update(Integer id, FilmeDTO filme) {
        if (id == null) {
            throw new ResourceNotFoundException("Id não pode ser nulo");
        }
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Filme de id " + id + " não encontrado");
        }
        if (filme.getTitulo() == null || filme.getTitulo().isBlank()) {
            throw new IllegalArgumentException("Título não pode ser nulo ou vazio");
        }
        if (filme.getDataLancamento() == null) {
            throw new IllegalArgumentException("Data de lançamento não pode ser nula");
        }

        repository.update(id, filme);
    }

    public void deleteById(Integer id) {
        if (id == null) {
            throw new ResourceNotFoundException("Id não pode ser nulo");
        }
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Filme de id " + id + " não encontrado");
        }
        repository.deleteById(id);
    }

    public List<String> findAllProdutoras() {
        return repository.findAllProdutoras();
    }

    public void marcarComoAssistido(Integer filmeId, Fa faLogado) {
        if (!repository.existsById(filmeId)) {
            throw new RuntimeException("Filme com ID " + filmeId + " não encontrado.");
        }
        repository.marcarComoAssistido(faLogado.getId(), filmeId);
    }

    public void removerDosAssistidos(Integer filmeId, Fa faLogado) {
        repository.removerDosAssistidos(faLogado.getId(), filmeId);
    }

    public List<Filme> findAssistidosPeloFa(Fa faLogado) {
        return repository.findAssistidosByFaId(faLogado.getId());
    }
}

