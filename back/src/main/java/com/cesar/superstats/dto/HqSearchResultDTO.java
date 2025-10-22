package com.cesar.superstats.dto;

import lombok.Data;

@Data
public class HqSearchResultDTO {
    private int id;
    private String title;
    private String volumeName;
    private String year;
    private String imageUrl;
    private String resourceType;
    private String apiDetailUrl;
}