package com.cesar.superstats.controller;

import com.cesar.superstats.dto.PersonagemNovoDTO;
import com.cesar.superstats.model.entities.Fa;
import com.cesar.superstats.model.entities.PersonagemNovo;
import com.cesar.superstats.service.PersonagemNovoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.nio.file.AccessDeniedException;
import java.util.List;

@RestController
@RequestMapping("/personagens-novos")
@RequiredArgsConstructor
public class PersonagemNovoController {

    private final PersonagemNovoService service;

    @GetMapping
    public ResponseEntity<List<PersonagemNovo>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/meus")
    public ResponseEntity<List<PersonagemNovo>> findMine(@AuthenticationPrincipal Fa faLogado) {
        List<PersonagemNovo> meusPersonagens = service.findByCreator(faLogado);
        return ResponseEntity.ok(meusPersonagens);
    }

    @PostMapping
    public ResponseEntity<String> create(@RequestBody PersonagemNovoDTO dto, @AuthenticationPrincipal Fa faLogado) {
        try {
            service.create(dto, faLogado);
            return ResponseEntity.status(HttpStatus.CREATED).body("Personagem criado com sucesso!");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id, @AuthenticationPrincipal Fa faLogado) {
        try {
            service.deleteById(id, faLogado);
            return ResponseEntity.noContent().build();
        } catch (AccessDeniedException e) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, e.getMessage());
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }
}