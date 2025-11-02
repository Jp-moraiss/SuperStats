package com.cesar.superstats.controller;

import com.cesar.superstats.dto.*;
import com.cesar.superstats.model.entities.Fa;
import com.cesar.superstats.service.FaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/fa")
public class FaController {

    private final FaService service;

    public FaController(FaService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Fa>> findAll() {
        List<Fa> faList = service.findAll();
        return faList.isEmpty()
                ? new ResponseEntity<>(HttpStatus.NO_CONTENT)
                : new ResponseEntity<>(faList, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Fa> findById(@PathVariable Integer id) {
        Optional<Fa> fa = service.findById(id);
        return fa.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<Fa> findByEmail(@PathVariable String email) {
        Optional<Fa> fa = service.findByEmail(email);
        return fa.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<Fa> findByUsername(@PathVariable String username) {
        Optional<Fa> fa = service.findByUsername(username);
        return fa.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<String> save(@RequestBody FaDTO faDTO) {
        try {
            service.save(faDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body("Fã cadastrado com sucesso!");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> update(@PathVariable Integer id, @RequestBody FaDTO faDTO) {
        try {
            service.update(id, faDTO);
            return ResponseEntity.ok("Fã atualizado com sucesso!");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/perfil/{id}")
    public ResponseEntity<Void> atualizarPerfil(@PathVariable Integer id, @RequestBody FaUpdatePerfilDTO dto) {
        service.atualizarPerfil(id, dto);
        return ResponseEntity.noContent().build(); // Retorna 204 No Content, indicando sucesso
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteById(@PathVariable Integer id) {
        try {
            service.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/por-filme-assistido")
    public ResponseEntity<List<FaDTO>> getFasPorFilmeAssistido(@RequestParam("titulo") String tituloFilme) {
        List<FaDTO> fasEncontrados = service.findFasPorFilmeAssistido(tituloFilme);
        return ResponseEntity.ok(fasEncontrados);
    }

    @GetMapping("/perfil-consumo")
    public ResponseEntity<List<FaConsumoDTO>> getPerfilDeConsumoDosFas() {
        List<FaConsumoDTO> perfil = service.getPerfilDeConsumo();
        return ResponseEntity.ok(perfil);
    }

    @GetMapping("/perfil-atividade/{id}")
    public ResponseEntity<PerfilAtividadeFaDTO> getPerfilDeAtividade(@PathVariable Integer id) {
        return ResponseEntity.ok(service.getPerfilAtividade(id));
    }

    @GetMapping("/perfil-completo/{id}")
    public ResponseEntity<PerfilCompletoResponseDTO> getPerfilCompleto(@PathVariable Integer id) {
        return ResponseEntity.ok(service.getPerfilCompleto(id));
    }
}

