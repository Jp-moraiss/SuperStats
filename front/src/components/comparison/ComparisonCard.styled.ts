// src/components/comparison/ComparisonCard.styled.ts
import styled from 'styled-components';

export const ComparisonCardContainer = styled.div`
  background: ${({ theme }) => theme.colors.cardBackground};
  border: 4px solid ${({ theme }) => theme.colors.secondary};
  box-shadow: ${({ theme }) => theme.shadows.strong};
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  transition: ${({ theme }) => theme.transitions.base};
  position: relative;
  overflow: hidden;
  height: 100%;

  &:hover {
    transform: translate(-6px, -6px);
    box-shadow: 12px 12px 0 ${({ theme }) => theme.colors.accent};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 50%;
    height: 100%;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.4) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: skewX(-25deg);
    transition: left 0.6s ease-in-out;
  }

  &:hover::before {
    left: 150%;
  }
`;

export const PlaceholderCard = styled(ComparisonCardContainer)`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl} ${({ theme }) => theme.spacing.md};
  background-color: #f0f0f0;
  border-style: dashed;
  color: ${({ theme }) => theme.colors.textSecondary};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const PlaceholderTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.permanentMarker};
  font-size: 1.3rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  text-transform: uppercase;
  border-bottom: 3px dashed ${({ theme }) => theme.colors.border};
  padding-bottom: ${({ theme }) => theme.spacing.sm};
`;

export const PlaceholderText = styled.p`
  font-family: ${({ theme }) => theme.fonts.comicNeue};
  font-size: 1.1rem;
  line-height: 1.4;
  margin-top: ${({ theme }) => theme.spacing.md};
`;

export const HeroHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
  padding-right: 40px;
`;

export const HeroName = styled.h3`
  font-family: ${({ theme }) => theme.fonts.bangers};
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.primary};
  text-shadow: 2px 2px 0 ${({ theme }) => theme.colors.secondary};
  margin-bottom: 0.25rem;
`;

export const HeroPublisher = styled.p`
  font-family: ${({ theme }) => theme.fonts.permanentMarker};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: -0.5rem;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const ClearButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  border: 2px solid ${({ theme }) => theme.colors.secondary};
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.base};
  box-shadow: 2px 2px 0 ${({ theme }) => theme.colors.secondary};
  position: absolute;
  top: 1rem;
  right: 1rem;

  &:hover {
    background: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.secondary};
    transform: scale(1.1) rotate(5deg);
  }
`;

export const SelectedHeroPanel = styled.div`
  border-top: 4px dashed ${({ theme }) => theme.colors.border};
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding-top: ${({ theme }) => theme.spacing.lg};
  animation: fadeInComic 0.5s ease;
`;

export const HeroBadge = styled.span<{ alignment: 'good' | 'bad' | 'neutral' }>`
  font-family: ${({ theme }) => theme.fonts.bangers};
  padding: 0.25rem 0.8rem;
  border: 3px solid ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 1rem;
  letter-spacing: 1px;
  background-color: ${({ theme, alignment }) => {
    switch (alignment) {
      case 'good': return theme.colors.accent1;
      case 'bad': return theme.colors.accent2;
      case 'neutral': return theme.colors.textSecondary;
      default: return theme.colors.textSecondary;
    }
  }};
  color: white;
`;

export const PowerMetric = styled.span`
  font-family: ${({ theme }) => theme.fonts.bangers};
  font-size: 1.8rem;
  color: ${({ theme }) => theme.colors.primary};
  line-height: 1;
  text-shadow: 2px 2px 0 ${({ theme }) => theme.colors.secondary};
  display: inline-block;
`;

export const SectionTitle = styled.h4`
  font-family: ${({ theme }) => theme.fonts.permanentMarker};
  font-size: 1.3rem;
  color: ${({ theme }) => theme.colors.secondary};
  margin-top: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  text-transform: uppercase;
  border-bottom: 2px dashed ${({ theme }) => theme.colors.border};
  padding-bottom: ${({ theme }) => theme.spacing.sm};
`;

export const HeroStatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.8rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const StatBarWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const StatBarLabel = styled.span`
  font-family: ${({ theme }) => theme.fonts.permanentMarker};
  font-size: 0.9rem;
  width: 90px;
  text-align: right;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const StatBarContainer = styled.div`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.border};
  border: 2px solid ${({ theme }) => theme.colors.secondary};
  padding: 2px;
`;

export const StatBarFill = styled.div<{ width: number }>`
  background-color: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.secondary};
  font-weight: bold;
  font-size: 0.8rem;
  text-align: right;
  padding: 0.2rem 0.5rem;
  transition: width 0.5s ease-in-out;
  white-space: nowrap;
  width: ${({ width }) => width}%;
`;
