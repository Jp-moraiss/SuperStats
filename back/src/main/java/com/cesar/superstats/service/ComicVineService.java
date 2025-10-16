package com.cesar.superstats.service;

import com.cesar.superstats.dto.ComicVineIssueDetailsDTO;
import com.cesar.superstats.dto.ComicVineIssueSummaryDTO;
import com.cesar.superstats.dto.ComicVineSearchResponseDTO;
import com.cesar.superstats.dto.ComicVineVolumeDetailsDTO;
import com.cesar.superstats.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

/**
 * Classes DTO aninhadas (wrappers) para lidar com a estrutura "results"
 * das respostas de detalhes da API do Comic Vine.
 */
class ComicVineIssueDetailsResponseDTO {
    public ComicVineIssueDetailsDTO results;
}
class ComicVineVolumeDetailsResponseDTO {
    public ComicVineVolumeDetailsDTO results;
}


@Service
public class ComicVineService {

    @Value("${comicvine.api.key}")
    private String apiKey;

    private final String apiUrl = "https://comicvine.gamespot.com/api";

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Passo 1: Busca uma HQ (issue) pelo título.
     * Usa o endpoint /search/ e constrói a URL manualmente para máxima compatibilidade.
     * @param titulo O nome da HQ a ser buscada.
     * @return O primeiro resultado da busca, contendo dados básicos e URLs para os detalhes.
     */
    public ComicVineIssueSummaryDTO buscarHq(String titulo) {
        String url;
        try {
            // Codifica o título manualmente para garantir que espaços sejam tratados como %20
            String encodedQuery = URLEncoder.encode(titulo, StandardCharsets.UTF_8);

            url = String.format(
                    "%s/search/?api_key=%s&format=json&query=%s&resources=issue",
                    apiUrl,
                    apiKey,
                    encodedQuery
            );
        } catch (Exception e) {
            throw new RuntimeException("Falha ao codificar a URL de busca", e);
        }

        // Log para depuração: mostra a URL exata que está sendo chamada
        System.out.println("URL FINAL ENVIADA (BUSCA): " + url);

        HttpHeaders headers = new HttpHeaders();
        headers.set("User-Agent", "SuperStatsApp/1.0"); // Exigido pela API do Comic Vine
        headers.set("Accept", "application/json");      // Garante que a resposta seja JSON
        HttpEntity<String> entity = new HttpEntity<>(headers);

        ComicVineSearchResponseDTO response = restTemplate.exchange(url, HttpMethod.GET, entity, ComicVineSearchResponseDTO.class).getBody();

        if (response == null || response.getResults() == null || response.getResults().isEmpty()) {
            throw new ResourceNotFoundException("Nenhuma HQ encontrada no Comic Vine com o título: " + titulo);
        }

        return response.getResults().get(0);
    }

    /**
     * Passo 2: Busca os detalhes de uma HQ (issue) específica.
     * @param detailUrl A URL completa para os detalhes da issue, obtida no Passo 1.
     * @return Um DTO com os detalhes da issue.
     */
    public ComicVineIssueDetailsDTO buscarDetalhesHq(String detailUrl) {
        String url = String.format("%s?api_key=%s&format=json", detailUrl, apiKey);

        HttpHeaders headers = new HttpHeaders();
        headers.set("User-Agent", "SuperStatsApp/1.0");
        headers.set("Accept", "application/json");
        HttpEntity<String> entity = new HttpEntity<>(headers);

        ComicVineIssueDetailsResponseDTO response = restTemplate.exchange(url, HttpMethod.GET, entity, ComicVineIssueDetailsResponseDTO.class).getBody();

        if (response == null || response.results == null) {
            throw new ResourceNotFoundException("Detalhes da HQ não encontrados.");
        }
        return response.results;
    }

    /**
     * Passo 3: Busca os detalhes de um Volume (série de HQs).
     * @param volumeDetailUrl A URL completa para os detalhes do volume, obtida no Passo 1.
     * @return Um DTO com os detalhes do volume.
     */
    public ComicVineVolumeDetailsDTO buscarDetalhesVolume(String volumeDetailUrl) {
        String url = String.format("%s?api_key=%s&format=json", volumeDetailUrl, apiKey);

        HttpHeaders headers = new HttpHeaders();
        headers.set("User-Agent", "SuperStatsApp/1.0");
        headers.set("Accept", "application/json");
        HttpEntity<String> entity = new HttpEntity<>(headers);

        ComicVineVolumeDetailsResponseDTO response = restTemplate.exchange(url, HttpMethod.GET, entity, ComicVineVolumeDetailsResponseDTO.class).getBody();

        if (response == null || response.results == null) {
            throw new ResourceNotFoundException("Detalhes do volume da HQ não encontrados.");
        }
        return response.results;
    }
}