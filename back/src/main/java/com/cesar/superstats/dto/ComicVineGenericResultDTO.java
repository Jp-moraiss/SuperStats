package com.cesar.superstats.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ComicVineGenericResultDTO {

    @JsonProperty("id")
    private int id;

    @JsonProperty("api_detail_url")
    private String apiDetailUrl;

    // Campos que podem existir em diferentes tipos de resultados
    private String name; // Geralmente para volumes, personagens, etc.
    private ComicVineVolumeInfoDTO volume; // Apenas para issues
    @JsonProperty("issue_number")
    private String issueNumber;

    private ComicVineImageDTO image;

    @JsonProperty("cover_date")
    private String coverDate;

    // O campo mais importante: nos diz o que este resultado é
    @JsonProperty("resource_type")
    private String resourceType;
    
    // Campos que podem vir em um resultado do tipo 'volume'
    @JsonProperty("first_issue")
    private FirstIssueDTO firstIssue;

    @JsonProperty("start_year")
    private String startYear;

    @JsonProperty("publisher")
    private ComicVinePublisherDTO publisher;

}