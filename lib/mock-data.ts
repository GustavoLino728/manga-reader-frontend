// Mock data for the manga reader application

export interface Chapter {
  id: string;
  number: string;
  title?: string;
  releasedAt: Date;
  isRead?: boolean;
}

export interface MangaDetail {
  id: string;
  title: string;
  alternativeTitles: string[];
  coverImage: string;
  description: string;
  rating: number;
  totalChapters: number;
  bookmarks: number;
  status: 'Ongoing' | 'Completed' | 'Hiatus';
  type: 'MANGA' | 'MANHWA' | 'MANHUA';
  genres: string[];
  author: string;
  artist: string;
  chapters: Chapter[];
}

// Generate chapters for manga detail
function generateChapters(totalChapters: number): Chapter[] {
  const chapters: Chapter[] = [];
  const now = Date.now();
  
  for (let i = totalChapters; i >= 1; i--) {
    const daysAgo = (totalChapters - i) * 7;
    const isRecent = i >= totalChapters - 5;
    
    chapters.push({
      id: `ch${i}`,
      number: String(i),
      title: i % 3 === 0 ? undefined : `Titulo do Capitulo ${i}`,
      releasedAt: new Date(now - daysAgo * 24 * 60 * 60 * 1000),
      isRead: i < totalChapters - 2 && Math.random() > 0.5,
    });
  }
  
  return chapters;
}

export const mangaDetails: Record<string, MangaDetail> = {
  '3': {
    id: '3',
    title: 'The Nebulas Civilization',
    alternativeTitles: [
      'Nebulas Civilization',
      'Seulgiroun Munmyeongsaenghwal',
      'A Civilizacao da Nebulosa',
    ],
    coverImage: 'https://picsum.photos/seed/manga3/400/560',
    description: `Choi Sungwoon completou com sucesso todas as conquistas do jogo "Perished World" como o jogador numero 1 no ranking do jogo. Apos um breve momento de alegria devido a sua conquista, Sungwoon recebe um e-mail suspeito e e convocado para uma versao real de "Perished World", comecando sua jornada para se tornar um "deus".

Neste mundo, ele deve guiar uma civilizacao primitiva atraves dos desafios da sobrevivencia, guerra e evolucao tecnologica. Com seu conhecimento do jogo, Sungwoon tem uma vantagem unica, mas logo descobre que a realidade e muito mais complexa do que qualquer simulacao.`,
    rating: 9.6,
    totalChapters: 122,
    bookmarks: 30800,
    status: 'Ongoing',
    type: 'MANHWA',
    genres: ['Acao', 'Aventura', 'Fantasia', 'Isekai'],
    author: 'Toika',
    artist: 'Studio Beongreon',
    chapters: generateChapters(122),
  },
  '1': {
    id: '1',
    title: 'The Great Mage Returns After 4000 Years',
    alternativeTitles: [
      '4000 Years Later, The Great Mage Returns',
      'O Grande Mago Retorna Apos 4000 Anos',
    ],
    coverImage: 'https://picsum.photos/seed/manga1/400/560',
    description: `Lucas Traumen, o maior mago da historia, foi amaldicoado por um deus maligno e passou 4000 anos aprisionado em um ciclo sem fim de dor e solidao. Quando finalmente consegue escapar, ele reencarna no corpo de Frei Blake, um jovem nobre sem talento magico.

Agora, com seu vasto conhecimento e determinacao inabalavel, Lucas deve reconstruir seu poder do zero enquanto enfrenta novos inimigos e desvenda os misterios de um mundo que mudou drasticamente em sua ausencia.`,
    rating: 9.2,
    totalChapters: 186,
    bookmarks: 45200,
    status: 'Ongoing',
    type: 'MANHWA',
    genres: ['Acao', 'Aventura', 'Fantasia', 'Magia'],
    author: 'Nakun',
    artist: 'Studio Redice',
    chapters: generateChapters(186),
  },
  '2': {
    id: '2',
    title: 'Overgeared',
    alternativeTitles: [
      'Tempsmith',
      'Super Equipado',
    ],
    coverImage: 'https://picsum.photos/seed/manga2/400/560',
    description: `Shin Youngwoo e um jogador comum do MMORPG Satisfy que sonha em se tornar rico. Apos encontrar um item lendario que o transforma no unico Blacksmith lendario do jogo, sua vida muda completamente.

Como Grid, o Blacksmith lendario, ele deve navegar pelos desafios do jogo enquanto equilibra sua vida real. Sua jornada o levara de um jogador desprezado a um dos mais poderosos do mundo.`,
    rating: 9.5,
    totalChapters: 210,
    bookmarks: 62000,
    status: 'Ongoing',
    type: 'MANHWA',
    genres: ['Acao', 'Aventura', 'Comedia', 'Fantasia', 'Jogo'],
    author: 'Park Saenal',
    artist: 'Team Argo',
    chapters: generateChapters(210),
  },
};

export const featuredMangas = [
  {
    id: '1',
    title: 'The Great Mage Returns After 4000 Years',
    coverImage: 'https://picsum.photos/seed/manga1/300/400',
    rating: 9.2,
    isNew: false,
  },
  {
    id: '2',
    title: 'Overgeared',
    coverImage: 'https://picsum.photos/seed/manga2/300/400',
    rating: 9.5,
    isNew: true,
  },
  {
    id: '3',
    title: 'The Nebulas Civilization',
    coverImage: 'https://picsum.photos/seed/manga3/300/400',
    rating: 8.8,
    isNew: false,
  },
  {
    id: '4',
    title: 'Solo Farming in the Tower',
    coverImage: 'https://picsum.photos/seed/manga4/300/400',
    rating: 9.0,
    isNew: true,
  },
  {
    id: '5',
    title: 'Only I Have an EX-Grade Summon',
    coverImage: 'https://picsum.photos/seed/manga5/300/400',
    rating: 7.3,
    isHot: true,
  },
  {
    id: '6',
    title: 'The Beginning After The End',
    coverImage: 'https://picsum.photos/seed/manga6/300/400',
    rating: 9.6,
    isNew: false,
  },
  {
    id: '7',
    title: 'Artifact Devouring Player',
    coverImage: 'https://picsum.photos/seed/manga7/300/400',
    rating: 8.5,
    isNew: false,
  },
  {
    id: '8',
    title: 'Eternally Regressing Knight',
    coverImage: 'https://picsum.photos/seed/manga8/300/400',
    rating: 8.9,
    isHot: true,
  },
  {
    id: '9',
    title: 'The Mercenary Machinations',
    coverImage: 'https://picsum.photos/seed/manga9/300/400',
    rating: 8.2,
    isNew: true,
  },
  {
    id: '10',
    title: 'Raising a Villainess',
    coverImage: 'https://picsum.photos/seed/manga10/300/400',
    rating: 8.7,
    isNew: false,
  },
];

export const trendingMangas = [
  {
    id: '1',
    title: 'Childhood Friend of the Zenith',
    coverImage: 'https://picsum.photos/seed/trend1/300/400',
    rating: 9.2,
    latestChapter: 'Capitulo 100',
    isHot: true,
  },
  {
    id: '2',
    title: 'Chronicles of the Lazy Sovereign',
    coverImage: 'https://picsum.photos/seed/trend2/300/400',
    rating: 8.9,
    latestChapter: 'Capitulo 41',
  },
  {
    id: '3',
    title: 'A Dragonslayers Peerless Regression',
    coverImage: 'https://picsum.photos/seed/trend3/300/400',
    rating: 9.0,
    latestChapter: 'Capitulo 78',
  },
  {
    id: '4',
    title: 'The Ultimate Shut-In',
    coverImage: 'https://picsum.photos/seed/trend4/300/400',
    rating: 9.4,
    latestChapter: 'Capitulo 73',
    isNew: true,
  },
  {
    id: '5',
    title: 'A Villains Will to Survive',
    coverImage: 'https://picsum.photos/seed/trend5/300/400',
    rating: 9.6,
    latestChapter: 'Capitulo 50',
  },
  {
    id: '6',
    title: 'Reborn as the Enemy Prince',
    coverImage: 'https://picsum.photos/seed/trend6/300/400',
    rating: 8.8,
    latestChapter: 'Capitulo 65',
  },
  {
    id: '7',
    title: 'The Demon Princes Bride',
    coverImage: 'https://picsum.photos/seed/trend7/300/400',
    rating: 8.4,
    latestChapter: 'Capitulo 32',
  },
  {
    id: '8',
    title: 'Return of the Unrivaled Spear Knight',
    coverImage: 'https://picsum.photos/seed/trend8/300/400',
    rating: 9.1,
    latestChapter: 'Capitulo 156',
    isHot: true,
  },
];

export const popularMangas = {
  weekly: [
    {
      id: '1',
      title: 'Childhood Friend of the Zenith',
      coverImage: 'https://picsum.photos/seed/pop1/300/400',
      rating: 9.2,
      genres: ['Acao', 'Fantasia', 'Murim'],
    },
    {
      id: '2',
      title: 'Chronicles of the Lazy Sovereign',
      coverImage: 'https://picsum.photos/seed/pop2/300/400',
      rating: 8.9,
      genres: ['Acao', 'Aventura', 'Murim'],
    },
    {
      id: '3',
      title: 'A Dragonslayers Peerless Regression',
      coverImage: 'https://picsum.photos/seed/pop3/300/400',
      rating: 9.0,
      genres: ['Acao', 'Aventura', 'Fantasia'],
    },
    {
      id: '4',
      title: 'The Ultimate Shut-In',
      coverImage: 'https://picsum.photos/seed/pop4/300/400',
      rating: 9.4,
      genres: ['Acao', 'Aventura', 'Comedia'],
    },
    {
      id: '5',
      title: 'A Villains Will to Survive',
      coverImage: 'https://picsum.photos/seed/pop5/300/400',
      rating: 9.6,
      genres: ['Acao', 'Aventura', 'Comedia'],
    },
  ],
  monthly: [
    {
      id: '6',
      title: 'Solo Leveling',
      coverImage: 'https://picsum.photos/seed/pop6/300/400',
      rating: 9.8,
      genres: ['Acao', 'Fantasia', 'Aventura'],
    },
    {
      id: '7',
      title: 'Tower of God',
      coverImage: 'https://picsum.photos/seed/pop7/300/400',
      rating: 9.5,
      genres: ['Acao', 'Aventura', 'Fantasia'],
    },
    {
      id: '8',
      title: 'The Beginning After The End',
      coverImage: 'https://picsum.photos/seed/pop8/300/400',
      rating: 9.6,
      genres: ['Acao', 'Aventura', 'Fantasia'],
    },
    {
      id: '9',
      title: 'Omniscient Readers Viewpoint',
      coverImage: 'https://picsum.photos/seed/pop9/300/400',
      rating: 9.4,
      genres: ['Acao', 'Aventura', 'Fantasia'],
    },
    {
      id: '10',
      title: 'Return of the Mount Hua Sect',
      coverImage: 'https://picsum.photos/seed/pop10/300/400',
      rating: 9.3,
      genres: ['Acao', 'Murim', 'Comedia'],
    },
  ],
  alltime: [
    {
      id: '11',
      title: 'One Piece',
      coverImage: 'https://picsum.photos/seed/pop11/300/400',
      rating: 9.9,
      genres: ['Acao', 'Aventura', 'Comedia'],
    },
    {
      id: '12',
      title: 'Naruto',
      coverImage: 'https://picsum.photos/seed/pop12/300/400',
      rating: 9.7,
      genres: ['Acao', 'Aventura', 'Shounen'],
    },
    {
      id: '13',
      title: 'Attack on Titan',
      coverImage: 'https://picsum.photos/seed/pop13/300/400',
      rating: 9.6,
      genres: ['Acao', 'Drama', 'Fantasia'],
    },
    {
      id: '14',
      title: 'Dragon Ball',
      coverImage: 'https://picsum.photos/seed/pop14/300/400',
      rating: 9.5,
      genres: ['Acao', 'Aventura', 'Comedia'],
    },
    {
      id: '15',
      title: 'Demon Slayer',
      coverImage: 'https://picsum.photos/seed/pop15/300/400',
      rating: 9.4,
      genres: ['Acao', 'Sobrenatural', 'Shounen'],
    },
  ],
};

export const latestUpdates = [
  {
    id: '1',
    title: 'The Academys Sashimi Sword Master',
    coverImage: 'https://picsum.photos/seed/update1/300/400',
    chapters: [
      {
        id: 'ch73',
        number: '73',
        title: 'The Purge (3)',
        isPremium: true,
        releasedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      },
      {
        id: 'ch72',
        number: '72',
        title: 'The Purge (2)',
        isPremium: false,
        releasedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      },
    ],
  },
  {
    id: '2',
    title: 'Regressing with the Kings Power',
    coverImage: 'https://picsum.photos/seed/update2/300/400',
    chapters: [
      {
        id: 'ch136',
        number: '136',
        isPremium: true,
        releasedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      },
      {
        id: 'ch135',
        number: '135',
        isPremium: true,
        releasedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
    ],
  },
  {
    id: '3',
    title: 'The Dark Magician Transmigrates After 66666 Years',
    coverImage: 'https://picsum.photos/seed/update3/300/400',
    chapters: [
      {
        id: 'ch98',
        number: '98',
        title: 'New Beginnings',
        isPremium: false,
        releasedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      },
      {
        id: 'ch97',
        number: '97',
        title: 'The Final Battle',
        isPremium: false,
        releasedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
    ],
  },
  {
    id: '4',
    title: 'Reincarnated as a Sword',
    coverImage: 'https://picsum.photos/seed/update4/300/400',
    chapters: [
      {
        id: 'ch45',
        number: '45',
        title: 'The Dungeon',
        isPremium: false,
        releasedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      },
      {
        id: 'ch44',
        number: '44',
        title: 'Training Arc',
        isPremium: false,
        releasedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
    ],
  },
  {
    id: '5',
    title: 'I Became the Tyrants Secretary',
    coverImage: 'https://picsum.photos/seed/update5/300/400',
    chapters: [
      {
        id: 'ch67',
        number: '67',
        isPremium: true,
        releasedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
      },
      {
        id: 'ch66',
        number: '66',
        isPremium: false,
        releasedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    ],
  },
  {
    id: '6',
    title: 'Return of the Legendary Spear Knight',
    coverImage: 'https://picsum.photos/seed/update6/300/400',
    chapters: [
      {
        id: 'ch158',
        number: '158',
        title: 'The Tournament',
        isPremium: false,
        releasedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      },
      {
        id: 'ch157',
        number: '157',
        title: 'Preparation',
        isPremium: false,
        releasedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
    ],
  },
];
