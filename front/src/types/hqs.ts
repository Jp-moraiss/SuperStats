// src/types/hqs.ts

export type Hq = {
  id: number;
  titulo: string;
  volumeName: string;
  editora: string;
  coverUrl: string;
  lido: boolean;
  // Campos Adicionados
  edicao?: string;
  dataLancamento?: string; // Esperado no formato YYYY-MM-DD
};

export type ComicVineSearchResult = {
  id?: number; // ID (usado para volumes)
  title: string;
  imageUrl: string;
  volumeName: string;
  year: string;
  apiDetailUrl: string; // URL (usado para issues)
  resourceType: string; // 'issue' ou 'volume'
};