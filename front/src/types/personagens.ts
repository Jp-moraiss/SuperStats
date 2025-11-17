// src/types/personagens.ts

export type Personagem = {
  id: number;
  nome: string;
  nomeCompleto?: string;
  editora?: string;
  imagemUrl?: string;
  alinhamento?: string;
  raca?: string;
  genero?: string;
  primeiraAparicao?: string;
  ocupacao?: string;
  naturalidade?: string;
  inteligencia?: number;
  forca?: number;
  velocidade?: number;
  durabilidade?: number;
  poder?: number;
  combate?: number;
  bases?: string[];
  alterEgos?: string[];
};

export type SuperheroApiSearchResult = {
  id: string;
  name: string;
  biography: {
    'full-name': string;
  };
  image: {
    url: string;
  };
  appearance: {
    gender: string;
    race: string;
  };
  publisher: string;
  alignment: string;
  powerstats: {
    intelligence: string;
    strength: string;
    speed: string;
    durability: string;
    power: string;
    combat: string;
  };
};

