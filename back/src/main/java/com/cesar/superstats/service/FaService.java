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

    public Optional<Fa> findById(Integer id) {
        if (id == null) {
            throw new IllegalArgumentException("Id cannot be null");
        }
        return repository.findById(id);
    }

    public Optional<Fa> findByEmail(String email) {
        if (email == null || email.isEmpty()) {
            throw new IllegalArgumentException("Email cannot be null or empty");
        }
        return repository.findByEmail(email);
    }

    public Optional<Fa> findByUsername(String username) {
        if (username == null || username.isEmpty()) {
            throw new IllegalArgumentException("Username cannot be null or empty");
        }
        return repository.findByUsername(username);
    }

    public List<Fa> findAll() {
        return repository.findAll();
    }

    public void save(FaDTO fa) {
        if (fa.getUsername() == null || fa.getUsername().trim().isEmpty()) {
            throw new IllegalArgumentException("O username do fã não pode ser nulo ou vazio.");
        }
        if (fa.getEmail() == null || fa.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("O email do fã não pode ser nulo ou vazio.");
        }
        if (fa.getNome() == null || fa.getNome().trim().isEmpty()) {
            throw new IllegalArgumentException("O nome do fã não pode ser nulo ou vazio.");
        }
        repository.save(fa);
    }

    public void update(Integer id, FaDTO fa) {
        if (repository.findById(id).isEmpty()) {
            throw new RuntimeException("Fã não encontrado com o id: " + id);
        }
        repository.update(id, fa);
    }

    public void deleteById(Integer id) {
        if (repository.findById(id).isEmpty()) {
            throw new RuntimeException("Fã não encontrado com o id: " + id);
        }
        repository.deleteById(id);
    }
}

