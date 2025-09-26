package com.cesar.superstats.controller;

import com.cesar.superstats.dto.FilmeDTO;
import com.cesar.superstats.model.entities.Filme;
import com.cesar.superstats.service.FilmeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public List<Filme> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Filme> getById(@PathVariable Integer id) {
        Filme filme = service.findById(id);
        return ResponseEntity.ok(filme);
    }

    @GetMapping("/titulo/{titulo}")
    public ResponseEntity<List<Filme>> getByTitle(@PathVariable String titulo) {
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
}

