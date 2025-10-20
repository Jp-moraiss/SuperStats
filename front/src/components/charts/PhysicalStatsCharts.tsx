// src/components/charts/PhysicalStatsCharts.tsx
"use client";

import { useMemo } from 'react';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar, CartesianGrid } from 'recharts'; 
import { Character } from '@/types';

interface PhysicalStatsChartsProps {
    data: Character[];
}

const PhysicalStatsCharts = ({ data }: PhysicalStatsChartsProps) => {
  const heightData = useMemo(() => {
    const buckets: Record<string, number> = { "< 160cm": 0, "160-180cm": 0, "180-200cm": 0, "> 200cm": 0 };
    data.forEach(char => {
      // Esta lógica agora funciona porque 'char.Height' é um número
      if (char.Height > 0 && char.Height < 160) buckets["< 160cm"]++;
      else if (char.Height >= 160 && char.Height < 180) buckets["160-180cm"]++;
      else if (char.Height >= 180 && char.Height < 200) buckets["180-200cm"]++;
      else if (char.Height >= 200) buckets["> 200cm"]++;
    });
    return Object.entries(buckets).map(([name, value]) => ({ name, Personagens: value }));
  }, [data]);

  const weightData = useMemo(() => {
    const buckets: Record<string, number> = { "< 60kg": 0, "60-90kg": 0, "90-120kg": 0, "> 120kg": 0 };
    data.forEach(char => {
       // Esta lógica agora funciona porque 'char.Weight' é um número
      if (char.Weight > 0 && char.Weight < 60) buckets["< 60kg"]++;
      else if (char.Weight >= 60 && char.Weight < 90) buckets["60-90kg"]++;
      else if (char.Weight >= 90 && char.Weight < 120) buckets["90-120kg"]++;
      else if (char.Weight >= 120) buckets["> 120kg"]++;
    });
    return Object.entries(buckets).map(([name, value]) => ({ name, Personagens: value }));
  }, [data]);

  return (
    <>
      <div className="card">
        <h3 className="cardTitle">Distribuição de Altura</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={heightData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="Personagens" fill="var(--color-primary)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="card">
        <h3 className="cardTitle">Distribuição de Peso</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weightData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="Personagens" fill="var(--color-accent)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default PhysicalStatsCharts;