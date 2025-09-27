package com.cesar.superstats.service;

import com.cesar.superstats.dto.PersonagemNovoDTO;
import com.cesar.superstats.model.entities.Fa;
import com.cesar.superstats.model.entities.PersonagemNovo;
import com.cesar.superstats.repository.PersonagemNovoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PersonagemNovoService {

    private final PersonagemNovoRepository repository;

    public List<PersonagemNovo> findAll() {
        return repository.findAll();
    }

    public List<PersonagemNovo> findByCreator(Fa criador) {
        if (criador == null || criador.getId() == null) {
            throw new IllegalArgumentException("Criador inválido.");
        }
        return repository.findByCreatorId(criador.getId());
    }

    public void create(PersonagemNovoDTO dto, Fa criador) {
        if (dto.getNome() == null || dto.getNome().trim().isEmpty()) {
            throw new IllegalArgumentException("O nome do personagem é obrigatório.");
        }
        PersonagemNovo personagem = new PersonagemNovo();
        personagem.setNome(dto.getNome());
        personagem.setAlinhamento(dto.getAlinhamento());
        personagem.setAltura(dto.getAltura());
        personagem.setPeso(dto.getPeso());
        personagem.setPoder(dto.getPoder());
        personagem.setGenero(dto.getGenero());
        personagem.setFaCriador(criador);
        repository.save(personagem);
    }

    public void deleteById(Integer id, Fa faLogado) throws AccessDeniedException {
        PersonagemNovo personagem = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Personagem com ID " + id + " não encontrado."));

        // Regra de negócio: Apenas o criador do personagem pode deletá-lo.
        if (!personagem.getFaCriador().getId().equals(faLogado.getId())) {
            throw new AccessDeniedException("Acesso negado. Apenas o criador pode deletar este personagem.");
        }

        repository.deleteById(id);
    }
}