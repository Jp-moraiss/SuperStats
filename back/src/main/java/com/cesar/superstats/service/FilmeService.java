package com.cesar.superstats.service;

import com.cesar.superstats.dto.*;
import com.cesar.superstats.exceptions.ResourceNotFoundException;
import com.cesar.superstats.model.entities.Fa;
import com.cesar.superstats.model.entities.Filme;
import com.cesar.superstats.repository.FilmeRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class FilmeService {

    private final FilmeRepository repository;
    private final TMDBService tmdbService;

    public FilmeService(FilmeRepository repository, TMDBService tmdbService) {
        this.repository = repository;
        this.tmdbService = tmdbService;
    }

    public List<Filme> findAll(Fa faLogado) {
        return repository.findAll(faLogado.getId());
    }

    public Filme findById(Integer id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Id de filme inválido: " + id);
        }

        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Filme de id " + id + " não encontrado"));
    }

    public List<Filme> findByTitle(String titulo) {
        List<Filme> filmes = repository.findByTitle(titulo);
        if (filmes.isEmpty()) {
            throw new ResourceNotFoundException("Nenhum filme encontrado com o título: " + titulo);
        }
        return filmes;
    }

    public List<Filme> findByProdutora(String produtora) {
        if (produtora == null || produtora.isBlank()) {
            throw new IllegalArgumentException("Produtora não pode ser nula ou vazia");
        }
        return repository.findByProdutora(produtora);
    }

    public List<TmdbMovieResult> buscarFilmesExternos(String titulo) {
        TmdbSearchResponse response = tmdbService.buscarFilmes(titulo);
        if (response == null || response.getResults() == null || response.getResults().isEmpty()) {
            return List.of();
        }
        return response.getResults();
    }

    public Filme createFromApi(FilmeFinalizeCreateDTO dto) {
        if (dto.getTmdbId() <= 0) {
            throw new IllegalArgumentException("O ID do TMDB é obrigatório para criar o filme.");
        }

        int movieId = dto.getTmdbId();


        TmdbMovieDetailsDTO detalhes = tmdbService.buscarDetalhes(movieId);
        TmdbCreditsDTO creditos = tmdbService.buscarCreditos(movieId);
        TmdbVideosResponseDTO videos = tmdbService.buscarVideos(movieId);

        if(detalhes == null) {
            throw new ResourceNotFoundException("Não foi possível encontrar detalhes para o filme com ID: " + movieId);
        }

        Filme filme = new Filme();
        filme.setTitulo(detalhes.getTitle());
        filme.setPosterUrl("https://image.tmdb.org/t/p/w500" + detalhes.getPosterPath());
        filme.setAvaliacaoTmdb(BigDecimal.valueOf(detalhes.getVoteAverage()));

        try {
            if (detalhes.getReleaseDate() != null && !detalhes.getReleaseDate().isEmpty()) {
                filme.setDataLancamento(LocalDate.parse(detalhes.getReleaseDate()));
            }
        } catch (Exception e) {
            filme.setDataLancamento(null);
        }

        if (detalhes.getProductionCompanies() != null && !detalhes.getProductionCompanies().isEmpty()) {
            filme.setProdutora(detalhes.getProductionCompanies().get(0).getName());
        }

        if (creditos.getCrew() != null) {
            creditos.getCrew().stream()
                    .filter(membro -> "Director".equalsIgnoreCase(membro.getJob()))
                    .findFirst()
                    .ifPresent(diretor -> filme.setDiretor(diretor.getName()));
        }

        if (videos.getResults() != null) {
            videos.getResults().stream()
                    .filter(video -> "YouTube".equalsIgnoreCase(video.getSite()) && "Trailer".equalsIgnoreCase(video.getType()))
                    .findFirst()
                    .ifPresent(trailer -> filme.setTrailerUrl("https://www.youtube.com/watch?v=" + trailer.getKey()));
        }

        return repository.save(filme);
    }

    public void update(Integer id, FilmeDTO filme) {
        if (id == null) {
            throw new ResourceNotFoundException("Id não pode ser nulo");
        }
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Filme de id " + id + " não encontrado");
        }
        if (filme.getTitulo() == null || filme.getTitulo().isBlank()) {
            throw new IllegalArgumentException("Título não pode ser nulo ou vazio");
        }
        if (filme.getDataLancamento() == null) {
            throw new IllegalArgumentException("Data de lançamento não pode ser nula");
        }

        repository.update(id, filme);
    }

    public void deleteById(Integer id) {
        if (id == null) {
            throw new ResourceNotFoundException("Id não pode ser nulo");
        }
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Filme de id " + id + " não encontrado");
        }
        repository.deleteById(id);
    }

    public List<String> findAllProdutoras() {
        return repository.findAllProdutoras();
    }

    public void marcarComoAssistido(Integer filmeId, Fa faLogado) {
        if (!repository.existsById(filmeId)) {
            throw new RuntimeException("Filme com ID " + filmeId + " não encontrado.");
        }
        repository.marcarComoAssistido(faLogado.getId(), filmeId);
    }

    public void removerDosAssistidos(Integer filmeId, Fa faLogado) {
        repository.removerDosAssistidos(faLogado.getId(), filmeId);
    }

    public List<Filme> findAssistidosPeloFa(Fa faLogado) {
        return repository.findAssistidosByFaId(faLogado.getId());
    }
}
