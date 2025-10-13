// app/components/CharacterSelectInput.tsx
import React, { useState, useMemo, useEffect } from 'react';
// Make sure the Character type is imported correctly
// import { Character } from './useSuperheroes'; 

// Example Character type if not defined elsewhere
interface Character {
  id?: number | string; // It's good practice to expect an ID
  Name: string;
  Publisher: string;
}

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

  const suggestions = useMemo(() => {
    if (searchTerm.length < 2) return [];
    return allCharacters
      .filter(char =>
        char.Name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 10);
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
      onSelect(null);
    }
  };

  useEffect(() => {
    if (selectedCharacter && selectedCharacter.Name !== searchTerm) {
      setSearchTerm(selectedCharacter.Name);
    } else if (!selectedCharacter && searchTerm) {
        setSearchTerm('');
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
        onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((char, index) => (
            // FIX: Added the map 'index' to guarantee a unique key
            <li key={`${char.Name}-${char.Publisher}-${index}`} onClick={() => handleSelectCharacter(char)}>
              {char.Name} ({char.Publisher})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CharacterSelectInput;