package com.cesar.superstats.service;

import com.cesar.superstats.dto.PersonagemFinalizeCreateDTO;
import com.cesar.superstats.dto.SuperheroApiResponseDTO;
import com.cesar.superstats.model.entities.AlterEgo;
import com.cesar.superstats.model.entities.Base;
import com.cesar.superstats.model.entities.Personagem;
import com.cesar.superstats.repository.AlterEgoRepository; // Crie este repositório
import com.cesar.superstats.repository.BaseRepository;       // Crie este repositório
import com.cesar.superstats.repository.PersonagemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PersonagemService {

    private final PersonagemRepository personagemRepository;
    private final BaseRepository baseRepository;
    private final AlterEgoRepository alterEgoRepository;
    private final SuperheroApiService superheroApiService;

    @Transactional
    public Personagem findOrCreateFromApi(PersonagemFinalizeCreateDTO dto) {
        if (dto.getApiId() == null || dto.getApiId().isBlank()) {
            throw new IllegalArgumentException("O ID da API é obrigatório.");
        }
        Integer id = Integer.parseInt(dto.getApiId());

        Optional<Personagem> existingCharacter = personagemRepository.findById(id);
        if (existingCharacter.isPresent()) {
            System.out.println("Personagem com ID " + id + " já existe. Reutilizando.");
            return existingCharacter.get();
        }

        System.out.println("Personagem com ID " + id + " não encontrado. Criando a partir da API...");
        SuperheroApiResponseDTO apiDto = superheroApiService.buscarPersonagemPorId(dto.getApiId());

        Personagem personagem = new Personagem();
        personagem.setId(Integer.parseInt(apiDto.getId()));
        personagem.setNome(apiDto.getName());
        personagem.setNomeCompleto(apiDto.getBiography().getFullName());
        personagem.setAlinhamento(apiDto.getBiography().getAlignment());
        personagem.setEditora(apiDto.getBiography().getPublisher());
        personagem.setPrimeiraAparicao(apiDto.getBiography().getFirstAppearance());
        personagem.setNaturalidade(apiDto.getBiography().getPlaceOfBirth());
        personagem.setGenero(apiDto.getAppearance().getGender());
        personagem.setRaca(apiDto.getAppearance().getRace());
        personagem.setOcupacao(apiDto.getWork().getOccupation());
        personagem.setImagemUrl(apiDto.getImage().getUrl());

        personagem.setInteligencia(safeParseInt(apiDto.getPowerstats().getIntelligence()));
        personagem.setForca(safeParseInt(apiDto.getPowerstats().getStrength()));
        personagem.setVelocidade(safeParseInt(apiDto.getPowerstats().getSpeed()));
        personagem.setDurabilidade(safeParseInt(apiDto.getPowerstats().getDurability()));
        personagem.setPoder(safeParseInt(apiDto.getPowerstats().getPower()));
        personagem.setCombate(safeParseInt(apiDto.getPowerstats().getCombat()));

        if (apiDto.getAppearance().getHeight() != null && apiDto.getAppearance().getHeight().size() > 1) {
            String alturaStr = apiDto.getAppearance().getHeight().get(1).replaceAll("[^0-9]", "");
            if (!alturaStr.isEmpty()) personagem.setAltura(Integer.parseInt(alturaStr));
        }
        if (apiDto.getAppearance().getWeight() != null && apiDto.getAppearance().getWeight().size() > 1) {
            String pesoStr = apiDto.getAppearance().getWeight().get(1).replaceAll("[^0-9]", "");
            if (!pesoStr.isEmpty()) personagem.setPeso(Integer.parseInt(pesoStr));
        }

        personagemRepository.save(personagem);

        if (apiDto.getWork().getBase() != null && !apiDto.getWork().getBase().equals("-")) {
            String[] bases = apiDto.getWork().getBase().split(",|;");
            for (String nomeBase : bases) {
                if(nomeBase.trim().isEmpty()) continue;
                Base base = new Base();
                base.setNomeBase(nomeBase.trim());
                base.setPersonagem(personagem);
                baseRepository.save(base);
            }
        }

        if (apiDto.getBiography().getAlterEgos() != null && !apiDto.getBiography().getAlterEgos().equalsIgnoreCase("No alter egos found.")) {
            String[] alterEgosArray = apiDto.getBiography().getAlterEgos().split(",|;");
            for (String nomeAlterEgo : alterEgosArray) {
                if(nomeAlterEgo.trim().isEmpty()) continue;
                AlterEgo alterEgo = new AlterEgo();
                alterEgo.setAlterEgoName(nomeAlterEgo.trim());
                alterEgo.setPersonagem(personagem);
                alterEgoRepository.save(alterEgo);
            }
        }
        if (apiDto.getBiography().getAliases() != null) {
            for (String nomeAlias : apiDto.getBiography().getAliases()) {
                if(nomeAlias.trim().isEmpty() || nomeAlias.equals("-")) continue;
                AlterEgo alias = new AlterEgo();
                alias.setAlterEgoName(nomeAlias.trim());
                alias.setPersonagem(personagem);
                alterEgoRepository.save(alias);
            }
        }

        return personagem;
    }

    public List<Personagem> findAll() {
        return personagemRepository.findAll();
    }

    public List<Personagem> findByName(String nome, String alignment) {
        return personagemRepository.findByName(nome, alignment);
    }

    public Personagem findById(int id) {
        return personagemRepository.findById(id).get();
    }

    private Integer safeParseInt(String value) {
        if (value == null || "null".equalsIgnoreCase(value)) {
            return 0;
        }
        try {
            return Integer.parseInt(value);
        } catch (NumberFormatException e) {
            return 0;
        }
    }
}