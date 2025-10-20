// src/components/charts/PowerRadarChart.tsx
"use client";

import { useMemo } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip } from 'recharts'; 
import { Character } from '@/types'; // ✅ 1. Importa o tipo correto

// ✅ 2. Componente StatBar extraído e tipado
interface StatBarProps {
  label: string;
  value: number;
}
const StatBar = ({ label, value }: StatBarProps) => (
  <div className="statBarWrapper">
    <span className="statBarLabel">{label}</span>
    <div className="statBarContainer">
      <div className="statBarFill" style={{ width: `${value}%` }}>
        {value}
      </div>
    </div>
  </div>
);


interface PowerRadarChartProps {
    data: Character[];
    selectedCharacter: Character | null;
}

const PowerRadarChart = ({ data, selectedCharacter }: PowerRadarChartProps) => {
  const attributes = useMemo((): (keyof Pick<Character, 'Intelligence' | 'Strength' | 'Speed' | 'Durability' | 'Power' | 'Combat'>)[] => 
    ['Intelligence', 'Strength', 'Speed', 'Durability', 'Power', 'Combat'], []);

  const comparisonData = useMemo(() => {
    // ✅ 3. Tipagem forte na função de cálculo
    const calculateAverage = (filterFn: (d: Character) => boolean) => {
      const filteredData = data.filter(filterFn);
      const averages: { [key: string]: number } = {};
      attributes.forEach(attr => {
        const sum = filteredData.reduce((acc, curr) => acc + (curr[attr] || 0), 0);
        averages[attr] = Math.round(sum / (filteredData.length || 1));
      });
      return averages;
    };

    const avgGood = calculateAverage(d => d.Alignment === 'good');
    const avgBad = calculateAverage(d => d.Alignment === 'bad');
    
    const chartData: Array<{
      subject: keyof Pick<Character, 'Intelligence' | 'Strength' | 'Speed' | 'Durability' | 'Power' | 'Combat'>;
      "Média Heróis": number;
      "Média Vilões": number;
      [key: string]: number | string;
    }> = attributes.map(attr => ({
      subject: attr,
      "Média Heróis": avgGood[attr],
      "Média Vilões": avgBad[attr],
    }));

    if (selectedCharacter) {
      chartData.forEach(item => {
        item[selectedCharacter.Name] = selectedCharacter[item.subject as keyof Character];
      });
    }
    return chartData;
  }, [data, selectedCharacter, attributes]);

  return (
    <div className="card radarCardContainer">
      <h3 className="cardTitle">Comparativo de Atributos de Poder</h3>
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={comparisonData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-primary-color)', fontFamily: 'Permanent Marker' }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <Tooltip />
          <Radar name="Média Heróis" dataKey="Média Heróis" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
          <Radar name="Média Vilões" dataKey="Média Vilões" stroke="#ef4444" fill="#ef4444" fillOpacity={0.5} />
          {selectedCharacter && (
            <Radar name={selectedCharacter.Name} dataKey={selectedCharacter.Name} stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
          )}
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
      
      {selectedCharacter ? (
        <div className="selectedHeroPanel">
          <div className="heroHeader">
            <h4 className="heroName">{selectedCharacter.Name}</h4>
            <span className={`heroBadge ${selectedCharacter.Alignment?.toLowerCase()}`}>
              {selectedCharacter.Alignment}
            </span>
          </div>
          <p className="heroPublisher">{selectedCharacter.Publisher}</p>
          <div className="heroStatsGrid">
            {attributes.map(attr => (
              <StatBar key={attr} label={attr} value={selectedCharacter[attr] as number} />
            ))}
          </div>
        </div>
      ) : (
        <div className="selectionPrompt">
          <p>Clique em um personagem na tabela para ver seus detalhes aqui!</p>
        </div>
      )}
    </div>
  );
};

export default PowerRadarChart;