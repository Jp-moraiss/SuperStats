// src/components/charts/PublisherChart.tsx
"use client";

import { useMemo } from 'react';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';
import { Character } from '@/types'; // ✅ 1. Importa o tipo correto
import styles from './Chart.module.css';

interface PublisherChartProps {
    data: Character[];
}

const PublisherChart = ({ data }: PublisherChartProps) => {
  const publisherData = useMemo(() => {
    const counts = data.reduce((acc: Record<string, number>, curr) => {
      const pub = curr.Publisher || 'Outros';
      if (pub && pub !== '-') acc[pub] = (acc[pub] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts)
      .map(([name, Personagens]) => ({ name, Personagens }))
      .sort((a, b) => b.Personagens - a.Personagens)
      .slice(0, 5);
  }, [data]);

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Top 5 Editoras</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={publisherData} layout="vertical" margin={{ left: 10, right: 30 }}>
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="name" width={80} tickLine={false} axisLine={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="Personagens" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PublisherChart;