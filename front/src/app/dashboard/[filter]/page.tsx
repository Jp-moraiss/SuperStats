// src/app/dashboard/[filter]/page.tsx
import { getSuperheroes } from '@/lib/superheroes';
import DashboardClient from '@/components/dashboard/DashboardClient';
import { DashboardFilter } from '@/types';

const filterMap: Record<string, DashboardFilter | null> = {
  todos: null,
  herois: { type: 'alignment', value: 'good' },
  viloes: { type: 'alignment', value: 'bad' },
  antiherois: { type: 'alignment', value: 'neutral' },
  marvel: { type: 'publisher', value: 'Marvel Comics' },
  dc: { type: 'publisher', value: 'DC Comics' },
};

// ✅ Torne a função async
export default async function DashboardPage({
  params,
}: {
  params: Promise<{ filter: string }>;
}) {
  const { filter } = await params; // 👈 Desestrutura após aguardar o Promise
  const currentFilter = filterMap[filter] ?? null;

  // ⚡️ Se getSuperheroes for async, aguarde aqui também
  const superheroData = await getSuperheroes(currentFilter);

  return (
    <DashboardClient
      initialData={superheroData}
      filter={currentFilter}
    />
  );
}
