package com.cesar.superstats.service;

import com.cesar.superstats.dto.PersonagemFinalizeCreateDTO;
import com.cesar.superstats.dto.RespostaDTO;
import com.cesar.superstats.model.entities.Fa;
import com.cesar.superstats.model.entities.Pergunta;
import com.cesar.superstats.model.entities.Personagem;
import com.cesar.superstats.model.entities.Resposta;
import com.cesar.superstats.repository.PerguntaRepository;
import com.cesar.superstats.repository.RespostaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PesquisaService {

    private final RespostaRepository respostaRepository;
    private final PerguntaRepository perguntaRepository;
    private final PersonagemService personagemService;

    public List<Pergunta> getPerguntasDaPesquisa(int pesquisaId) {
        List<Pergunta> perguntas = perguntaRepository.findByPesquisaId(pesquisaId);

        for (Pergunta p : perguntas) {
            if (p.getTextoPergunta().toLowerCase().contains("herói")) {
                p.setAlignmentFilter("good");
            } else if (p.getTextoPergunta().toLowerCase().contains("vilão")) {
                p.setAlignmentFilter("bad");
            }
        }
        return perguntas;
    }

    @Transactional
    public void salvarRespostas(List<RespostaDTO> respostasDto, Fa faLogado) {
        System.out.println("Processando respostas para o usuário: " + faLogado.getUsername());

        for (RespostaDTO dto : respostasDto) {
            PersonagemFinalizeCreateDTO createDto = new PersonagemFinalizeCreateDTO();
            createDto.setApiId(dto.getPersonagemId());
            Personagem personagem = personagemService.findOrCreateFromApi(createDto);

            Pergunta pergunta = new Pergunta();
            pergunta.setId(dto.getPerguntaId());

            Optional<Integer> respostaExistenteId = respostaRepository.findIdByFaAndPergunta(faLogado.getId(), dto.getPerguntaId());

            Resposta novaResposta = new Resposta();
            novaResposta.setFa(faLogado);
            novaResposta.setPergunta(pergunta);
            novaResposta.setPersonagem(personagem);
            novaResposta.setDataResposta(LocalDate.now());

            if (respostaExistenteId.isPresent()) {
                novaResposta.setId(respostaExistenteId.get());
                respostaRepository.update(novaResposta);
                System.out.println("  - Resposta ATUALIZADA no banco: Pergunta " + dto.getPerguntaId() + " -> Personagem " + personagem.getNome());
            } else {
                respostaRepository.save(novaResposta);
                System.out.println("  - Resposta CRIADA no banco: Pergunta " + dto.getPerguntaId() + " -> Personagem " + personagem.getNome());
            }
        }
    }
}