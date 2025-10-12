import { useMemo } from 'react';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Legend, Bar, CartesianGrid } from 'recharts';
import styles from './Dashboard.module.css';

const PowerDistributionChart = ({ data }: { data: any[] }) => {
  const chartData = useMemo(() => {
    const attributes = ['Intelligence', 'Strength', 'Speed', 'Durability', 'Power', 'Combat'];
    const buckets = { "0-20": {}, "21-40": {}, "41-60": {}, "61-80": {}, "81-100": {} };
    
    // Inicializa os contadores para cada atributo em cada balde
    Object.keys(buckets).forEach(bucket => {
        attributes.forEach(attr => {
            buckets[bucket][attr] = 0;
        });
    });

    data.forEach(char => {
      attributes.forEach(attr => {
        const value = char[attr];
        if (value >= 0 && value <= 20) buckets["0-20"][attr]++;
        else if (value > 20 && value <= 40) buckets["21-40"][attr]++;
        else if (value > 40 && value <= 60) buckets["41-60"][attr]++;
        else if (value > 60 && value <= 80) buckets["61-80"][attr]++;
        else if (value > 80 && value <= 100) buckets["81-100"][attr]++;
      });
    });

    return Object.entries(buckets).map(([name, values]) => ({ name, ...values }));
  }, [data]);

  return (
    <div className="card">
      <h3 className="cardTitle">Distribuição de Atributos de Poder</h3>
      <ResponsiveContainer width="100%" height={400}>
        {/* Adicionamos a propriedade "margin" aqui */}
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 25 }}>
          <CartesianGrid strokeDasharray="3 3" />
          {/* Adicionamos um "offset" para mover o rótulo para baixo */}
          <XAxis dataKey="name" label={{ value: 'Nível de Poder', position: 'insideBottom', offset: -35 }}/>
          <YAxis label={{ value: 'Nº de Personagens', angle: -90, position: 'insideLeft' }}/>
          <Tooltip />
          <Legend />
          <Bar dataKey="Intelligence" fill="#8884d8" />
          <Bar dataKey="Strength" fill="#e30000" />
          <Bar dataKey="Speed" fill="#ffd700" />
          <Bar dataKey="Durability" fill="#82ca9d" />
          <Bar dataKey="Power" fill="#ff7300" />
          <Bar dataKey="Combat" fill="#121212" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PowerDistributionChart;