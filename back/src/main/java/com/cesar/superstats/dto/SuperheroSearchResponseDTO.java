package com.cesar.superstats.dto;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import java.util.List;
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class SuperheroSearchResponseDTO {

    private String response;
    private List<SuperheroApiResponseDTO> results;

}