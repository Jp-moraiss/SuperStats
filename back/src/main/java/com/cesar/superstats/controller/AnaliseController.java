package com.cesar.superstats.controller;

import com.cesar.superstats.dto.PopularidadeEmpresaDTO;
import com.cesar.superstats.service.AnaliseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/analises")
@RequiredArgsConstructor
public class AnaliseController {

    private final AnaliseService service;

    @GetMapping("/popularidade-empresas")
    public ResponseEntity<List<PopularidadeEmpresaDTO>> getPopularidadeDeEmpresas() {
        return ResponseEntity.ok(service.getPopularidadeEmpresas());
    }

    @PostMapping("/processar-conquistas")
    public ResponseEntity<String> processarConquistas() {
        service.processarConquistasEmLote();
        return ResponseEntity.ok("Processamento de conquistas em lote iniciado com sucesso.");
    }
}