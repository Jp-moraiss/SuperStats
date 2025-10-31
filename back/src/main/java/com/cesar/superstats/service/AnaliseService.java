package com.cesar.superstats.service; // Verifique o pacote

import com.cesar.superstats.dto.PopularidadeEmpresaDTO;
import com.cesar.superstats.repository.AnaliseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class AnaliseService {

    private final AnaliseRepository repository;

    public List<PopularidadeEmpresaDTO> getPopularidadeEmpresas() {
        return repository.findPopularidadeEmpresas();
    }
}