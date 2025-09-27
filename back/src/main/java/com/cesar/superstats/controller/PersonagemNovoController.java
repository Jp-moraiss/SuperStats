package com.cesar.superstats.controller;

import com.cesar.superstats.dto.ContagemAlinhamentoDTO;
import com.cesar.superstats.dto.PersonagemNovoDTO;
import com.cesar.superstats.dto.PersonagemNovoResponseDTO;
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
import java.util.Optional;

@RestController
@RequestMapping("/personagens-novos")
@RequiredArgsConstructor
public class PersonagemNovoController {

    private final PersonagemNovoService service;

    @GetMapping
    public ResponseEntity<List<PersonagemNovoResponseDTO>> findAll() { // <-- MUDOU O TIPO
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/meus")
    public ResponseEntity<List<PersonagemNovoResponseDTO>> findMine(@AuthenticationPrincipal Fa faLogado) { // <-- MUDOU O TIPO
        return ResponseEntity.ok(service.findByCreator(faLogado));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PersonagemNovoResponseDTO> findById(@PathVariable Integer id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @GetMapping("/alinhamento/{alinhamento}")
    public ResponseEntity<List<PersonagemNovoResponseDTO>> findByAlinhamento(@PathVariable String alinhamento) { // <-- MUDOU O TIPO
        return ResponseEntity.ok(service.findByAlinhamento(alinhamento));
    }

    @GetMapping("/estatisticas/contagem-por-alinhamento")
    public ResponseEntity<List<ContagemAlinhamentoDTO>> getContagemPorAlinhamento() {
        return ResponseEntity.ok(service.getContagemPorAlinhamento());
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
        service.deleteById(id, faLogado);
        return ResponseEntity.noContent().build();
    }
}