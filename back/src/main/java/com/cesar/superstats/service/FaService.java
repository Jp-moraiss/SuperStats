package com.cesar.superstats.service;

import com.cesar.superstats.dto.*;
import com.cesar.superstats.exceptions.ResourceNotFoundException;
import com.cesar.superstats.model.entities.Fa;
import com.cesar.superstats.repository.FaRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class FaService {

    private final FaRepository repository;
    private final PasswordEncoder encoder;
    private final ObjectMapper objectMapper;
    private final ConquistaService conquistaService;

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

    public List<FaDTO> findFasPorFilmeAssistido(String tituloFilme) {
        List<Fa> fas = repository.findFasByTituloFilmeAssistido(tituloFilme);
        return fas.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
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
        novoFa.setDataNascimento(faDto.getDataNascimento());
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

    public void atualizarPerfil(Integer faId, FaUpdatePerfilDTO dto) {
        if (findById(faId).isEmpty()) {
            throw new ResourceNotFoundException("Fã com ID " + faId + " não encontrado.");
        }
        repository.callSpAtualizaPerfil(faId, dto.getOcupacao(), dto.getUnivFav());
    }

    public void deleteById(Integer id) {
        if (repository.findById(id).isEmpty()) {
            throw new RuntimeException("Fã não encontrado com o id: " + id);
        }
        repository.deleteById(id);
    }

    private FaDTO convertToDto(Fa fa) {
        FaDTO dto = new FaDTO();
        dto.setUsername(fa.getUsername());
        dto.setNome(fa.getNome());
        dto.setGenero(fa.getGenero());
        dto.setDataNascimento(fa.getDataNascimento());
        dto.setUniv_fav(fa.getUniv_fav());
        dto.setTempoGeek(fa.getTempo_geek());
        return dto;
    }

    public List<FaConsumoDTO> getPerfilDeConsumo() {
        return repository.findPerfilDeConsumoDosFas();
    }

    public PerfilAtividadeFaDTO getPerfilAtividade(Integer faId) {
        return repository.findPerfilAtividadeById(faId)
                .orElseThrow(() -> new ResourceNotFoundException("Perfil de atividade não encontrado para o fã com ID: " + faId));
    }

    public PerfilCompletoResponseDTO getPerfilCompleto(Integer faId) {
        conquistaService.atualizarConquistasParaFa(faId);

        PerfilViewDTO viewData = repository.findPerfilCompletoById(faId)
                .orElseThrow(() -> new ResourceNotFoundException("Perfil não encontrado para o fã com ID: " + faId));

        PerfilCompletoResponseDTO response = new PerfilCompletoResponseDTO();
        response.setFaId(viewData.getFaId());
        response.setUsername(viewData.getUsername());
        response.setNome(viewData.getNome());
        response.setGenero(viewData.getGenero());
        response.setIdade(viewData.getIdade());
        response.setOcupacao(viewData.getOcupacao());
        response.setTempoGeekFormatado(viewData.getTempoGeekFormatado());
        response.setUnivFav(viewData.getUnivFav());
        response.setPerfilConsumo(viewData.getPerfilConsumo());
        response.setConquistas(viewData.getConquistas());

        try {
            if (viewData.getFilmesAssistidosJson() != null) {
                List<SimpleFilmeDTO> filmes = objectMapper.readValue(viewData.getFilmesAssistidosJson(), new TypeReference<>() {});
                response.setFilmesAssistidos(filmes);
            } else {
                response.setFilmesAssistidos(Collections.emptyList());
            }

            if (viewData.getHqsLidasJson() != null) {
                List<SimpleHqDTO> hqs = objectMapper.readValue(viewData.getHqsLidasJson(), new TypeReference<>() {});
                response.setHqsLidas(hqs);
            } else {
                response.setHqsLidas(Collections.emptyList());
            }
        } catch (Exception e) {
            throw new RuntimeException("Erro ao processar dados de mídias consumidas.", e);
        }

        return response;
    }
}

