// src/types/pesquisa.ts

export interface Pergunta {
  id: number;
  tipo: string;
  textoPergunta: string;
  fk_Pesquisa_id?: number;
}

export interface RespostaDTO {
  perguntaId: number;
  personagemId: string;
}

export interface PersonagemAutocomplete {
  id: string;
  name: string;
  fullName?: string;
}

