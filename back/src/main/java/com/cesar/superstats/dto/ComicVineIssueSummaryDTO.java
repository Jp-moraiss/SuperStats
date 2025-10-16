package com.cesar.superstats.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ComicVineIssueSummaryDTO {
    @JsonProperty("api_detail_url")
    private String apiDetailUrl;

    @JsonProperty("volume")
    private ComicVineVolumeInfoDTO volume;

    @JsonProperty("issue_number")
    private String issueNumber;

    @JsonProperty("cover_date")
    private String coverDate;

    @JsonProperty("image")
    private ComicVineImageDTO image;

    private String name;
}