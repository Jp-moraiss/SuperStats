// src/types/hqs.ts
export type Hq = {
  id: number;
  titulo: string;
  volumeName: string;
  editora: string;
  coverUrl: string;
  lido: boolean;
};

export type ComicVineSearchResult = {
  title: string;
  imageUrl: string;
  volumeName: string;
  year: string;
  apiDetailUrl: string;
  resourceType: string;
};