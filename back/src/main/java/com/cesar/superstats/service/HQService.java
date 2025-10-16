package com.cesar.superstats.service;

import com.cesar.superstats.dto.*;
import com.cesar.superstats.exceptions.ResourceNotFoundException;
import com.cesar.superstats.model.entities.Fa;
import com.cesar.superstats.model.entities.HQ;
import com.cesar.superstats.repository.HQRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HQService {

    private final HQRepository repository;
    private final ComicVineService comicVineService;

    public List<HQ> findAll(Fa faLogado) {
        return repository.findAll(faLogado.getId());
    }

    public HQ findById(Integer id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("ID da HQ é inválido: " + id);
        }
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("HQ com ID " + id + " não encontrada."));
    }

    public List<HQ> findByTitle(String titulo) {
        return repository.findByTitle(titulo);
    }

    public List<HQ> findByEditora(String editora) {
        if (editora == null || editora.isBlank()) {
            throw new IllegalArgumentException("Nome da editora não pode ser nulo ou vazio.");
        }
        return repository.findByEditora(editora);
    }

    public List<String> findAllEditoras() {
        return repository.findAllEditoras();
    }

    public List<HqSearchResultDTO> buscarHqsExternas(String titulo) {
        return comicVineService.buscarRecursos(titulo);
    }

    public HQ createFromApi(HqFinalizeCreateDTO dto) {
        if (dto.getApiDetailUrl() == null || dto.getApiDetailUrl().isBlank()) {
            throw new IllegalArgumentException("A URL de detalhes da API é obrigatória para criar a HQ.");
        }

        // 1. Busca os detalhes da ISSUE
        ComicVineIssueDetailsDTO detalhesIssue = comicVineService.buscarDetalhesHq(dto.getApiDetailUrl());
        if (detalhesIssue == null || detalhesIssue.getVolume() == null || detalhesIssue.getVolume().getApiDetailUrl() == null) {
            throw new ResourceNotFoundException("Não foi possível obter detalhes essenciais da HQ a partir da URL fornecida.");
        }

        // 2. Busca os detalhes do VOLUME para pegar a editora
        String volumeDetailUrl = detalhesIssue.getVolume().getApiDetailUrl();
        ComicVineVolumeDetailsDTO detalhesVolume = comicVineService.buscarDetalhesVolume(volumeDetailUrl);

        // 3. Monta a entidade HQ com todos os dados
        HQ hq = new HQ();
        String tituloCompleto = detalhesIssue.getVolume().getName();
        if (detalhesIssue.getIssueNumber() != null) {
            tituloCompleto += " #" + detalhesIssue.getIssueNumber();
        }
        hq.setTitulo(tituloCompleto);
        hq.setEdicao(detalhesIssue.getIssueNumber());

        if (detalhesVolume != null && detalhesVolume.getPublisher() != null) {
            hq.setEditora(detalhesVolume.getPublisher().getName());
        }

        if (detalhesIssue.getImage() != null) {
            hq.setCoverUrl(detalhesIssue.getImage().getOriginalUrl());
        }

        try {
            if (detalhesIssue.getCoverDate() != null) {
                hq.setDataLancamento(LocalDate.parse(detalhesIssue.getCoverDate()));
            }
        } catch (Exception e) {
            System.err.println("Não foi possível parsear a data da HQ: " + detalhesIssue.getCoverDate());
            hq.setDataLancamento(null);
        }

        // 4. Salva a entidade completa no banco e a retorna
        return repository.save(hq);
    }

    public void update(Integer id, HQDTO hqDto) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("HQ com ID " + id + " não encontrada para atualização.");
        }
        if (hqDto.getTitulo() == null || hqDto.getTitulo().isBlank()) {
            throw new IllegalArgumentException("O título da HQ não pode ser nulo ou vazio.");
        }
        repository.update(id, hqDto);
    }

    public void deleteById(Integer id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("HQ com ID " + id + " não encontrada para deleção.");
        }
        repository.deleteById(id);
    }

    public void marcarComoLido(Integer hqId, Fa faLogado) {
        if (!repository.existsById(hqId)) {
            throw new ResourceNotFoundException("HQ com ID " + hqId + " não encontrada.");
        }
        repository.marcarComoLido(faLogado.getId(), hqId);
    }

    public void removerDosLidos(Integer hqId, Fa faLogado) {
        repository.removerDosLidos(faLogado.getId(), hqId);
    }


    public List<HQ> findLidosPeloFa(Fa faLogado) {
        return repository.findLidosByFaId(faLogado.getId());
    }
}