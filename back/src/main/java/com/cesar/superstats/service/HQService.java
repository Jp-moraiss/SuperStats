package com.cesar.superstats.service;

import com.cesar.superstats.dto.HQDTO;
import com.cesar.superstats.exceptions.ResourceNotFoundException;
import com.cesar.superstats.model.entities.Fa;
import com.cesar.superstats.model.entities.HQ;
import com.cesar.superstats.repository.HQRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HQService {

    private final HQRepository repository;

    public List<HQ> findAll(Fa faLogado) {
        return repository.findAll(faLogado.getId());
    }

    public HQ findById(Integer id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("ID da HQ é inválido: " + id);
        }
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("HQ com ID " + id + " não encontrada."));
    }

    public List<HQ> findByTitle(String titulo) {
        return repository.findByTitle(titulo);
    }

    public List<HQ> findByEditora(String editora) {
        if (editora == null || editora.isBlank()) {
            throw new IllegalArgumentException("Nome da editora não pode ser nulo ou vazio.");
        }
        return repository.findByEditora(editora);
    }

    public List<String> findAllEditoras() {
        return repository.findAllEditoras();
    }

    public void create(HQDTO hqDto) {
        if (hqDto.getTitulo() == null || hqDto.getTitulo().isBlank()) {
            throw new IllegalArgumentException("O título da HQ não pode ser nulo ou vazio.");
        }
        // Converte DTO para Entidade
        HQ hq = new HQ();
        hq.setTitulo(hqDto.getTitulo());
        hq.setEdicao(hqDto.getEdicao());
        hq.setEditora(hqDto.getEditora());
        hq.setDataLancamento(hqDto.getDataLancamento());
        repository.save(hq);
    }

    public void update(Integer id, HQDTO hqDto) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("HQ com ID " + id + " não encontrada para atualização.");
        }
        if (hqDto.getTitulo() == null || hqDto.getTitulo().isBlank()) {
            throw new IllegalArgumentException("O título da HQ não pode ser nulo ou vazio.");
        }
        repository.update(id, hqDto);
    }

    public void deleteById(Integer id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("HQ com ID " + id + " não encontrada para deleção.");
        }
        repository.deleteById(id);
    }

    public void marcarComoLido(Integer hqId, Fa faLogado) {
        if (!repository.existsById(hqId)) {
            throw new ResourceNotFoundException("HQ com ID " + hqId + " não encontrada.");
        }
        repository.marcarComoLido(faLogado.getId(), hqId);
    }

    public void removerDosLidos(Integer hqId, Fa faLogado) {
        repository.removerDosLidos(faLogado.getId(), hqId);
    }


    public List<HQ> findLidosPeloFa(Fa faLogado) {
        return repository.findLidosByFaId(faLogado.getId());
    }
}