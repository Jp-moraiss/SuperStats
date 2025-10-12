import { useMemo } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip } from 'recharts'; 

const PowerRadarChart = ({ data, selectedCharacter }: { data: any[], selectedCharacter: any }) => {
  const attributes = ['Intelligence', 'Strength', 'Speed', 'Durability', 'Power', 'Combat'];

  const comparisonData = useMemo(() => {
    // A lógica para calcular os dados do gráfico permanece a mesma
    const calculateAverage = (filterFn: (d: any) => boolean) => {
        const filteredData = data.filter(filterFn);
        const averages: { [key: string]: any } = { subject: '' };
        attributes.forEach(attr => {
            const sum = filteredData.reduce((acc, curr) => acc + (curr[attr] || 0), 0);
            averages[attr] = sum / (filteredData.length || 1);
        });
        return averages;
    };
    const avgGood = calculateAverage(d => d.Alignment === 'good');
    const avgBad = calculateAverage(d => d.Alignment === 'bad');
    let chartData = attributes.map(attr => ({
        subject: attr,
        "Média 'Heróis'": avgGood[attr],
        "Média 'Vilões'": avgBad[attr],
    }));
    if (selectedCharacter) {
        chartData.forEach(item => {
            item[selectedCharacter.Name] = selectedCharacter[item.subject];
        });
    }
    return chartData;
  }, [data, selectedCharacter]);
  
  // Componente para a barra de estatística individual
  const StatBar = ({ label, value }) => (
    <div className="statBarWrapper">
      <span className="statBarLabel">{label}</span>
      <div className="statBarContainer">
        <div className="statBarFill" style={{ width: `${value}%` }}>
          {value}
        </div>
      </div>
    </div>
  );

  return (
    <div className="card radarCardContainer">
      <h3 className="cardTitle">Comparativo de Atributos de Poder</h3>
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={comparisonData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-primary-color)', fontFamily: 'Permanent Marker' }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <Tooltip />
          <Radar name="Média 'Heróis'" dataKey="Média 'Heróis'" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
          <Radar name="Média 'Vilões'" dataKey="Média 'Vilões'" stroke="#ef4444" fill="#ef4444" fillOpacity={0.5} />
          {selectedCharacter && (
            <Radar name={selectedCharacter.Name} dataKey={selectedCharacter.Name} stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
          )}
          <Legend />
        </RadarChart>
      </ResponsiveContainer>

      {/* ======================================= */}
      {/* ✨ NOVA SEÇÃO: FICHA DO PERSONAGEM ✨ */}
      {/* ======================================= */}
      {selectedCharacter ? (
        <div className="selectedHeroPanel">
          <div className="heroHeader">
            <h4 className="heroName">{selectedCharacter.Name}</h4>
            <span className={`heroBadge ${selectedCharacter.Alignment.toLowerCase()}`}>
              {selectedCharacter.Alignment}
            </span>
          </div>
          <p className="heroPublisher">{selectedCharacter.Publisher}</p>

          <div className="heroStatsGrid">
            {attributes.map(attr => (
              <StatBar key={attr} label={attr} value={selectedCharacter[attr]} />
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