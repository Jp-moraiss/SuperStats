import Dashboard from '../../components/Dashboard';

export default function GraficosPage() {
  return (
    <Dashboard  
    filter={{ type: 'publisher', value: 'Marvel Comics' }}
    />
  );
}