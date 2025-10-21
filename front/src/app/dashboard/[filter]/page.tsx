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

const titleMap: Record<
  string,
  { title: string; subtitle: string }
> = {
  todos: {
    title: 'Dashboard Analítico',
    subtitle: 'Explore os dados de todos os personagens!',
  },
  herois: {
    title: 'Heróis em Destaque',
    subtitle: 'Análise exclusiva dos protetores do universo.',
  },
  viloes: {
    title: 'Covil dos Vilões',
    subtitle: 'Métricas e estatísticas dos maiores antagonistas.',
  },
  antiherois: {
    title: 'Zona Cinzenta',
    subtitle: 'Dados sobre personagens de moralidade ambígua.',
  },
  marvel: {
    title: 'Universo Marvel',
    subtitle: 'Uma visão completa dos personagens da Casa das Ideias.',
  },
  dc: {
    title: 'Universo DC',
    subtitle: 'Estatísticas detalhadas dos ícones da DC Comics.',
  },
};

// ✅ Torne a função async
export default async function DashboardPage({
  params,
}: {
  params: Promise<{ filter: string }>;
}) {
  const { filter } = await params; // 👈 Desestrutura após aguardar o Promise
  const currentFilter = filterMap[filter] ?? null;
  const titles = titleMap[filter] ?? titleMap.todos;

  // ⚡️ Se getSuperheroes for async, aguarde aqui também
  const superheroData = await getSuperheroes(currentFilter);

  return (
    <DashboardClient
      initialData={superheroData}
      filter={currentFilter}
      title={titles.title}
      subtitle={titles.subtitle}
    />
  );
}
