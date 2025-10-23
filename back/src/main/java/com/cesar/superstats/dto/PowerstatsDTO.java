package com.cesar.superstats.dto;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties; import lombok.Data;
@Data @JsonIgnoreProperties(ignoreUnknown = true)
public class PowerstatsDTO {
    private String intelligence; private String strength; private String speed;
    private String durability; private String power; private String combat;
}