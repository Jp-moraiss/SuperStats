package com.cesar.superstats.controller;

import com.cesar.superstats.dto.RespostaDTO;
import com.cesar.superstats.model.entities.Fa;
import com.cesar.superstats.model.entities.Pergunta;
import com.cesar.superstats.service.PesquisaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pesquisas")
@RequiredArgsConstructor
public class PesquisaController {

    private final PesquisaService pesquisaService;

    @GetMapping("/{id}/perguntas")
    public ResponseEntity<List<Pergunta>> getPerguntas(@PathVariable Integer id) {
        return ResponseEntity.ok(pesquisaService.getPerguntasDaPesquisa(id));
    }

    @PostMapping("/{id}/respostas")
    public ResponseEntity<Void> salvarRespostas(
            @RequestBody List<RespostaDTO> respostas,
            @AuthenticationPrincipal Fa faLogado
    ) {
        pesquisaService.salvarRespostas(respostas, faLogado);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}