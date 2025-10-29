package com.cesar.superstats.service;

import com.cesar.superstats.dto.SuperheroApiResponseDTO;
import com.cesar.superstats.dto.SuperheroSearchResponseDTO;
import com.cesar.superstats.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class SuperheroApiService {

    @Value("${superhero.api.token}")
    private String apiToken;

    private final String API_URL = "https://superheroapi.com/api";
    private final RestTemplate restTemplate = new RestTemplate();

    public SuperheroSearchResponseDTO buscarPersonagemPorNome(String nome) {
        String url = UriComponentsBuilder.fromHttpUrl(API_URL)
                .pathSegment(apiToken, "search", nome)
                .toUriString();

        SuperheroSearchResponseDTO response = restTemplate.getForObject(url, SuperheroSearchResponseDTO.class);

        if (response == null || "error".equals(response.getResponse()) || response.getResults() == null || response.getResults().isEmpty()) {
            throw new ResourceNotFoundException("Nenhum personagem encontrado na API externa com o nome: " + nome);
        }
        return response;
    }

    public SuperheroApiResponseDTO buscarPersonagemPorId(String id) {
        String url = UriComponentsBuilder.fromHttpUrl(API_URL)
                .pathSegment(apiToken, id)
                .toUriString();

        SuperheroApiResponseDTO response = restTemplate.getForObject(url, SuperheroApiResponseDTO.class);

        if (response == null || "error".equals(response.getResponse())) {
            throw new ResourceNotFoundException("Personagem com ID " + id + " não encontrado na API externa.");
        }
        return response;
    }
}