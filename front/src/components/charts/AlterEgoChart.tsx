// src/components/charts/AlterEgoChart.tsx
"use client";

import { useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts'; 
import { Character } from '@/types';

interface AlterEgoChartProps {
  data: Character[];
}

const AlterEgoChart = ({ data }: AlterEgoChartProps) => {
  // ✅ 1. Nomes das chaves e das fatias ajustados para clareza
  const COLORS: { [key: string]: string } = { 'Sim': '#10b981', 'Não': '#64748b' };

  const chartData = useMemo(() => {
    // ✅ 2. Lógica de reduce robusta que agrupa corretamente 'Yes' vs. o resto
    const counts = data.reduce((acc: Record<string, number>, curr) => { 
      const hasAlterEgo = curr['Alter Egos'] === 'Yes' ? 'Sim' : 'Não';
      acc[hasAlterEgo] = (acc[hasAlterEgo] || 0) + 1;
      return acc;
    }, { 'Sim': 0, 'Não': 0 }); // Inicializa com ambas as chaves para garantir que apareçam
    
    return Object.entries(counts).map(([name, value]) => ({ name: `Identidade Secreta: ${name}`, value }));
  }, [data]);

  return (
    <div className="card">
      <h3 className="cardTitle">Identidade Secreta</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} labelLine={false}>
            {chartData.map((entry) => (
              // ✅ 3. Lógica de cores simplificada e correta
              <Cell key={entry.name} fill={COLORS[entry.name.includes('Sim') ? 'Sim' : 'Não']} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AlterEgoChart;