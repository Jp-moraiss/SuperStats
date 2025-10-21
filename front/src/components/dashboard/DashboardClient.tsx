// src/components/dashboard/DashboardClient.tsx
"use client";

import { useState, useMemo } from 'react';
import { Character, DashboardFilter } from '@/types';

import StatCard from './StatCard';
import CharacterTable from './CharacterTable';
import PowerRadarChart from '../charts/PowerRadarChart';
import AlignmentChart from '../charts/AlignmentChart';
import PublisherChart from '../charts/PublisherChart';
import AlterEgoChart from '../charts/AlterEgoChart';
import PhysicalStatsCharts from '../charts/PhysicalStatsCharts';
import PowerDistributionChart from '../charts/PowerDistributionChart';

// ... importe o CSS Module do Dashboard aqui quando criá-lo

type DashboardClientProps = {
  initialData: Character[];
  filter: DashboardFilter;
  title: string;
  subtitle: string;
};

export default function DashboardClient({ initialData, filter, title, subtitle }: DashboardClientProps) {
  const [data] = useState<Character[]>(initialData);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  const summaryStats = useMemo(() => {
    if (data.length === 0) return { total: 0, marvelCount: 0, dcCount: 0 };
    return {
      total: data.length,
      marvelCount: data.filter(d => d.Publisher === 'Marvel Comics').length,
      dcCount: data.filter(d => d.Publisher === 'DC Comics').length,
    };
  }, [data]);

  const showAlignmentChart = !filter || filter.type !== 'alignment';
  const showPublisherComponents = !filter || filter.type !== 'publisher';
  
  return (
    <div className="dashboardContainer">
        {/* Aqui você pode adicionar os títulos */}
        <h2 style={{ fontFamily: '"Bangers", cursive', fontSize: '3rem', color: 'var(--color-primary)' }}>{title}</h2>
        <p style={{ marginTop: '-1rem', fontSize: '1.2rem' }}>{subtitle}</p>

      <div className="statsGrid">
        <StatCard title="Total de Personagens" value={summaryStats?.total} />
        {showPublisherComponents && (
          <>
            <StatCard title="Personagens da Marvel" value={summaryStats?.marvelCount} />
            <StatCard title="Personagens da DC" value={summaryStats?.dcCount} />
          </>
        )}
      </div>

      <div className="chartsGrid">
        <PowerRadarChart data={data} selectedCharacter={selectedCharacter} />
        <div className="sideChartsContainer">
          {showAlignmentChart && <AlignmentChart data={data} />}
          {showPublisherComponents && <PublisherChart data={data} />}
          <AlterEgoChart data={data} />
        </div>
      </div>
      
      <div className="chartsGridFull">
        <PowerDistributionChart data={data} />
      </div>

      <div className="chartsGrid">
        <PhysicalStatsCharts data={data} />
      </div>

      <CharacterTable data={data} onCharacterSelect={setSelectedCharacter} />
    </div>
  );
}