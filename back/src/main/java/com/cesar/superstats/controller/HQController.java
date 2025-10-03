package com.cesar.superstats.controller;

import com.cesar.superstats.dto.HQDTO;
import com.cesar.superstats.model.entities.Fa;
import com.cesar.superstats.model.entities.HQ;
import com.cesar.superstats.service.HQService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/hqs")
@RequiredArgsConstructor
public class HQController {

    private final HQService service;

    @GetMapping
    public ResponseEntity<List<HQ>> findAll(@AuthenticationPrincipal Fa faLogado) {
        return ResponseEntity.ok(service.findAll(faLogado));
    }

    @GetMapping("/{id}")
    public ResponseEntity<HQ> findById(@PathVariable Integer id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @GetMapping("/titulo")
    public ResponseEntity<List<HQ>> findByTitle(@RequestParam String titulo) {
        return ResponseEntity.ok(service.findByTitle(titulo));
    }

    @GetMapping("/editora")
    public ResponseEntity<List<HQ>> findByEditora(@RequestParam String editora) {
        return ResponseEntity.ok(service.findByEditora(editora));
    }

    @GetMapping("/editoras")
    public ResponseEntity<List<String>> findAllEditoras() {
        return ResponseEntity.ok(service.findAllEditoras());
    }

    @PostMapping
    public ResponseEntity<String> create(@RequestBody HQDTO hqDto) {
        service.create(hqDto);
        return ResponseEntity.status(HttpStatus.CREATED).body("HQ criada com sucesso!");
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> update(@PathVariable Integer id, @RequestBody HQDTO hqDto) {
        service.update(id, hqDto);
        return ResponseEntity.ok("HQ atualizada com sucesso!");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{hqId}/ler")
    public ResponseEntity<Void> marcarComoLido(
            @PathVariable Integer hqId,
            @AuthenticationPrincipal Fa faLogado) {
        service.marcarComoLido(hqId, faLogado);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{hqId}/ler")
    public ResponseEntity<Void> removerDosLidos(
            @PathVariable Integer hqId,
            @AuthenticationPrincipal Fa faLogado) {
        service.removerDosLidos(hqId, faLogado);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/lidos")
    public ResponseEntity<List<HQ>> getHqsLidas(@AuthenticationPrincipal Fa faLogado) {
        return ResponseEntity.ok(service.findLidosPeloFa(faLogado));
    }
}