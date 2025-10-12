import { useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';

const AlignmentChart = ({ data }: { data: any[] }) => {
  const COLORS = { good: '#3b82f6', bad: '#ef4444', neutral: '#64748b' };

  const alignmentData = useMemo(() => {
    const counts = data.reduce((acc, curr) => {
      const align = curr.Alignment || 'neutral';
      if (align !== '-') acc[align] = (acc[align] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [data]);

  return (
    <div className="card">
      <h3 className="cardTitle">Divisão por Alinhamento</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={alignmentData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
            {alignmentData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
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