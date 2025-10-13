// app/components/ComparisonRadarChart.tsx
"use client";

import { useMemo } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { Character } from './useSuperheroes'; // Ajuste o caminho se necessário

interface ComparisonRadarChartProps {
  character1: Character | null;
  character2: Character | null;
}

const ComparisonRadarChart: React.FC<ComparisonRadarChartProps> = ({ character1, character2 }) => {
  // O gráfico só será renderizado se ambos os personagens estiverem selecionados
  if (!character1 || !character2) {
    return null;
  }

  // Prepara os dados no formato que o Recharts espera
  const chartData = useMemo(() => {
    const stats: (keyof Character)[] = ['Intelligence', 'Strength', 'Speed', 'Durability', 'Power', 'Combat'];
    
    return stats.map(stat => ({
      subject: stat, // O nome do atributo (ex: 'Força')
      // Valor do personagem 1 para este atributo
      [character1.Name]: character1[stat] as number, 
      // Valor do personagem 2 para este atributo
      [character2.Name]: character2[stat] as number,
      fullMark: 100, // O valor máximo do eixo (poderes são de 0-100)
    }));
  }, [character1, character2]);

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
          
          {/* Radar para o Personagem 1 */}
          <Radar 
            name={character1.Name} 
            dataKey={character1.Name} 
            stroke="var(--accent-color-1)" 
            fill="var(--accent-color-1)" 
            fillOpacity={0.6} 
          />
          
          {/* Radar para o Personagem 2 */}
          <Radar 
            name={character2.Name} 
            dataKey={character2.Name} 
            stroke="var(--accent-color-2)" 
            fill="var(--accent-color-2)" 
            fillOpacity={0.6} 
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ComparisonRadarChart;