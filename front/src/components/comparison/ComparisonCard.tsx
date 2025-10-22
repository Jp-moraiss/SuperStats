// src/components/comparison/ComparisonCard.tsx
import React from 'react';
import { Character } from '@/types';
import {
  ComparisonCardContainer,
  PlaceholderCard,
  PlaceholderTitle,
  PlaceholderText,
  HeroHeader,
  HeroName,
  HeroPublisher,
  ClearButton,
  SelectedHeroPanel,
  HeroBadge,
  PowerMetric,
  SectionTitle,
  HeroStatsGrid,
  StatBarWrapper,
  StatBarLabel,
  StatBarContainer,
  StatBarFill
} from './ComparisonCard.styled';

interface ComparisonCardProps {
  character: Character | null;
  onClear: () => void;
}

const ComparisonCard: React.FC<ComparisonCardProps> = ({ character, onClear }) => {
  if (!character) {
    return (
      <PlaceholderCard>
        <PlaceholderTitle>Nenhum Personagem Selecionado</PlaceholderTitle>
        <PlaceholderText>Use a caixa de pesquisa acima para escolher um herói/vilão para comparar.</PlaceholderText>
      </PlaceholderCard>
    );
  }

  const alignmentClass = character.Alignment?.toLowerCase() || 'neutral';

  const powers = [
    { label: 'Inteligência', value: character.Intelligence },
    { label: 'Força', value: character.Strength },
    { label: 'Velocidade', value: character.Speed },
    { label: 'Durabilidade', value: character.Durability },
    { label: 'Poder', value: character.Power },
    { label: 'Combate', value: character.Combat },
  ];

  const maxPowerValue = 100;

  return (
    <ComparisonCardContainer>
      <HeroHeader>
        <div>
          <HeroName>{character.Name}</HeroName>
          <HeroPublisher>{character.Publisher}</HeroPublisher>
        </div>
        <ClearButton onClick={onClear} aria-label="Remover personagem">
          &times;
        </ClearButton>
      </HeroHeader>

      <SelectedHeroPanel>
        <HeroBadge alignment={alignmentClass as 'good' | 'bad' | 'neutral'}>{character.Alignment || 'Desconhecido'}</HeroBadge>
        
        <p><strong>Total de Poder:</strong> <PowerMetric>{character.TotalPower}</PowerMetric></p>
        <p><strong>Gênero:</strong> {character.Gender || 'Desconhecido'}</p>
        <p><strong>Altura:</strong> {character.Height > 0 ? `${character.Height} cm` : 'Desconhecido'}</p>
        <p><strong>Peso:</strong> {character.Weight > 0 ? `${character.Weight} kg` : 'Desconhecido'}</p>
        <p><strong>Alter Egos:</strong> {character['Alter Egos'] === 'No Alter Egos' ? 'Nenhum' : character['Alter Egos']}</p>
        
        <SectionTitle>Estatísticas de Poder</SectionTitle>
        <HeroStatsGrid>
          {powers.map((power) => (
            <StatBarWrapper key={power.label}>
              <StatBarLabel>{power.label}</StatBarLabel>
              <StatBarContainer>
                <StatBarFill width={(power.value / maxPowerValue) * 100}>
                  {power.value}
                </StatBarFill>
              </StatBarContainer>
            </StatBarWrapper>
          ))}
        </HeroStatsGrid>
      </SelectedHeroPanel>
    </ComparisonCardContainer>
  );
};

export default ComparisonCard;