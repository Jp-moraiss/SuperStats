package com.cesar.superstats.dto;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class TmdbMovieDetailsDTO {
    @JsonProperty("production_companies")
    private List<TmdbProductionCompanyDTO> productionCompanies;

    @JsonProperty("vote_average")
    private double voteAverage;
}