"use client";
import { useMemo, useState } from 'react';
import { useSuperheroes, DashboardFilter } from './useSuperheroes';
import StatCard from './StatCard';
import PowerRadarChart from './PowerRadarChart';
import AlignmentChart from './AlignmentChart';
import PublisherChart from './PublisherChart';
import CharacterTable from './CharacterTable';
import AlterEgoChart from './AlterEgoChart';
import PhysicalStatsCharts from './PhysicalStatsCharts';
import PowerDistributionChart from './PowerDistributionChart';

// O tipo agora define as props que o Dashboard pode receber
type DashboardProps = {
  filter?: DashboardFilter;
  title: string;
  subtitle: string;
};

const Dashboard = ({ filter = null }: DashboardProps) => {
  const [selectedCharacter, setSelectedCharacter] = useState<any>(null);
  const { data, isLoading } = useSuperheroes(filter);

  const summaryStats = useMemo(() => {
    if (isLoading || data.length === 0) return null;
    return {
      total: data.length,
      marvelCount: data.filter(d => d.Publisher === 'Marvel Comics').length,
      dcCount: data.filter(d => d.Publisher === 'DC Comics').length,
    };
  }, [data, isLoading]);

  // **Flags para controlar a visibilidade dos componentes com base no filtro**
  // Se o filtro for por alinhamento (heróis, vilões, etc.), não mostra o gráfico de alinhamento.
  const showAlignmentChart = !filter || filter.type !== 'alignment';
  
  // Se o filtro for por editora (Marvel/DC), não mostra o gráfico de editoras nem os cards de contagem.
  const showPublisherComponents = !filter || filter.type !== 'publisher';

  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Carregando dados dos heróis...</div>;
  }

  return (
    <div className="dashboardContainer">
      <div className="statsGrid">
        {/* O card de total sempre é exibido */}
        <StatCard title="Total de Personagens" value={summaryStats?.total} />

        {/* **Renderização Condicional:** Mostra os cards de contagem apenas se não houver filtro por editora */}
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
          {/* **Renderização Condicional:** Mostra o gráfico de alinhamento */}
          {showAlignmentChart && <AlignmentChart data={data} />}

          {/* **Renderização Condicional:** Mostra o gráfico de editoras */}
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
};

export default Dashboard;