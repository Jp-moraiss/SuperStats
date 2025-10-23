package com.cesar.superstats.dto;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties; import lombok.Data;

import java.util.List;

@Data @JsonIgnoreProperties(ignoreUnknown = true)
public class AppearanceDTO {
    private String gender; private String race;

    private List<String> height;
    private List<String> weight;
}