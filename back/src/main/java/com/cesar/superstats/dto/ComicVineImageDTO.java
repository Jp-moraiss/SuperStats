package com.cesar.superstats.dto;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties; import com.fasterxml.jackson.annotation.JsonProperty; import lombok.Data;
@Data @JsonIgnoreProperties(ignoreUnknown = true)
public class ComicVineImageDTO {
    @JsonProperty("super_url") private String superUrl;
    @JsonProperty("original_url") private String originalUrl;
}