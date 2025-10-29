package com.cesar.superstats.service;

import com.cesar.superstats.dto.*;
import com.cesar.superstats.exceptions.ResourceNotFoundException;
import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Data
class ComicVineGenericSearchResponseDTO { public List<ComicVineGenericResultDTO> results; }
class ComicVineIssueDetailsResponseDTO { public ComicVineIssueDetailsDTO results; }
class ComicVineVolumeDetailsResponseDTO { public ComicVineVolumeDetailsDTO results; }
@Data
class ComicVineIssuesResponseDTO { public List<ComicVineIssueSummaryDTO> results; }


@Service
public class ComicVineService {

    @Value("${comicvine.api.key}") private String apiKey;
    private final String apiUrl = "https://comicvine.gamespot.com/api";
    private final RestTemplate restTemplate = new RestTemplate();

    public List<HqSearchResultDTO> buscarRecursos(String titulo) {
        String url;
        try {
            String encodedQuery = URLEncoder.encode(titulo, StandardCharsets.UTF_8);
            url = String.format("%s/search/?api_key=%s&format=json&query=%s", apiUrl, apiKey, encodedQuery);
        } catch (Exception e) { throw new RuntimeException("Falha ao codificar URL de busca", e); }

        HttpHeaders headers = new HttpHeaders();
        headers.set("User-Agent", "SuperStatsApp/1.0");
        headers.set("Accept", "application/json");
        HttpEntity<String> entity = new HttpEntity<>(headers);

        ComicVineGenericSearchResponseDTO response = restTemplate.exchange(url, HttpMethod.GET, entity, ComicVineGenericSearchResponseDTO.class).getBody();

        if (response == null || response.getResults() == null || response.getResults().isEmpty()) {
            return List.of();
        }

        return response.getResults().stream()
                .map(this::traduzirParaDtoPadronizado)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    private HqSearchResultDTO traduzirParaDtoPadronizado(ComicVineGenericResultDTO item) {
        try {
            HqSearchResultDTO dto = new HqSearchResultDTO();
            dto.setResourceType(item.getResourceType());
            dto.setId(item.getId());

            if ("issue".equals(item.getResourceType())) {
                if(item.getVolume() == null) return null;
                dto.setApiDetailUrl(item.getApiDetailUrl());
                dto.setVolumeName(item.getVolume().getName());
                dto.setTitle(item.getName() != null && !item.getName().isBlank() ? item.getName() : "Edição #" + item.getIssueNumber());
            } else if ("volume".equals(item.getResourceType())) {
                dto.setTitle(item.getName());
                if (item.getPublisher() != null) dto.setVolumeName(item.getPublisher().getName());
                if (item.getFirstIssue() != null && item.getFirstIssue().getApiDetailUrl() != null) {
                    dto.setApiDetailUrl(item.getFirstIssue().getApiDetailUrl());
                } else { return null; }
            } else { return null; }

            if (item.getCoverDate() != null && item.getCoverDate().length() >= 4) {
                dto.setYear(item.getCoverDate().substring(0, 4));
            } else if (item.getStartYear() != null) {
                dto.setYear(item.getStartYear());
            }
            if (item.getImage() != null) { dto.setImageUrl(item.getImage().getSuperUrl()); }
            if (dto.getTitle() == null) { return null; }
            return dto;
        } catch (Exception e) { return null; }
    }

    public ComicVineIssueDetailsDTO buscarDetalhesHq(String detailUrl) {
        String url = String.format("%s?api_key=%s&format=json", detailUrl, apiKey);
        HttpHeaders headers = new HttpHeaders();
        headers.set("User-Agent", "SuperStatsApp/1.0");
        HttpEntity<String> entity = new HttpEntity<>(headers);
        ComicVineIssueDetailsResponseDTO response = restTemplate.exchange(url, HttpMethod.GET, entity, ComicVineIssueDetailsResponseDTO.class).getBody();
        if (response == null || response.results == null) throw new ResourceNotFoundException("Detalhes da HQ não encontrados.");
        return response.results;
    }

    public ComicVineVolumeDetailsDTO buscarDetalhesVolume(String volumeDetailUrl) {
        String url = String.format("%s?api_key=%s&format=json", volumeDetailUrl, apiKey);
        HttpHeaders headers = new HttpHeaders();
        headers.set("User-Agent", "SuperStatsApp/1.0");
        HttpEntity<String> entity = new HttpEntity<>(headers);
        ComicVineVolumeDetailsResponseDTO response = restTemplate.exchange(url, HttpMethod.GET, entity, ComicVineVolumeDetailsResponseDTO.class).getBody();
        if (response == null || response.results == null) throw new ResourceNotFoundException("Detalhes do volume não encontrados.");
        return response.results;
    }

    public List<HqSearchResultDTO> buscarIssuesDeVolume(int volumeId) {
        String url = String.format("%s/issues/?api_key=%s&format=json&filter=volume:%d&sort=issue_number:asc", apiUrl, apiKey, volumeId);
        HttpHeaders headers = new HttpHeaders();
        headers.set("User-Agent", "SuperStatsApp/1.0");
        headers.set("Accept", "application/json");
        HttpEntity<String> entity = new HttpEntity<>(headers);
        ComicVineSearchResponseDTO response = restTemplate.exchange(url, HttpMethod.GET, entity, ComicVineSearchResponseDTO.class).getBody();

        if (response == null || response.getResults() == null) { return List.of(); }

        // Agora, também traduzimos esta lista para o nosso formato padronizado
        return response.getResults().stream()
                .map(this::traduzirIssueParaDtoPadronizado)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    private HqSearchResultDTO traduzirIssueParaDtoPadronizado(ComicVineIssueSummaryDTO item) {
        try {
            HqSearchResultDTO dto = new HqSearchResultDTO();
            dto.setResourceType("issue");
            dto.setApiDetailUrl(item.getApiDetailUrl());
            dto.setTitle(item.getName() != null && !item.getName().isBlank() ? item.getName() : "Edição #" + item.getIssueNumber());
            if (item.getCoverDate() != null && item.getCoverDate().length() >= 4) {
                dto.setYear(item.getCoverDate().substring(0, 4));
            }
            if (item.getImage() != null) {
                dto.setImageUrl(item.getImage().getSuperUrl());
            }
            return dto;
        } catch(Exception e) { return null; }
    }
}