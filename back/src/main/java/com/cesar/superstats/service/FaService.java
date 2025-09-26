package com.cesar.superstats.service;

import com.cesar.superstats.dto.FaDTO;
import com.cesar.superstats.exceptions.ResourceNotFoundException;
import com.cesar.superstats.model.entities.Fa;
import com.cesar.superstats.repository.FaRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FaService {

    private final FaRepository repository;

    private final PasswordEncoder encoder;

    public FaService(FaRepository repository, PasswordEncoder encoder) {
        this.repository = repository;
        this.encoder = encoder;
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

    public void save(FaDTO faDto) {
        if (faDto.getUsername() == null || faDto.getUsername().trim().isEmpty()) {
            throw new IllegalArgumentException("O username do fã não pode ser nulo ou vazio.");
        }
        if (faDto.getEmail() == null || faDto.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("O email do fã não pode ser nulo ou vazio.");
        }
        if (faDto.getNome() == null || faDto.getNome().trim().isEmpty()) {
            throw new IllegalArgumentException("O nome do fã não pode ser nulo ou vazio.");
        }
        if (faDto.getPassword() == null || faDto.getPassword().isEmpty()) {
            throw new IllegalArgumentException("A senha não pode ser nula ou vazia.");
        }

        Fa novoFa = new Fa();
        novoFa.setUsername(faDto.getUsername());
        novoFa.setEmail(faDto.getEmail());
        novoFa.setNome(faDto.getNome());
        novoFa.setGenero(faDto.getGenero());
        novoFa.setIdade(faDto.getIdade());
        novoFa.setUniv_fav(faDto.getUniv_fav());
        novoFa.setTempo_geek(faDto.getTempoGeek());
        novoFa.setOcupacao(faDto.getOcupacao());

        String senhaHasheada = encoder.encode(faDto.getPassword());
        novoFa.setPassword(senhaHasheada);

        repository.save(novoFa);
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

