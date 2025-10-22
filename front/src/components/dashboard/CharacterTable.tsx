// src/components/dashboard/CharacterTable.tsx
"use client";

import { useState, useMemo } from 'react'; 
import { Character } from '@/types';
import styles from './CharacterTable.module.css';

interface CharacterTableProps {
  data: Character[];
  onCharacterSelect: (char: Character) => void;
}

const CharacterTable = ({ data, onCharacterSelect }: CharacterTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Character>('Name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const filteredData = useMemo(() => {
    const lowercasedSearch = searchTerm.toLowerCase();
    const filtered = searchTerm
      ? data.filter(item => item.Name.toLowerCase().includes(lowercasedSearch))
      : data;
    
    return searchTerm ? filtered : filtered.slice(0, 50);
  }, [data, searchTerm]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortField, sortDirection]);

  const handleSort = (field: keyof Character) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getPublisherBadgeClass = (publisher: string) => {
    if (publisher === 'Marvel Comics') return styles['publisherBadge--marvel'];
    if (publisher === 'DC Comics') return styles['publisherBadge--dc'];
    return styles['publisherBadge--other'];
  };

  const getCharacterNameClass = (publisher: string) => {
    if (publisher === 'Marvel Comics') return styles['characterName--marvel'];
    if (publisher === 'DC Comics') return styles['characterName--dc'];
    return styles['characterName--other'];
  };

  const getAlignmentBadgeClass = (alignment: string) => {
    if (alignment === 'good') return styles['alignmentBadge--good'];
    if (alignment === 'bad') return styles['alignmentBadge--bad'];
    return styles['alignmentBadge--neutral'];
  };

  const getPowerStatClass = (value: number) => {
    if (value >= 80) return styles['powerStat--high'];
    if (value >= 50) return styles['powerStat--medium'];
    return styles['powerStat--low'];
  };

  if (sortedData.length === 0) {
    return (
      <div className={styles.card}>
        <h3 className={styles.title}>Explorador de Personagens</h3>
        <div className={styles.emptyState}>
          Nenhum personagem encontrado com o termo &quot;{searchTerm}&quot;
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Explorador de Personagens</h3>
      <input 
        type="text"
        placeholder="Pesquisar por nome..." 
        className={styles.searchInput}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th onClick={() => handleSort('Name')}>
                Nome {sortField === 'Name' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('Publisher')}>
                Editora {sortField === 'Publisher' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('Alignment')}>
                Alinhamento {sortField === 'Alignment' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('TotalPower')}>
                Poder Total {sortField === 'TotalPower' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('Intelligence')}>
                Inteligência {sortField === 'Intelligence' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('Strength')}>
                Força {sortField === 'Strength' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item) => (
              <tr key={item.id} onClick={() => onCharacterSelect(item)}>
                <td>
                  <span className={`${styles.characterName} ${getCharacterNameClass(item.Publisher)}`}>
                    {item.Name}
                  </span>
                </td>
                <td>
                  <span className={`${styles.publisherBadge} ${getPublisherBadgeClass(item.Publisher)}`}>
                    {item.Publisher}
                  </span>
                </td>
                <td>
                  <span className={`${styles.alignmentBadge} ${getAlignmentBadgeClass(item.Alignment || 'neutral')}`}>
                    {item.Alignment || 'Desconhecido'}
                  </span>
                </td>
                <td>
                  <span className={`${styles.powerStat} ${getPowerStatClass(item.TotalPower)}`}>
                    {item.TotalPower}
                  </span>
                </td>
                <td>
                  <span className={`${styles.powerStat} ${getPowerStatClass(item.Intelligence)}`}>
                    {item.Intelligence}
                  </span>
                </td>
                <td>
                  <span className={`${styles.powerStat} ${getPowerStatClass(item.Strength)}`}>
                    {item.Strength}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CharacterTable;