package com.cesar.superstats.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ComicVineVolumeDetailsDTO {
    private ComicVinePublisherDTO publisher;
}