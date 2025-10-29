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
    private final String imageUrlBase = "https://image.tmdb.org/t/p/w500";

    private final RestTemplate restTemplate = new RestTemplate();

    public TmdbSearchResponse buscarFilmes(String titulo) {
        String url = UriComponentsBuilder.fromHttpUrl(apiUrl + "/search/movie")
                .queryParam("api_key", apiKey)
                .queryParam("query", titulo)
                .queryParam("language", "pt-BR")
                .toUriString();

        TmdbSearchResponse response = restTemplate.getForObject(url, TmdbSearchResponse.class);

        if (response != null && response.getResults() != null) {
            response.getResults().forEach(filme -> {
                if (filme.getPosterPath() != null && !filme.getPosterPath().isEmpty()) {
                    filme.setPosterPath(imageUrlBase + filme.getPosterPath());
                }
            });
        }

        return response;
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