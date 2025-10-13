// hooks/useSuperheroes.ts
import { useEffect, useState, useMemo, useCallback } from 'react'; // Adicionado useCallback
import Papa from 'papaparse';

// ... (sua interface Character e DashboardFilter permanecem as mesmas)
export interface Character {
  Name: string; Intelligence: number; Strength: number; Speed: number;
  Durability: number; Power: number; Combat: number; Publisher: string;
  Alignment: string; Gender: string; TotalPower: number;
  'Alter Egos': string; Height: number; Weight: number;
}

export type DashboardFilter =
  | { type: 'alignment'; value: 'good' | 'bad' | 'neutral' }
  | { type: 'publisher'; value: 'Marvel Comics' | 'DC Comics' }
  | null;

let cachedData: Character[] = [];

export const useSuperheroes = (filter: DashboardFilter = null) => {
  const [allData, setAllData] = useState<Character[]>(cachedData);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (cachedData.length > 0) {
      setIsLoading(false);
      return;
    }

    const parseHeight = (s: string) => s && parseInt(s.match(/(\d+)\s*cm/)?.[1] || '0', 10);
    const parseWeight = (s: string) => s && parseInt(s.match(/(\d+)\s*kg/)?.[1] || '0', 10);

    const fetchData = async () => {
      const response = await fetch('/data/superheroData.csv');
      const text = await response.text();
      Papa.parse<any>(text, {
        header: true, dynamicTyping: true, skipEmptyLines: true,
        complete: (results) => {
          const processedData = results.data
            .filter(d => d.Name && d.Name.trim() !== '')
            .map(d => ({
              ...d,
              Intelligence: d.Intelligence || 0, // Garante que não é null
              Strength: d.Strength || 0,
              Speed: d.Speed || 0,
              Durability: d.Durability || 0,
              Power: d.Power || 0,
              Combat: d.Combat || 0,
              TotalPower: (d.Intelligence || 0) + (d.Strength || 0) + (d.Speed || 0) + (d.Durability || 0) + (d.Power || 0) + (d.Combat || 0),
              Height: parseHeight(d.Height),
              Weight: parseWeight(d.Weight),
            }));
          cachedData = processedData;
          setAllData(processedData);
          setIsLoading(false);
        },
      });
    };

    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    if (!filter) return allData;

    if (filter.type === 'alignment') {
      return allData.filter(char => char.Alignment === filter.value);
    }
    if (filter.type === 'publisher') {
      return allData.filter(char => char.Publisher === filter.value);
    }
    return allData;
  }, [allData, filter]);

  // Novo: Função para buscar um personagem pelo nome
  const getCharacterByName = useCallback((name: string): Character | undefined => {
    return allData.find(char => char.Name.toLowerCase() === name.toLowerCase());
  }, [allData]);


  return { data: filteredData, isLoading, getCharacterByName, allData }; // Retorna allData também
};