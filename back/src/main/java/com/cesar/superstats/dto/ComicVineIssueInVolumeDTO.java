package com.cesar.superstats.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ComicVineIssueInVolumeDTO {
    
    @JsonProperty("api_detail_url")
    private String apiDetailUrl;

    private String name;

    @JsonProperty("issue_number")
    private String issueNumber;
}