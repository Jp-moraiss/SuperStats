// src/lib/superheroes.ts
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { Character, DashboardFilter } from '@/types';

let cachedData: Character[] = [];

// ✅ 1. ADICIONADO 'Alter Egos' à interface de dados brutos
interface RawCharacterData {
  Name?: string | null;
  Alignment?: string | null;
  Gender?: string | null;
  Publisher?: string | null;
  Intelligence?: number | null;
  Strength?: number | null;
  Speed?: number | null;
  Durability?: number | null;
  Power?: number | null;
  Combat?: number | null;
  Height?: string | null;
  Weight?: string | null;
  'Alter Egos'?: string | null; // <-- Propriedade adicionada
}

const parseDimension = (s: string | null | undefined): number => {
  if (!s || s === '-') return 0;
  const match = s.match(/(\d+)\s*(cm|kg)?$/);
  return match ? parseInt(match[1], 10) : 0;
};

const processData = (data: RawCharacterData[]): Character[] => {
  return data
    .filter(d => d.Name && d.Name.trim() !== '')
    .map((d, index) => ({
      id: index,
      Name: d.Name!,
      Alignment: d.Alignment || 'neutral',
      Gender: d.Gender || 'Unknown',
      Publisher: d.Publisher || 'Unknown',
      Intelligence: d.Intelligence || 0,
      Strength: d.Strength || 0,
      Speed: d.Speed || 0,
      Durability: d.Durability || 0,
      Power: d.Power || 0,
      Combat: d.Combat || 0,
      TotalPower: (d.Intelligence || 0) + (d.Strength || 0) + (d.Speed || 0) + (d.Durability || 0) + (d.Power || 0) + (d.Combat || 0),
      Height: parseDimension(d.Height),
      Weight: parseDimension(d.Weight),
      // ✅ 2. ADICIONADO 'Alter Egos' ao objeto final do personagem
      'Alter Egos': d['Alter Egos'] || 'No', // <-- Propriedade adicionada com um valor padrão
    } as Character));
};

// O resto do arquivo (getSuperheroes, etc.) permanece igual...
export const getSuperheroes = (filter: DashboardFilter = null): Character[] => {
  if (cachedData.length === 0) {
    const filePath = path.join(process.cwd(), 'public', 'data', 'superheroData.csv');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    const results = Papa.parse<RawCharacterData>(fileContent, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
    });
    
    cachedData = processData(results.data);
    console.log('CSV data parsed and cached on the server.');
  }

  if (!filter) return cachedData;
  if (filter.type === 'alignment') {
    return cachedData.filter(char => char.Alignment === filter.value);
  }
  if (filter.type === 'publisher') {
    return cachedData.filter(char => char.Publisher === filter.value);
  }
  
  return cachedData;
};

export const getAllSuperheroes = (): Character[] => {
    if (cachedData.length === 0) {
        getSuperheroes(); 
    }
    return cachedData;
};