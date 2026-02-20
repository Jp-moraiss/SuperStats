package com.cesar.superstats.controller;

import com.cesar.superstats.dto.*;
import com.cesar.superstats.model.entities.Fa;
import com.cesar.superstats.model.entities.HQ;
import com.cesar.superstats.service.ComicVineService;
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
    private final ComicVineService comicVineService;


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

    @GetMapping("/buscar-externo")
    public ResponseEntity<List<HqSearchResultDTO>> buscarHqsExternas(@RequestParam String titulo) {
        return ResponseEntity.ok(service.buscarHqsExternas(titulo));
    }

    @GetMapping("/buscar-volume-issues")
    public ResponseEntity<List<HqSearchResultDTO>> buscarIssuesDeVolume(@RequestParam int volumeId) {
        return ResponseEntity.ok(comicVineService.buscarIssuesDeVolume(volumeId));
    }

    @PostMapping
    public ResponseEntity<HQ> create(@RequestBody HqFinalizeCreateDTO dto) {
        HQ hqCriada = service.createFromApi(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(hqCriada);
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

    @PostMapping("/{hqId}/toggle-read")
    public ResponseEntity<Void> toggleReadStatus(
            @PathVariable Integer hqId,
            @AuthenticationPrincipal Fa faLogado) {
        service.toggleReadStatus(hqId, faLogado);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/lidos")
    public ResponseEntity<List<HQ>> getHqsLidas(@AuthenticationPrincipal Fa faLogado) {
        return ResponseEntity.ok(service.findLidosPeloFa(faLogado));
    }

    @GetMapping("/lidos/fa/{faId}")
    public ResponseEntity<List<HQ>> getHqsLidasPorFa(@PathVariable Integer faId) {
        return ResponseEntity.ok(service.findLidosPeloFa(faId));
    }

    @GetMapping("/nao-lidas")
    public ResponseEntity<List<HQ>> getHQsNaoLidas() {
        return ResponseEntity.ok(service.findHQsNaoLidasPorNinguem());
    }
}