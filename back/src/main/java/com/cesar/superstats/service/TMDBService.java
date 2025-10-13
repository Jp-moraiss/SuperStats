package com.cesar.superstats.service;

import com.cesar.superstats.dto.*;
import com.cesar.superstats.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class TMDBService {

    @Value("${tmdb.api.key}")
    private String apiKey;

    private final String apiUrl = "https://api.themoviedb.org/3";
    private final String imageUrlBase = "https://image.tmdb.org/t/p/w500"; // URL base para construir o link completo do pôster

    private final RestTemplate restTemplate = new RestTemplate();

    public TmdbMovieResult buscarFilme(String titulo) {
        // Monta a URL para o endpoint de busca de filmes do TMDB
        String url = UriComponentsBuilder.fromHttpUrl(apiUrl + "/search/movie")
                .queryParam("api_key", apiKey)
                .queryParam("query", titulo)
                .queryParam("language", "pt-BR") // Bônus: Pede resultados em português
                .toUriString();

        // Faz a chamada para a API e o Spring já converte o JSON para nosso DTO
        TmdbSearchResponse response = restTemplate.getForObject(url, TmdbSearchResponse.class);

        // Verifica se a busca retornou algum resultado
        if (response == null || response.getResults() == null || response.getResults().isEmpty()) {
            throw new ResourceNotFoundException("Nenhum filme encontrado no TMDB com o título: " + titulo);
        }

        // Pega o primeiro filme da lista (o mais relevante)
        TmdbMovieResult result = response.getResults().get(0);

        // Monta a URL completa do pôster, pois a API só nos dá o "caminho"
        if (result.getPosterPath() != null && !result.getPosterPath().isEmpty()) {
            result.setPosterPath(imageUrlBase + result.getPosterPath());
        }

        return result;
    }

    public TmdbMovieDetailsDTO buscarDetalhes(int movieId) {
        String url = UriComponentsBuilder.fromHttpUrl(apiUrl + "/movie/" + movieId)
                .queryParam("api_key", apiKey)
                .queryParam("language", "pt-BR")
                .toUriString();
        return restTemplate.getForObject(url, TmdbMovieDetailsDTO.class);
    }

    public TmdbCreditsDTO buscarCreditos(int movieId) {
        String url = UriComponentsBuilder.fromHttpUrl(apiUrl + "/movie/" + movieId + "/credits")
                .queryParam("api_key", apiKey)
                .toUriString();
        return restTemplate.getForObject(url, TmdbCreditsDTO.class);
    }

    public TmdbVideosResponseDTO buscarVideos(int movieId) {
        String url = UriComponentsBuilder.fromHttpUrl(apiUrl + "/movie/" + movieId + "/videos")
                .queryParam("api_key", apiKey)
                .toUriString();
        return restTemplate.getForObject(url, TmdbVideosResponseDTO.class);
    }
}