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

import styles from './Dashboard.module.css';

type DashboardClientProps = {
  initialData: Character[];
  filter: DashboardFilter;
};

export default function DashboardClient({ initialData, filter }: DashboardClientProps) {
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
    <div className={styles.container}>
      <div className={styles.header}>
      </div>

      <div className={styles.statsGrid}>
        <StatCard 
          title="Total de Personagens" 
          value={summaryStats?.total} 
          variant="total" 
          effect="explosion" 
        />
        {showPublisherComponents && (
          <>
            <StatCard 
              title="Personagens da Marvel" 
              value={summaryStats?.marvelCount} 
              variant="marvel" 
              effect="pow" 
            />
            <StatCard 
              title="Personagens da DC" 
              value={summaryStats?.dcCount} 
              variant="dc" 
              effect="bam" 
            />
          </>
        )}
      </div>

      <div className={styles.chartsGrid}>
        <PowerRadarChart data={data} selectedCharacter={selectedCharacter} />
        <div className={styles.sideChartsContainer}>
          {showAlignmentChart && <AlignmentChart data={data} />}
          {showPublisherComponents && <PublisherChart data={data} />}
          <AlterEgoChart data={data} />
        </div>
      </div>
      
      <div className={styles.chartsGridFull}>
        <PowerDistributionChart data={data} />
      </div>

      <div className={styles.chartsGrid}>
        <PhysicalStatsCharts data={data} />
      </div>

      <CharacterTable data={data} onCharacterSelect={setSelectedCharacter} />
    </div>
  );
}