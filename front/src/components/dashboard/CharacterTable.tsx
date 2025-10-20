// src/components/dashboard/CharacterTable.tsx
"use client";

import { useState, useMemo } from 'react'; 
import { Character } from '@/types'; // ✅ 1. Importa o tipo central 'Character'

// ✅ 2. Define uma interface clara para as props do componente
interface CharacterTableProps {
  data: Character[];
  onCharacterSelect: (char: Character) => void;
}

// ✅ 3. Usa a nova interface de props
const CharacterTable = ({ data, onCharacterSelect }: CharacterTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    const lowercasedSearch = searchTerm.toLowerCase();
    const filtered = searchTerm
      ? data.filter(item => item.Name.toLowerCase().includes(lowercasedSearch))
      : data;
    
    // Mostra todos os resultados da busca ou limita a 50 se o campo estiver vazio
    return searchTerm ? filtered : filtered.slice(0, 50);
  }, [data, searchTerm]);

  return (
    <div className="card" style={{ marginTop: '1.5rem' }}>
      <h3 className="cardTitle">Explorador de Personagens</h3>
      <input 
        type="text"
        placeholder="Pesquisar por nome..." 
        className="searchInput"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="tableContainer">
        <table className="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Editora</th>
              <th>Alinhamento</th>
              <th>Poder Total</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              // ✅ 4. Usa o 'item.id' único como chave ('key')
              <tr key={item.id} onClick={() => onCharacterSelect(item)}>
                <td>{item.Name}</td>
                <td>{item.Publisher}</td>
                <td>{item.Alignment}</td>
                <td>{item.TotalPower}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CharacterTable;