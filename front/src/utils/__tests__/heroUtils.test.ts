import { 
  getAudioRefId, 
  getSpeechBubbleText, 
  isVillain, 
  filterHeroesOnly 
} from '../heroUtils';
import { Hero } from '../../data/heroes';

describe('heroUtils', () => {
  describe('getAudioRefId', () => {
    it('should return correct audio ref ID for heroes', () => {
      expect(getAudioRefId('batman')).toBe('batman');
      expect(getAudioRefId('spiderman')).toBe('spiderman');
      expect(getAudioRefId('superman')).toBe('superman');
      expect(getAudioRefId('avengers')).toBe('avengers');
    });

    it('should return correct audio ref ID for villains', () => {
      expect(getAudioRefId('joker')).toBe('joker');
      expect(getAudioRefId('thanos')).toBe('thanos');
      expect(getAudioRefId('loki')).toBe('loki');
    });

    it('should return fallback for unknown IDs', () => {
      expect(getAudioRefId('unknown')).toBe('avengers');
      expect(getAudioRefId('')).toBe('avengers');
    });
  });

  describe('getSpeechBubbleText', () => {
    it('should return Marvel text for Marvel affiliation', () => {
      expect(getSpeechBubbleText('marvel')).toBe('Avante, Vingadores!');
    });

    it('should return DC text for DC affiliation', () => {
      expect(getSpeechBubbleText('dc')).toBe('Pela Justiça!');
    });

    it('should return default text for all affiliation', () => {
      expect(getSpeechBubbleText('all')).toBe('Clique nos heróis!');
    });
  });

  describe('isVillain', () => {
    it('should return true for DC villains', () => {
      expect(isVillain('joker')).toBe(true);
      expect(isVillain('harleyquinn')).toBe(true);
      expect(isVillain('lexluthor')).toBe(true);
      expect(isVillain('bane')).toBe(true);
      expect(isVillain('darkseid')).toBe(true);
      expect(isVillain('suicidesquad')).toBe(true);
    });

    it('should return true for Marvel villains', () => {
      expect(isVillain('thanos')).toBe(true);
      expect(isVillain('doom')).toBe(true);
      expect(isVillain('greengoblin')).toBe(true);
      expect(isVillain('loki')).toBe(true);
      expect(isVillain('redskull')).toBe(true);
      expect(isVillain('ultron')).toBe(true);
    });

    it('should return false for heroes', () => {
      expect(isVillain('batman')).toBe(false);
      expect(isVillain('spiderman')).toBe(false);
      expect(isVillain('superman')).toBe(false);
      expect(isVillain('avengers')).toBe(false);
    });

    it('should return false for unknown IDs', () => {
      expect(isVillain('unknown')).toBe(false);
      expect(isVillain('')).toBe(false);
    });
  });

  describe('filterHeroesOnly', () => {
    const mockHeroes: Hero[] = [
      {
        id: 'batman',
        nome: 'Batman',
        afiliacao: 'dc',
        imagemSrc: '/batman.png',
        audioSrc: '/audio/batman-theme.mp3',
        videoSrc: '/videos/batman.mp4',
        layout: 'card'
      },
      {
        id: 'joker',
        nome: 'Coringa',
        afiliacao: 'dc',
        imagemSrc: '/joker.png',
        audioSrc: '/audio/joker-theme.mp3',
        videoSrc: '/videos/joker.mp4',
        layout: 'card'
      },
      {
        id: 'spiderman',
        nome: 'Homem-Aranha',
        afiliacao: 'marvel',
        imagemSrc: '/spiderman.png',
        audioSrc: '/audio/spiderman-theme.mp3',
        videoSrc: '/videos/spiderman.mp4',
        layout: 'card'
      },
      {
        id: 'thanos',
        nome: 'Thanos',
        afiliacao: 'marvel',
        imagemSrc: '/thanos.png',
        audioSrc: '/audio/thanos-theme.mp3',
        videoSrc: '/videos/thanos.mp4',
        layout: 'card'
      }
    ];

    it('should filter out villains and keep only heroes', () => {
      const result = filterHeroesOnly(mockHeroes);
      
      expect(result).toHaveLength(2);
      expect(result.map(hero => hero.id)).toEqual(['batman', 'spiderman']);
    });

    it('should return empty array if no heroes', () => {
      const villainsOnly = mockHeroes.filter(hero => isVillain(hero.id));
      const result = filterHeroesOnly(villainsOnly);
      
      expect(result).toHaveLength(0);
    });

    it('should return all heroes if no villains', () => {
      const heroesOnly = mockHeroes.filter(hero => !isVillain(hero.id));
      const result = filterHeroesOnly(heroesOnly);
      
      expect(result).toHaveLength(2);
      expect(result).toEqual(heroesOnly);
    });
  });
});
