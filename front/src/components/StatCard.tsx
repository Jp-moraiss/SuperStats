
const StatCard = ({ title, value }: { title: string, value?: number }) => (
  <div className="card">
    <p className="cardTitle">{title}</p>
    <p className="statCardMetric">{value?.toLocaleString('pt-BR') || 0}</p>
  </div>
);

export default StatCard;