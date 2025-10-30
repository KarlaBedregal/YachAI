export const AVATARS = [
  { id: 'cat', name: 'Gatito', image: '/avatars/1.png' },
  { id: 'dog', name: 'Perrito', image: '/avatars/2.png' },
  { id: 'fox', name: 'Zorro', image: '/avatars/3.png' },
  { id: 'lion', name: 'León', image: '/avatars/4.png' },
  { id: 'panda', name: 'Panda', image: '/avatars/5.png' },
  { id: 'koala', name: 'Koala', image: '/avatars/6.png' },
  { id: 'robot', name: 'Robot', image: '/avatars/7.png' },
  { id: 'alien', name: 'Alien', image: '/avatars/8.png' },
  { id: 'unicorn', name: 'Unicornio', image: '/avatars/9.png' },
  { id: 'dragon', name: 'Dragón', image: '/avatars/10.png' },
  { id: 'penguin', name: 'Pingüino', image: '/avatars/11.png' },
];

export const GAME_TYPES = {
  TRIVIA: 'trivia',
  ADVENTURE: 'adventure',
  MARKET: 'market',
};

export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
};

export const SUGGESTED_TOPICS = [
  { id: 1, title: 'El Ciclo del Agua', category: 'Ciencias', emoji: '💧' },
  { id: 2, title: 'Animales del Perú', category: 'Ciencias', emoji: '🦙' },
  { id: 3, title: 'La Independencia del Perú', category: 'Historia', emoji: '🇵🇪' },
  { id: 4, title: 'Matemáticas Divertidas', category: 'Matemáticas', emoji: '🔢' },
  { id: 5, title: 'El Sistema Solar', category: 'Ciencias', emoji: '🌍' },
  { id: 6, title: 'Reciclaje y Ambiente', category: 'Ciencias', emoji: '♻️' },
  { id: 7, title: 'Cultura Inca', category: 'Historia', emoji: '🏛️' },
  { id: 8, title: 'Plantas del Perú', category: 'Ciencias', emoji: '🌿' },
];

export const INTELLIGENCE_TYPES = {
  LINGUISTIC: {
    id: 'linguistic',
    name: 'Lingüística',
    description: 'Habilidad con palabras y lenguaje',
    emoji: '📚',
    color: '#3B82F6',
  },
  LOGICAL_MATHEMATICAL: {
    id: 'logical_mathematical',
    name: 'Lógico-Matemática',
    description: 'Razonamiento lógico y números',
    emoji: '🔢',
    color: '#8B5CF6',
  },
  SPATIAL: {
    id: 'spatial',
    name: 'Espacial',
    description: 'Pensamiento visual y espacial',
    emoji: '🎨',
    color: '#EC4899',
  },
  NATURALISTIC: {
    id: 'naturalistic',
    name: 'Naturalista',
    description: 'Conexión con la naturaleza',
    emoji: '🌿',
    color: '#10B981',
  },
  INTERPERSONAL: {
    id: 'interpersonal',
    name: 'Interpersonal',
    description: 'Habilidades sociales',
    emoji: '👥',
    color: '#F59E0B',
  },
};
