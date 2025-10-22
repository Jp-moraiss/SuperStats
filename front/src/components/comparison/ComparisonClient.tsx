// src/components/comparison/ComparisonClient.tsx
"use client";

import { useState } from 'react';
import { Character } from '@/types'; 
import CharacterSelectInput from './CharacterSelectInput';
import ComparisonCard from './ComparisonCard';
import ComparisonRadarChart from '../charts/ComparisonRadarChart';
import styles from './Comparison.module.css';

interface ComparisonClientProps {
  allCharacters: Character[];
}

export default function ComparisonClient({ allCharacters }: ComparisonClientProps) {
  const [character1, setCharacter1] = useState<Character | null>(null);
  const [character2, setCharacter2] = useState<Character | null>(null);

  return (
    <div className={styles.container}> 
      <div className={styles.inputsGrid}>
        <CharacterSelectInput
          label="Personagem 1"
          allCharacters={allCharacters}
          // CORREÇÃO APLICADA AQUI
          onSelect={(character) => setCharacter1(character)}
          selectedCharacter={character1}
        />
        <CharacterSelectInput
          label="Personagem 2"
          allCharacters={allCharacters}
          // E AQUI TAMBÉM
          onSelect={(character) => setCharacter2(character)}
          selectedCharacter={character2}
        />
      </div>

      <div className={styles.cardsGrid}>
        <ComparisonCard character={character1} onClear={() => setCharacter1(null)} />
        <ComparisonCard character={character2} onClear={() => setCharacter2(null)} />
      </div>

      {(character1 && character2) && (
        <ComparisonRadarChart character1={character1} character2={character2} />
      )}
    </div>
  );
};