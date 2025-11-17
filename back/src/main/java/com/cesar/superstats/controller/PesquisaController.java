package com.cesar.superstats.controller;

import com.cesar.superstats.dto.ChartDataDTO;
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

    @GetMapping("/resultados/heroi-preferido")
    public ResponseEntity<List<ChartDataDTO>> getResultadosHeroiPreferido() {
        return ResponseEntity.ok(pesquisaService.getVotosPorPergunta(1));
    }

    @GetMapping("/resultados/vilao-preferido")
    public ResponseEntity<List<ChartDataDTO>> getResultadosVilaoPreferido() {
        return ResponseEntity.ok(pesquisaService.getVotosPorPergunta(2));
    }

    @GetMapping("/resultados/personagem-mais-forte")
    public ResponseEntity<List<ChartDataDTO>> getResultadosPersonagemMaisForte() {
        return ResponseEntity.ok(pesquisaService.getVotosPorPergunta(3));
    }

    @GetMapping("/resultados/personagem-mais-inteligente")
    public ResponseEntity<List<ChartDataDTO>> getResultadosPersonagemMaisInteligente() {
        return ResponseEntity.ok(pesquisaService.getVotosPorPergunta(4));
    }

    @GetMapping("/resultados/personagem-mais-rapido")
    public ResponseEntity<List<ChartDataDTO>> getResultadosPersonagemMaisRapido() {
        return ResponseEntity.ok(pesquisaService.getVotosPorPergunta(5));
    }
}