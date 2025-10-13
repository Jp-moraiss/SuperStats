// app/components/CharacterSelectInput.tsx
import React, { useState, useMemo } from 'react';
import { Character } from './useSuperheroes';  

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
  const [searchTerm, setSearchTerm] = useState(selectedCharacter?.Name || '');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Filtra as sugestões com base no termo de busca
  const suggestions = useMemo(() => {
    if (searchTerm.length < 2) return []; // Começa a sugerir após 2 letras
    return allCharacters
      .filter(char =>
        char.Name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 10); // Limita a 10 sugestões
  }, [searchTerm, allCharacters]);

  const handleSelectCharacter = (char: Character) => {
    setSearchTerm(char.Name);
    onSelect(char);
    setShowSuggestions(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length >= 2) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      onSelect(null); // Limpa o personagem selecionado se o termo for removido
    }
  };

  // Se o personagem selecionado externamente mudar, atualiza o searchTerm
  React.useEffect(() => {
    if (selectedCharacter && selectedCharacter.Name !== searchTerm) {
      setSearchTerm(selectedCharacter.Name);
    } else if (!selectedCharacter && searchTerm) {
        setSearchTerm(''); // Limpa o input se o personagem for removido
    }
  }, [selectedCharacter]);

  return (
    <div className="character-select-input-container"> 
      <input
        type="text"
        placeholder={`Digite o nome do personagem ${label}...`}
        className="searchInput" 
        value={searchTerm}
        onChange={handleChange}
        onFocus={() => searchTerm.length >= 2 && setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 100)} // Pequeno delay para permitir clique nas sugestões
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map(char => (
            <li key={char.Name} onClick={() => handleSelectCharacter(char)}>
              {char.Name} ({char.Publisher})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CharacterSelectInput;