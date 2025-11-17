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

export type CriadorInfo = {
  id: number;
  username: string;
};

export type PersonagemComunidade = {
  id: number;
  nome: string;
  alinhamento?: string | null;
  poder?: string | null;
  genero?: string | null;
  altura?: number | null;
  peso?: number | null;
  criador?: CriadorInfo | null;
};

export type ContagemAlinhamento = {
  alinhamento: string;
  total: number;
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

