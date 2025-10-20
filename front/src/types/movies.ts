// src/types/movies.ts
export type Movie = {
  id: number;
  titulo: string;
  produtora: string;
  diretor: string;
  posterUrl: string;
  trailerUrl?: string;
  avaliacaoTmdb: number;
  assistido: boolean;
};

export type TmdbMovie = {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
};