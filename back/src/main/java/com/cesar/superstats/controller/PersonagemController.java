package com.cesar.superstats.controller;

import com.cesar.superstats.dto.*;
import com.cesar.superstats.model.entities.Personagem;
import com.cesar.superstats.service.CsvHeroService;
import com.cesar.superstats.service.PersonagemService;
import com.cesar.superstats.service.SuperheroApiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/personagens")
@RequiredArgsConstructor
public class PersonagemController {

    private final PersonagemService personagemService;
    private final SuperheroApiService superheroApiService;
    private final CsvHeroService csvHeroService;

    @GetMapping("/buscar-externo")
    public ResponseEntity<List<SuperheroApiResponseDTO>> buscarPersonagensExternos(@RequestParam String nome) {
        SuperheroSearchResponseDTO response = superheroApiService.buscarPersonagemPorNome(nome);
        return ResponseEntity.ok(response.getResults());
    }

    @PostMapping
    public ResponseEntity<Personagem> create(@RequestBody PersonagemFinalizeCreateDTO dto) {
        Personagem personagemSalvo = personagemService.findOrCreateFromApi(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(personagemSalvo);
    }

    @GetMapping
    public ResponseEntity<List<Personagem>> findAll() {
        return ResponseEntity.ok(personagemService.findAll());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Personagem>> findByNome(@RequestParam String nome, @RequestParam(required = false) String alignment) {
        return ResponseEntity.ok(personagemService.findByName(nome, alignment));
    }

    @GetMapping("/autocomplete")
    public ResponseEntity<List<AutocompleteResultDTO>> autocomplete(@RequestParam String nome) {
        return ResponseEntity.ok(csvHeroService.searchByName(nome));
    }

}