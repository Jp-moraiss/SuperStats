// src/app/dashboard/[filter]/page.tsx
import { getSuperheroes } from '@/lib/superheroes';
import DashboardClient from '@/components/dashboard/DashboardClient';
import { DashboardFilter } from '@/types';

const filterMap: { [key: string]: DashboardFilter } = {
  todos: null,
  herois: { type: 'alignment', value: 'good' },
  viloes: { type: 'alignment', value: 'bad' },
  marvel: { type: 'publisher', value: 'Marvel Comics' },
  dc: { type: 'publisher', value: 'DC Comics' },
};

// Esta é uma página de servidor (Server Component)
export default function DashboardPage({ params }: { params: { filter: string } }) {
  const currentFilter = filterMap[params.filter] ?? null;
  
  // Busca os dados diretamente no servidor. Rápido e eficiente!
  const superheroData = getSuperheroes(currentFilter);

  return (
    <DashboardClient
      initialData={superheroData}
      filter={currentFilter}
    />
  );
}