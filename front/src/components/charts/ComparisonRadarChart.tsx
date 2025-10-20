"use client";

import { useMemo } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { Character } from '@/types';

interface ComparisonRadarChartProps {
  character1: Character | null;
  character2: Character | null;
}

const ComparisonRadarChart: React.FC<ComparisonRadarChartProps> = ({ character1, character2 }) => {
  // ✅ HOOK MOVIDO PARA O TOPO: O useMemo é chamado em todas as renderizações.
  const chartData = useMemo(() => {
    // Se um dos personagens não existir, retorna um array vazio.
    if (!character1 || !character2) {
      return [];
    }

    const stats: (keyof Pick<Character, 'Intelligence' | 'Strength' | 'Speed' | 'Durability' | 'Power' | 'Combat'>)[] = 
      ['Intelligence', 'Strength', 'Speed', 'Durability', 'Power', 'Combat'];
    
    return stats.map(stat => ({
      subject: stat,
      [character1.Name]: character1[stat], 
      [character2.Name]: character2[stat],
      fullMark: 100,
    }));
  }, [character1, character2]);

  // ✅ A VERIFICAÇÃO AGORA OCORRE DEPOIS DOS HOOKS: Apenas para a lógica de renderização.
  if (!character1 || !character2) {
    return null;
  }

  return (
    <div className="card" style={{ marginTop: '2.5rem', minHeight: '450px' }}>
      <h3 className="cardTitle">Comparação de Atributos</h3>
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#333', fontSize: 14 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--color-secondary)', 
              borderColor: 'var(--color-accent)',
              color: '#fff'
            }}
          />
          <Legend />
          
          <Radar 
            name={character1.Name} 
            dataKey={character1.Name} 
            stroke="var(--color-primary)" 
            fill="var(--color-primary)" 
            fillOpacity={0.6} 
          />
          
          <Radar 
            name={character2.Name} 
            dataKey={character2.Name} 
            stroke="var(--color-accent)" 
            fill="var(--color-accent)" 
            fillOpacity={0.6} 
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ComparisonRadarChart;