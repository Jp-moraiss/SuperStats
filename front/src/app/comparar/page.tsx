// src/app/comparar/page.tsx

import { getAllSuperheroes } from '@/lib/superheroes';
import ComparisonClient from '@/components/comparison/ComparisonClient';
import { Character } from '@/types';

// Este é um Server Component, ele roda no servidor.
export default function CompararPage() {
  // 1. Busca todos os dados diretamente do cache no servidor. É instantâneo!
  const allCharacters: Character[] = getAllSuperheroes();

  // 2. Renderiza o componente de cliente, passando os dados prontos como props.
  return (
    <ComparisonClient allCharacters={allCharacters} />
  );
};