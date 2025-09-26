package com.cesar.superstats.service;

import com.cesar.superstats.dto.FaDTO;
import com.cesar.superstats.exceptions.ResourceNotFoundException;
import com.cesar.superstats.model.entities.Fa;
import com.cesar.superstats.repository.FaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FaService {

    private final FaRepository repository;

    public FaService(FaRepository repository) {
        this.repository = repository;
    }

    public Optional<Fa> findByEmail(String email) {
        if (email == null || email.isEmpty()) {
            throw new ResourceNotFoundException("Email cannot be null or empty");
        }
        return repository.findByEmail(email);
    }

    public List<Fa> findAll() {
        return repository.findAll();
    }

    public void save(FaDTO fa) {
        if (fa.getEmail() == null || fa.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("O email do fã não pode ser nulo ou vazio.");
        }
        if (fa.getNome() == null || fa.getNome().trim().isEmpty()) {
            throw new IllegalArgumentException("O nome do fã não pode ser nulo ou vazio.");
        }
        repository.save(fa);
    }

    public void update(String email, FaDTO fa) {
        if (repository.findByEmail(email).isEmpty()) {
            throw new RuntimeException("Fã não encontrado com o email: " + email);
        }
        repository.update(email, fa);
    }

    public void deleteByEmail(String email) {
        if (repository.findByEmail(email).isEmpty()) {
            throw new RuntimeException("Fã não encontrado com o email: " + email);
        }
        repository.deleteByEmail(email);
    }
}
