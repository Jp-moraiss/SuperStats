// src/components/charts/AlignmentChart.tsx
"use client";

import { useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { Character } from '@/types';
import styles from './Chart.module.css';

interface AlignmentChartProps {
  data: Character[];
}

const AlignmentChart = ({ data }: AlignmentChartProps) => {
  // ✅ CORREÇÃO 1: Atualiza as chaves do objeto para corresponder aos novos dados.
  const COLORS: { [key: string]: string } = {
    'Herói': '#3b82f6',     // Era 'good'
    'Vilão': '#ef4444',     // Era 'bad'
    'Anti-Herói': '#64748b' // Era 'neutral'
  };

  const alignmentData = useMemo(() => {
    // ✅ CORREÇÃO 2: A lógica aqui foi simplificada.
    // Como os dados já vêm tratados, não precisamos mais de "|| 'neutral'".
    const counts = data.reduce((acc: { [key: string]: number }, curr) => {
      const align = curr.Alignment;
      acc[align] = (acc[align] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [data]);

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Divisão por Alinhamento</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={alignmentData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
            {alignmentData.map((entry) => (
              <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AlignmentChart;