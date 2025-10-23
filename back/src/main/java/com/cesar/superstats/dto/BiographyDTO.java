// Em BiographyDTO.java
package com.cesar.superstats.dto;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.List; // Importe a List

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class BiographyDTO {
    @JsonProperty("full-name") private String fullName;
    @JsonProperty("alter-egos") private String alterEgos; // <-- ADICIONE ESTA LINHA
    private List<String> aliases;
    @JsonProperty("place-of-birth") private String placeOfBirth;
    @JsonProperty("first-appearance") private String firstAppearance;
    private String publisher;
    private String alignment;
}