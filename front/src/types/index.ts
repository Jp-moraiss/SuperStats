// src/types/index.ts

// A definição principal para um personagem
export interface Character {
  id: number;
  Name: string;
  Alignment: 'good' | 'bad' | 'neutral' | string;
  Gender: string;
  Publisher: 'Marvel Comics' | 'DC Comics' | string;
  Intelligence: number;
  Strength: number;
  Speed: number;
  Durability: number;
  Power: number;
  Combat: number;
  TotalPower: number;
  Height: number;
  Weight: number;
  'Alter Egos': string;
}

// O tipo para o filtro que usamos no dashboard
export type DashboardFilter =
  | { type: 'alignment'; value: 'good' | 'bad' | 'neutral' }
  | { type: 'publisher'; value: 'Marvel Comics' | 'DC Comics' }
  | null;