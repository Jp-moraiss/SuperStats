package com.cesar.superstats.controller;

import com.cesar.superstats.dto.PersonagemCreateDTO; // Crie este DTO simples
import com.cesar.superstats.dto.PersonagemFinalizeCreateDTO;
import com.cesar.superstats.dto.SuperheroApiResponseDTO;
import com.cesar.superstats.dto.SuperheroSearchResponseDTO;
import com.cesar.superstats.model.entities.Personagem;
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

    @GetMapping("/buscar-externo")
    public ResponseEntity<List<SuperheroApiResponseDTO>> buscarPersonagensExternos(@RequestParam String nome) {
        SuperheroSearchResponseDTO response = superheroApiService.buscarPersonagem(nome);
        return ResponseEntity.ok(response.getResults());
    }

    @PostMapping
    public ResponseEntity<Personagem> create(@RequestBody PersonagemFinalizeCreateDTO dto) {
        Personagem personagemSalvo = personagemService.createFromApi(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(personagemSalvo);
    }

    @GetMapping
    public ResponseEntity<List<Personagem>> findAll() {
        return ResponseEntity.ok(personagemService.findAll());
    }
}