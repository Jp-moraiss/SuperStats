// src/components/comparison/CharacterSelectInput.tsx
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Character } from '@/types';

interface CharacterSelectInputProps {
  label: string;
  allCharacters: Character[];
  onSelect: (character: Character | null) => void;
  selectedCharacter: Character | null;
}

const CharacterSelectInput: React.FC<CharacterSelectInputProps> = ({
  label,
  allCharacters,
  onSelect,
  selectedCharacter,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // ✅ CORREÇÃO 1: O useEffect agora SÓ depende da prop externa.
  // Ele apenas atualiza o texto do input se o personagem for limpo de fora (pelo "X" no card).
  useEffect(() => {
    if (selectedCharacter) {
      setSearchTerm(selectedCharacter.Name);
    } else {
      // Se o personagem for limpo externamente, limpa o texto do input.
      setSearchTerm('');
    }
  }, [selectedCharacter]);

  const suggestions = useMemo(() => {
    if (searchTerm.length < 2) return [];
    return allCharacters
      .filter(char =>
        char.Name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 10);
  }, [searchTerm, allCharacters]);

  const handleSelectCharacter = (char: Character) => {
    onSelect(char); // Informa ao pai a nova seleção
    setShowSuggestions(false);
    setSearchTerm(char.Name); // Atualiza o input com o nome completo
  };

  // ✅ CORREÇÃO 2: A lógica de digitação foi simplificada e corrigida.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowSuggestions(value.length >= 2);

    // Se o texto digitado for diferente do personagem selecionado,
    // significa que o usuário está buscando um novo personagem.
    // Portanto, limpamos a seleção atual no componente pai.
    if (selectedCharacter && value !== selectedCharacter.Name) {
      onSelect(null);
    }
  };

  return (
    <div className="character-select-input-container">
      <label>{label}</label>
      <input
        type="text"
        placeholder="Digite o nome do personagem..."
        className="searchInput"
        value={searchTerm}
        onChange={handleChange}
        onFocus={() => searchTerm.length >= 2 && setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // Leve delay para permitir o clique na sugestão
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((char) => ( 
            <li key={char.id} onClick={() => handleSelectCharacter(char)}>
              {char.Name} ({char.Publisher})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CharacterSelectInput;