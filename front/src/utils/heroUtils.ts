import { Hero } from '../data/heroes';

// Mapeamento de IDs para refs de áudio
export const getAudioRefId = (heroId: string): string => {
  const audioMap: { [key: string]: string } = {
    'batman': 'batman',
    'spiderman': 'spiderman',
    'superman': 'superman',
    'avengers': 'avengers',
    'ironman': 'ironman',
    'captainamerica': 'captainamerica',
    'blackpanther': 'blackpanther',
    'deadpool': 'deadpool',
    'flash': 'flash',
    'wonderwoman': 'wonderwoman',
    'greenlantern': 'greenlantern',
    'justiceleague': 'justiceleague',
    'joker': 'joker',
    'harleyquinn': 'harleyquinn',
    'lexluthor': 'lexluthor',
    'bane': 'bane',
    'darkseid': 'darkseid',
    'suicidesquad': 'suicidesquad',
    'thanos': 'thanos',
    'doom': 'doom',
    'greengoblin': 'greengoblin',
    'loki': 'loki',
    'redskull': 'redskull',
    'ultron': 'ultron'
  };

  return audioMap[heroId] || 'avengers'; // fallback
};

// Função para obter texto do SpeechBubble baseado na afiliação
export const getSpeechBubbleText = (affiliation: 'all' | 'marvel' | 'dc'): string => {
  if (affiliation === 'marvel') return "Avante, Vingadores!";
  if (affiliation === 'dc') return "Pela Justiça!";
  return "Clique nos heróis!";
};

// Função para verificar se um herói é vilão
export const isVillain = (heroId: string): boolean => {
  const villainIds = [
    'joker', 'harleyquinn', 'lexluthor', 'bane', 'darkseid', 'suicidesquad',
    'thanos', 'doom', 'greengoblin', 'loki', 'redskull', 'ultron'
  ];
  return villainIds.includes(heroId);
};

// Função para filtrar apenas heróis (sem vilões)
export const filterHeroesOnly = (heroes: Hero[]): Hero[] => {
  return heroes.filter(hero => !isVillain(hero.id));
};
