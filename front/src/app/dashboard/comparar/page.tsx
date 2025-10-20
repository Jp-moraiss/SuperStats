// app/comparar/page.tsx
"use client";

import { useState } from 'react';
import { useSuperheroes, Character } from '../../../components/useSuperheroes'; // Ajuste o caminho
import CharacterSelectInput from '../../../components/CharacterSelectInput';
import ComparisonCard from '../../../components/ComparisonCard';
import ComparisonRadarChart from '../../../components/ComparisonRadarChart';

const CompararPage: React.FC = () => {
  const { allData, isLoading } = useSuperheroes(); // Pega todos os dados sem filtro
  const [character1, setCharacter1] = useState<Character | null>(null);
  const [character2, setCharacter2] = useState<Character | null>(null);

  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Carregando dados dos heróis para comparação...</div>;
  }

  return (
    <div className="dashboardContainer"> {/* Reutiliza o container principal */}
      <div className="comparison-inputs-grid">
        <CharacterSelectInput
          label="Personagem 1"
          allCharacters={allData}
          onSelect={setCharacter1}
          selectedCharacter={character1}
        />
        <CharacterSelectInput
          label="Personagem 2"
          allCharacters={allData}
          onSelect={setCharacter2}
          selectedCharacter={character2}
        />
      </div>

      <div className="comparison-cards-grid">
        <ComparisonCard character={character1} onClear={() => setCharacter1(null)} />
        <ComparisonCard character={character2} onClear={() => setCharacter2(null)} />
      </div>

      <ComparisonRadarChart character1={character1} character2={character2} />
    </div>
  );
};

export default CompararPage;