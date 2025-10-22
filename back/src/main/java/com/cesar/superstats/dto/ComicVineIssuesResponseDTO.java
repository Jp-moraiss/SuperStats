package com.cesar.superstats.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ComicVineIssuesResponseDTO {
    // Este DTO representa a resposta do endpoint /issues, que também contém uma lista 'results'
    private List<ComicVineIssueSummaryDTO> results;
}