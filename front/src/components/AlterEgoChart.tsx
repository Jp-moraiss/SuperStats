import { useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts'; 
const AlterEgoChart = ({ data }: { data: any[] }) => {
  const COLORS = { 'Yes': '#10b981', 'No': '#64748b' };

  const chartData = useMemo(() => {
    const counts = data.reduce((acc, curr) => {
      const hasAlterEgo = curr['Alter Egos'] === 'Yes' ? 'Yes' : 'No';
      acc[hasAlterEgo] = (acc[hasAlterEgo] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value]) => ({ name: `Alter Ego: ${name}`, value }));
  }, [data]);

  return (
    <div className="card">
      <h3 className="cardTitle">Identidade Secreta</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} labelLine={false}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name.includes('Yes') ? 'Yes' : 'No']} />
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