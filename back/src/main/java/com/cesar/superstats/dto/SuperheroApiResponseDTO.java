package com.cesar.superstats.dto;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class SuperheroApiResponseDTO {
    private String id;
    private String name;
    private PowerstatsDTO powerstats;
    private BiographyDTO biography;
    private AppearanceDTO appearance;
    private WorkDTO work;
    private ImageDTO image;
    private String response;
}