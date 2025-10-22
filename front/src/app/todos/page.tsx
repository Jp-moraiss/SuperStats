"use client";

import { useState, useEffect } from "react";
import styles from './TodosPage.module.css';

// Mock data for demonstration
const mockCharacters = [
  {
    id: 1,
    name: "Batman",
    publisher: "DC Comics",
    alignment: "Good",
    power: 85,
    intelligence: 100,
    strength: 85,
    speed: 70,
    durability: 80,
    combat: 100,
    image: "/batman.png"
  },
  {
    id: 2,
    name: "Superman",
    publisher: "DC Comics", 
    alignment: "Good",
    power: 100,
    intelligence: 85,
    strength: 100,
    speed: 95,
    durability: 100,
    combat: 85,
    image: "/superman.png"
  },
  {
    id: 3,
    name: "Spider-Man",
    publisher: "Marvel",
    alignment: "Good", 
    power: 80,
    intelligence: 90,
    strength: 55,
    speed: 75,
    durability: 70,
    combat: 85,
    image: "/spiderman.png"
  },
  {
    id: 4,
    name: "Iron Man",
    publisher: "Marvel",
    alignment: "Good",
    power: 85,
    intelligence: 100,
    strength: 85,
    speed: 60,
    durability: 85,
    combat: 80,
    image: "/ironman.png"
  }
];

export default function TodosPage() {
  const [characters, setCharacters] = useState(mockCharacters);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const filteredCharacters = characters
    .filter(char => {
      if (filter !== 'all' && char.alignment !== filter) return false;
      if (searchQuery && !char.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'power': return b.power - a.power;
        case 'intelligence': return b.intelligence - a.intelligence;
        case 'strength': return b.strength - a.strength;
        case 'speed': return b.speed - a.speed;
        case 'durability': return b.durability - a.durability;
        case 'combat': return b.combat - a.combat;
        default: return a.name.localeCompare(b.name);
      }
    });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Todos os Personagens</h1>
        <p className={styles.subtitle}>Explore o universo completo de super-heróis e vilões</p>
      </div>

      <div className={styles.filters}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Buscar personagem..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterGroup}>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">Todos</option>
            <option value="Good">Heróis</option>
            <option value="Evil">Vilões</option>
            <option value="Neutral">Neutros</option>
          </select>

          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className={styles.sortSelect}
          >
            <option value="name">Nome</option>
            <option value="power">Poder</option>
            <option value="intelligence">Inteligência</option>
            <option value="strength">Força</option>
            <option value="speed">Velocidade</option>
            <option value="durability">Durabilidade</option>
            <option value="combat">Combate</option>
          </select>
        </div>
      </div>

      <div className={styles.charactersGrid}>
        {filteredCharacters.map(character => (
          <div key={character.id} className={styles.characterCard}>
            <div className={styles.cardImage}>
              <img 
                src={character.image} 
                alt={character.name}
                className={styles.characterImage}
              />
            </div>
            
            <div className={styles.cardContent}>
              <h3 className={styles.characterName}>{character.name}</h3>
              <p className={styles.characterPublisher}>{character.publisher}</p>
              <span className={`${styles.alignment} ${styles[character.alignment.toLowerCase()]}`}>
                {character.alignment}
              </span>
            </div>

            <div className={styles.statsGrid}>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Poder</span>
                <div className={styles.statBar}>
                  <div 
                    className={styles.statFill} 
                    style={{ width: `${character.power}%` }}
                  ></div>
                </div>
                <span className={styles.statValue}>{character.power}</span>
              </div>

              <div className={styles.stat}>
                <span className={styles.statLabel}>Inteligência</span>
                <div className={styles.statBar}>
                  <div 
                    className={styles.statFill} 
                    style={{ width: `${character.intelligence}%` }}
                  ></div>
                </div>
                <span className={styles.statValue}>{character.intelligence}</span>
              </div>

              <div className={styles.stat}>
                <span className={styles.statLabel}>Força</span>
                <div className={styles.statBar}>
                  <div 
                    className={styles.statFill} 
                    style={{ width: `${character.strength}%` }}
                  ></div>
                </div>
                <span className={styles.statValue}>{character.strength}</span>
              </div>

              <div className={styles.stat}>
                <span className={styles.statLabel}>Velocidade</span>
                <div className={styles.statBar}>
                  <div 
                    className={styles.statFill} 
                    style={{ width: `${character.speed}%` }}
                  ></div>
                </div>
                <span className={styles.statValue}>{character.speed}</span>
              </div>

              <div className={styles.stat}>
                <span className={styles.statLabel}>Durabilidade</span>
                <div className={styles.statBar}>
                  <div 
                    className={styles.statFill} 
                    style={{ width: `${character.durability}%` }}
                  ></div>
                </div>
                <span className={styles.statValue}>{character.durability}</span>
              </div>

              <div className={styles.stat}>
                <span className={styles.statLabel}>Combate</span>
                <div className={styles.statBar}>
                  <div 
                    className={styles.statFill} 
                    style={{ width: `${character.combat}%` }}
                  ></div>
                </div>
                <span className={styles.statValue}>{character.combat}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCharacters.length === 0 && (
        <div className={styles.noResults}>
          <h3>Nenhum personagem encontrado</h3>
          <p>Tente ajustar os filtros ou termo de busca</p>
        </div>
      )}
    </div>
  );
}
