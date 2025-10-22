package com.cesar.superstats.dto;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties; import com.fasterxml.jackson.annotation.JsonProperty; import lombok.Data;
@Data @JsonIgnoreProperties(ignoreUnknown = true)
public class ComicVineSummaryResultDTO {
    private int id;
    @JsonProperty("api_detail_url") private String apiDetailUrl;
    @JsonProperty("resource_type") private String resourceType;
    private String name;
    private ComicVineImageDTO image;
    @JsonProperty("issue_number") private String issueNumber;
    @JsonProperty("start_year") private String startYear;
    @JsonProperty("cover_date") private String coverDate;
    private ComicVineVolumeInfoDTO volume;
    private ComicVinePublisherDTO publisher;
    @JsonProperty("first_issue") private FirstIssueDTO firstIssue;
}