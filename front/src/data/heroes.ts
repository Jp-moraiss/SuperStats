// Estrutura de dados unificada para heróis
export type Hero = {
  id: string; // 'batman', 'spiderman', etc.
  nome: string; // 'Batman', 'Homem-Aranha'
  afiliacao: 'dc' | 'marvel';
  imagemSrc: string; // '/batman.png'
  audioSrc: string; // '/audio/batman-theme.mp3'
  videoSrc: string; // '/videos/batman.mp4' (para o overlay)
  layout: 'card'; // todos os cards são uniformes agora
};

export const heroesData: Hero[] = [
  {
    id: 'batman',
    nome: 'Batman',
    afiliacao: 'dc',
    imagemSrc: '/batman.png',
    audioSrc: '/audio/batman-theme.mp3',
    videoSrc: '/videos/batman.mp4',
    layout: 'card',
  },
  {
    id: 'justiceleague',
    nome: 'Liga da Justiça',
    afiliacao: 'dc',
    imagemSrc: '/justiceleague.png',
    audioSrc: '/audio/justiceleague-theme.mp3',
    videoSrc: 'https://cnhmrnnhplpomdszzpxn.supabase.co/storage/v1/object/public/videos/justiceleague.mp4',
    layout: 'card',
  },
  {
    id: 'spiderman',
    nome: 'Homem-Aranha',
    afiliacao: 'marvel',
    imagemSrc: '/spiderman.png',
    audioSrc: '/audio/spiderman-theme.mp3',
    videoSrc: '/videos/spiderman.mp4',
    layout: 'card',
  },
  {
    id: 'superman',
    nome: 'Superman',
    afiliacao: 'dc',
    imagemSrc: '/superman.png',
    audioSrc: '/audio/superman-theme.mp3',
    videoSrc: '/videos/superman.mp4',
    layout: 'card',
  },
  {
    id: 'avengers',
    nome: 'Os Vingadores',
    afiliacao: 'marvel',
    imagemSrc: '/avengers.png',
    audioSrc: '/audio/avengers-theme.mp3',
    videoSrc: '/videos/avengers.mp4',
    layout: 'card',
  },
  {
    id: 'ironman',
    nome: 'Homem de Ferro',
    afiliacao: 'marvel',
    imagemSrc: '/ironman.png',
    audioSrc: '/audio/ironman-theme.mp3',
    videoSrc: 'https://cnhmrnnhplpomdszzpxn.supabase.co/storage/v1/object/public/videos/ironman.mp4',
    layout: 'card',
  },
  {
    id: 'captainamerica',
    nome: 'Capitão América',
    afiliacao: 'marvel',
    imagemSrc: '/captainamerica.png',
    audioSrc: '/audio/captainamerica-theme.mp3',
    videoSrc: 'https://cnhmrnnhplpomdszzpxn.supabase.co/storage/v1/object/public/videos/captainamerica.mp4',
    layout: 'card',
  },
  {
    id: 'blackpanther',
    nome: 'Pantera Negra',
    afiliacao: 'marvel',
    imagemSrc: '/blackpanther.png',
    audioSrc: '/audio/blackpanther-theme.mp3',
    videoSrc: 'https://cnhmrnnhplpomdszzpxn.supabase.co/storage/v1/object/public/videos/blackpanther.mp4',
    layout: 'card',
  },
  {
    id: 'deadpool',
    nome: 'Deadpool',
    afiliacao: 'marvel',
    imagemSrc: '/deadpool.png',
    audioSrc: '/audio/deadpool-theme.mp3',
    videoSrc: 'https://cnhmrnnhplpomdszzpxn.supabase.co/storage/v1/object/public/videos/deadpool.mp4',
    layout: 'card',
  },
  {
    id: 'flash',
    nome: 'Flash',
    afiliacao: 'dc',
    imagemSrc: '/flash.png',
    audioSrc: '/audio/flash-theme.mp3',
    videoSrc: 'https://cnhmrnnhplpomdszzpxn.supabase.co/storage/v1/object/public/videos/flash.mp4',
    layout: 'card',
  },
  {
    id: 'wonderwoman',
    nome: 'Mulher Maravilha',
    afiliacao: 'dc',
    imagemSrc: '/wonderwoman.png',
    audioSrc: '/audio/wonderwoman-theme.mp3',
    videoSrc: 'https://cnhmrnnhplpomdszzpxn.supabase.co/storage/v1/object/public/videos/wonderwoman.mp4',
    layout: 'card',
  },
  {
    id: 'greenlantern',
    nome: 'Lanterna Verde',
    afiliacao: 'dc',
    imagemSrc: '/greenlantern.png',
    audioSrc: '/audio/greenlantern-theme.mp3',
    videoSrc: 'https://cnhmrnnhplpomdszzpxn.supabase.co/storage/v1/object/public/videos/greenlantern.mp4',
    layout: 'card',
  },
  // VILÕES DC
  {
    id: 'joker',
    nome: 'Coringa',
    afiliacao: 'dc',
    imagemSrc: '/joker.png',
    audioSrc: '/audio/joker-laugh.mp3',
    videoSrc: 'https://cnhmrnnhplpomdszzpxn.supabase.co/storage/v1/object/public/videos/joker.mp4',
    layout: 'card',
  },
  {
    id: 'harleyquinn',
    nome: 'Alerquina',
    afiliacao: 'dc',
    imagemSrc: '/harleyquinn.png',
    audioSrc: '/audio/harleyquinn-theme.mp3',
    videoSrc: 'https://cnhmrnnhplpomdszzpxn.supabase.co/storage/v1/object/public/videos/harleyquinn.mp4',
    layout: 'card',
  },
  {
    id: 'lexluthor',
    nome: 'Lex Luthor',
    afiliacao: 'dc',
    imagemSrc: '/lexluthor.png',
    audioSrc: '/audio/lexluthor-theme.mp3',
    videoSrc: 'https://cnhmrnnhplpomdszzpxn.supabase.co/storage/v1/object/public/videos/lexluthor.mp4',
    layout: 'card',
  },
  {
    id: 'bane',
    nome: 'Bane',
    afiliacao: 'dc',
    imagemSrc: '/bane.png',
    audioSrc: '/audio/bane-theme.mp3',
    videoSrc: 'https://cnhmrnnhplpomdszzpxn.supabase.co/storage/v1/object/public/videos/bane.mp4',
    layout: 'card',
  },
  {
    id: 'darkseid',
    nome: 'Darkseid',
    afiliacao: 'dc',
    imagemSrc: '/darkseid.png',
    audioSrc: '/audio/darkseid-theme.mp3',
    videoSrc: 'https://cnhmrnnhplpomdszzpxn.supabase.co/storage/v1/object/public/videos/darkseid.mp4',
    layout: 'card',
  },
  {
    id: 'suicidesquad',
    nome: 'Esquadrão Suicida',
    afiliacao: 'dc',
    imagemSrc: '/suicidesquad.png',
    audioSrc: '/audio/suicidesquad-theme.mp3',
    videoSrc: 'https://cnhmrnnhplpomdszzpxn.supabase.co/storage/v1/object/public/videos/suicidesquad.mp4',
    layout: 'card',
  },
  // VILÕES MARVEL
  {
    id: 'thanos',
    nome: 'Thanos',
    afiliacao: 'marvel',
    imagemSrc: '/thanos.png',
    audioSrc: '/audio/thanos-snap.mp3',
    videoSrc: 'https://cnhmrnnhplpomdszzpxn.supabase.co/storage/v1/object/public/videos/thanos.mp4',
    layout: 'card',
  },
  {
    id: 'doom',
    nome: 'Doutor Destino',
    afiliacao: 'marvel',
    imagemSrc: '/doom.png',
    audioSrc: '/audio/doom-theme.mp3',
    videoSrc: 'https://cnhmrnnhplpomdszzpxn.supabase.co/storage/v1/object/public/videos/doom.mp4',
    layout: 'card',
  },
  {
    id: 'greengoblin',
    nome: 'Duende Verde',
    afiliacao: 'marvel',
    imagemSrc: '/greengoblin.png',
    audioSrc: '/audio/greengoblin-theme.mp3',
    videoSrc: 'https://cnhmrnnhplpomdszzpxn.supabase.co/storage/v1/object/public/videos/greengoblin.mp4',
    layout: 'card',
  },
  {
    id: 'loki',
    nome: 'Loki',
    afiliacao: 'marvel',
    imagemSrc: '/loki.png',
    audioSrc: '/audio/loki-theme.mp3',
    videoSrc: 'https://cnhmrnnhplpomdszzpxn.supabase.co/storage/v1/object/public/videos/loki.mp4',
    layout: 'card',
  },
  {
    id: 'redskull',
    nome: 'Caveira Vermelha',
    afiliacao: 'marvel',
    imagemSrc: '/redskull.png',
    audioSrc: '/audio/redskull-theme.mp3',
    videoSrc: 'https://cnhmrnnhplpomdszzpxn.supabase.co/storage/v1/object/public/videos/redskull.mp4',
    layout: 'card',
  },
  {
    id: 'ultron',
    nome: 'Ultron',
    afiliacao: 'marvel',
    imagemSrc: '/ultron.png',
    audioSrc: '/audio/ultron-theme.mp3',
    videoSrc: 'https://cnhmrnnhplpomdszzpxn.supabase.co/storage/v1/object/public/videos/ultron.mp4',
    layout: 'card',
  },

];

// Função para filtrar heróis por afiliação
export const filterHeroesByAffiliation = (heroes: Hero[], affiliation: 'all' | 'marvel' | 'dc') => {
  if (affiliation === 'all') return heroes;
  return heroes.filter(hero => hero.afiliacao === affiliation);
};

// Função para obter vilões baseado na afiliação
export const getVillainsByAffiliation = (affiliation: 'marvel' | 'dc') => {
  const villainIds = {
    dc: ['joker', 'harleyquinn', 'lexluthor', 'bane', 'darkseid', 'suicidesquad'],
    marvel: ['thanos', 'doom', 'greengoblin', 'loki', 'redskull', 'ultron']
  };
  
  return heroesData.filter(hero => villainIds[affiliation].includes(hero.id));
};
