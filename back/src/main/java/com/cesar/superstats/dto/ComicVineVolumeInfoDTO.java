package com.cesar.superstats.dto;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties; import com.fasterxml.jackson.annotation.JsonProperty; import lombok.Data;
@Data @JsonIgnoreProperties(ignoreUnknown = true)
public class ComicVineVolumeInfoDTO {
    private int id;
    private String name;
    @JsonProperty("api_detail_url") private String apiDetailUrl;
}