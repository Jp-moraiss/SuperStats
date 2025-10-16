package com.cesar.superstats.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ComicVineIssueDetailsDTO {
    private ComicVineImageDTO image;
    private ComicVineVolumeInfoDTO volume;

    @JsonProperty("issue_number")
    private String issueNumber;

    @JsonProperty("cover_date")
    private String coverDate;

    private String name;
}