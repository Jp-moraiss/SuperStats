package com.cesar.superstats.controller;

import com.cesar.superstats.dto.FilmeDTO;
import com.cesar.superstats.model.entities.Fa;
import com.cesar.superstats.model.entities.Filme;
import com.cesar.superstats.service.FilmeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/filmes")
public class FilmeController {

    private final FilmeService service;

    public FilmeController(FilmeService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Filme>> findAll(@AuthenticationPrincipal Fa faLogado) { // <-- MUDANÇA
        return ResponseEntity.ok(service.findAll(faLogado)); // <-- MUDANÇA
    }

    @GetMapping("/{id}")
    public ResponseEntity<Filme> getById(@PathVariable Integer id) {
        Filme filme = service.findById(id);
        return ResponseEntity.ok(filme);
    }

    // Altere de @PathVariable para @RequestParam
    @GetMapping("/titulo") // Remova o {titulo} daqui
    public ResponseEntity<List<Filme>> getByTitle(@RequestParam String titulo) { // Adicione @RequestParam
        return ResponseEntity.ok(service.findByTitle(titulo));
    }


    @GetMapping("/produtora")
    public ResponseEntity<List<Filme>> getByProdutora(@RequestParam String produtora) {
        List<Filme> filmes = service.findByProdutora(produtora);
        return ResponseEntity.ok(filmes);
    }

    @PostMapping
    public ResponseEntity<Void> create(@RequestBody Filme filme) {
        service.save(filme);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@PathVariable Integer id, @RequestBody FilmeDTO filme) {
        service.update(id, filme);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/produtoras") // Novo endpoint
    public ResponseEntity<List<String>> getAllProdutoras() {
        List<String> produtoras = service.findAllProdutoras();
        return ResponseEntity.ok(produtoras);
    }

    @PostMapping("/{filmeId}/assistir")
    public ResponseEntity<Void> marcarComoAssistido(
            @PathVariable Integer filmeId,
            @AuthenticationPrincipal Fa faLogado) {
        service.marcarComoAssistido(filmeId, faLogado);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{filmeId}/assistir") // <-- NOVO ENDPOINT
    public ResponseEntity<Void> removerDosAssistidos(
            @PathVariable Integer filmeId,
            @AuthenticationPrincipal Fa faLogado) {
        service.removerDosAssistidos(filmeId, faLogado);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/assistidos")
    public ResponseEntity<List<Filme>> getFilmesAssistidos(@AuthenticationPrincipal Fa faLogado) {
        List<Filme> filmes = service.findAssistidosPeloFa(faLogado);
        return ResponseEntity.ok(filmes);
    }
}

