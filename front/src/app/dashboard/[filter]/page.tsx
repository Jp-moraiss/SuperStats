// src/app/dashboard/[filter]/page.tsx
import { getSuperheroes } from '@/lib/superheroes';
import DashboardClient from '@/components/dashboard/DashboardClient';
import { DashboardFilter } from '@/types';

const filterMap: Record<string, DashboardFilter | null> = {
  todos: null,
  herois: { type: 'alignment', value: 'Herói' }, // ✅ Corrigido: usar 'Herói' em vez de 'good'
  viloes: { type: 'alignment', value: 'Vilão' }, // ✅ Corrigido: usar 'Vilão' em vez de 'bad'
  antiherois: { type: 'alignment', value: 'Anti-Herói' }, // ✅ Corrigido: usar 'Anti-Herói' em vez de 'neutral'
  marvel: { type: 'publisher', value: 'Marvel Comics' },
  dc: { type: 'publisher', value: 'DC Comics' },
};

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ filter: string }>;
}) {
  const { filter } = await params;
  const currentFilter = filterMap[filter] ?? null;

  // ✅ getSuperheroes não é async, então não precisa de await
  const superheroData = getSuperheroes(currentFilter);

  return (
    <DashboardClient
      initialData={superheroData}
      filter={currentFilter}
    />
  );
}
