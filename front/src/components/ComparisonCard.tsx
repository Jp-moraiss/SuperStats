// app/components/ComparisonCard.tsx
import React from 'react';
import { Character } from './useSuperheroes'; // Ajuste o caminho

interface ComparisonCardProps {
  character: Character | null;
  onClear: () => void; // Para remover o personagem do slot
}

const ComparisonCard: React.FC<ComparisonCardProps> = ({ character, onClear }) => {
  if (!character) {
    return (
      <div className="card comparison-placeholder">
        <h3 className="cardTitle">Nenhum Personagem Selecionado</h3>
        <p>Use a caixa de pesquisa acima para escolher um herói/vilão para comparar.</p>
      </div>
    );
  }

  // Define a classe de badge com base no alinhamento
  const alignmentClass = character.Alignment?.toLowerCase() || 'neutral';

  // Array de poderes para renderização
  const powers = [
    { label: 'Inteligência', value: character.Intelligence },
    { label: 'Força', value: character.Strength },
    { label: 'Velocidade', value: character.Speed },
    { label: 'Durabilidade', value: character.Durability },
    { label: 'Poder', value: character.Power },
    { label: 'Combate', value: character.Combat },
  ];

  // Determina o valor máximo para a barra de progresso (poderes vão de 0 a 100)
  const maxPowerValue = 100;

  return (
    <div className="card comparison-card">
      <div className="heroHeader">
        <div>
          <h3 className="heroName">{character.Name}</h3>
          <p className="heroPublisher">{character.Publisher}</p>
        </div>
        <button className="clear-button" onClick={onClear} aria-label="Remover personagem">
            &times; {/* Ícone de fechar */}
        </button>
      </div>

      <div className="selectedHeroPanel">
        <span className={`heroBadge ${alignmentClass}`}>{character.Alignment || 'Desconhecido'}</span>
        
        <p><strong>Total de Poder:</strong> <span className="statCardMetric" style={{fontSize: '1.8rem', display: 'inline-block'}}>{character.TotalPower}</span></p>
        <p><strong>Gênero:</strong> {character.Gender || 'Desconhecido'}</p>
        <p><strong>Altura:</strong> {character.Height > 0 ? `${character.Height} cm` : 'Desconhecido'}</p>
        <p><strong>Peso:</strong> {character.Weight > 0 ? `${character.Weight} kg` : 'Desconhecido'}</p>
        <p><strong>Alter Egos:</strong> {character['Alter Egos'] === 'No Alter Egos' ? 'Nenhum' : character['Alter Egos']}</p>
        
        <h4 className="cardTitle" style={{marginTop: '1.5rem', marginBottom: '1rem', borderBottom: '2px dashed var(--border-color)', paddingBottom: '0.5rem'}}>Estatísticas de Poder</h4>
        <div className="heroStatsGrid">
          {powers.map((power, index) => (
            <div key={index} className="statBarWrapper">
              <span className="statBarLabel">{power.label}</span>
              <div className="statBarContainer">
                <div 
                  className="statBarFill" 
                  style={{ width: `${(power.value / maxPowerValue) * 100}%` }}
                >
                  {power.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComparisonCard;