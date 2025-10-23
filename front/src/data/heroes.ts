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

];

// Função para filtrar heróis por afiliação
export const filterHeroesByAffiliation = (heroes: Hero[], affiliation: 'all' | 'marvel' | 'dc') => {
  if (affiliation === 'all') return heroes;
  return heroes.filter(hero => hero.afiliacao === affiliation);
};
