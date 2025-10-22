package com.cesar.superstats.dto;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties; import lombok.Data; import java.util.List;
@Data @JsonIgnoreProperties(ignoreUnknown = true)
public class ComicVineResponseWrapperDTO {
    private List<ComicVineSummaryResultDTO> results;
}