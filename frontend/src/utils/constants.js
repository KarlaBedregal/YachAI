export const AVATARS = [
  { id: 'cat', name: 'Gatito', emoji: '🐱' },
  { id: 'dog', name: 'Perrito', emoji: '🐶' },
  { id: 'fox', name: 'Zorro', emoji: '🦊' },
  { id: 'lion', name: 'León', emoji: '🦁' },
  { id: 'panda', name: 'Panda', emoji: '🐼' },
  { id: 'koala', name: 'Koala', emoji: '🐨' },
  { id: 'robot', name: 'Robot', emoji: '🤖' },
  { id: 'alien', name: 'Alien', emoji: '👽' },
  { id: 'unicorn', name: 'Unicornio', emoji: '🦄' },
  { id: 'dragon', name: 'Dragón', emoji: '🐉' },
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
