package com.cesar.superstats.service;

import com.cesar.superstats.dto.AutocompleteResultDTO;
import jakarta.annotation.PostConstruct;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CsvHeroService {

    private final List<AutocompleteResultDTO> heroList = new ArrayList<>();

    @PostConstruct
    public void loadCsvData() {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(
                new ClassPathResource("heroes.csv").getInputStream(), StandardCharsets.UTF_8))) {
            
            reader.readLine();
            String line;
            while ((line = reader.readLine()) != null) {
                String[] data = line.split(",", 4);

                if (data.length > 2) {
                    AutocompleteResultDTO hero = new AutocompleteResultDTO();
                    hero.setId(data[0].trim());
                    hero.setName(data[1].trim());
                    hero.setFullName(data[2].trim());
                    heroList.add(hero);
                }
            }
            System.out.println(">>> Carregados " + heroList.size() + " heróis do CSV para o autocomplete.");
        } catch (Exception e) {
            System.err.println("!!! Erro ao carregar o arquivo CSV de heróis: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public List<AutocompleteResultDTO> searchByName(String name) {
        if (name == null || name.length() < 2) {
            return List.of();
        }
        String lowerCaseName = name.toLowerCase();
        
        return heroList.stream()
                .filter(hero -> 
                    hero.getName().toLowerCase().contains(lowerCaseName) ||
                    (hero.getFullName() != null && !hero.getFullName().isBlank() && hero.getFullName().toLowerCase().contains(lowerCaseName))
                )
                .limit(7)
                .collect(Collectors.toList());
    }
}