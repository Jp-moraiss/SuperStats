import { useMemo } from 'react';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';

const PublisherChart = ({ data }: { data: any[] }) => {
  const publisherData = useMemo(() => {
    const counts = data.reduce((acc, curr) => {
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
    <div className="card">
      <h3 className="cardTitle">Top 5 Editoras</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={publisherData} layout="vertical">
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