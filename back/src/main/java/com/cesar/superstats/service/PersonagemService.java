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

@Service
@RequiredArgsConstructor
public class PersonagemService {

    private final PersonagemRepository personagemRepository;
    private final BaseRepository baseRepository;
    private final AlterEgoRepository alterEgoRepository;
    private final SuperheroApiService superheroApiService;

    @Transactional
    public Personagem createFromApi(PersonagemFinalizeCreateDTO dto) {

        if (dto.getApiId() == null || dto.getApiId().isBlank()) {
            throw new IllegalArgumentException("O ID da API é obrigatório para criar o personagem.");
        }

        SuperheroApiResponseDTO apiDto = superheroApiService.buscarPersonagemPorId(dto.getApiId());

        if (personagemRepository.findById(Integer.parseInt(apiDto.getId())).isPresent()){
            throw new IllegalArgumentException("Esse personagem já foi cadastrado.");
        }

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
        personagem.setInteligencia(Integer.parseInt(apiDto.getPowerstats().getIntelligence()));
        personagem.setForca(Integer.parseInt(apiDto.getPowerstats().getStrength()));
        personagem.setVelocidade(Integer.parseInt(apiDto.getPowerstats().getSpeed()));
        personagem.setDurabilidade(Integer.parseInt(apiDto.getPowerstats().getDurability()));
        personagem.setPoder(Integer.parseInt(apiDto.getPowerstats().getPower()));
        personagem.setCombate(Integer.parseInt(apiDto.getPowerstats().getCombat()));

        if (apiDto.getAppearance().getHeight() != null && apiDto.getAppearance().getHeight().size() > 1) {
            String alturaStr = apiDto.getAppearance().getHeight().get(1);
            alturaStr = alturaStr.replaceAll("[^0-9]", "");
            if (!alturaStr.isEmpty()) {
                personagem.setAltura(Integer.parseInt(alturaStr));
            }
        }

        if (apiDto.getAppearance().getWeight() != null && apiDto.getAppearance().getWeight().size() > 1) {
            String pesoStr = apiDto.getAppearance().getWeight().get(1);
            pesoStr = pesoStr.replaceAll("[^0-9]", "");
            if (!pesoStr.isEmpty()) {
                // Converte para Integer DIRETAMENTE
                personagem.setPeso(Integer.parseInt(pesoStr));
            }
        }

        personagemRepository.save(personagem);

        if (apiDto.getWork().getBase() != null && !apiDto.getWork().getBase().equals("-")) {
            String[] bases = apiDto.getWork().getBase().split(",|;");
            for (String nomeBase : bases) {
                Base base = new Base();
                base.setNomeBase(nomeBase.trim());
                base.setPersonagem(personagem);
                baseRepository.save(base);
            }
        }

        if (apiDto.getBiography().getAlterEgos() != null && !apiDto.getBiography().getAlterEgos().equalsIgnoreCase("No alter egos found.")) {
            String[] alterEgosArray = apiDto.getBiography().getAlterEgos().split(",|;");
            for (String nomeAlterEgo : alterEgosArray) {
                AlterEgo alterEgo = new AlterEgo();
                alterEgo.setAlterEgoName(nomeAlterEgo.trim());
                alterEgo.setPersonagem(personagem);
                alterEgoRepository.save(alterEgo);
            }
        }

        if (apiDto.getBiography().getAliases() != null) {
            for (String nomeAlias : apiDto.getBiography().getAliases()) {
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
}