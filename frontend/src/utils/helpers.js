export const formatScore = (score) => {
  return score.toLocaleString('es-PE');
};

export const calculatePercentage = (score, maxScore) => {
  if (maxScore === 0) return 0;
  return Math.round((score / maxScore) * 100);
};

export const getScoreMessage = (percentage) => {
  if (percentage >= 90) return { message: '¡Excelente! 🌟', color: 'text-green-500' };
  if (percentage >= 70) return { message: '¡Muy bien! 👏', color: 'text-blue-500' };
  if (percentage >= 50) return { message: '¡Buen intento! 💪', color: 'text-yellow-500' };
  return { message: '¡Sigue practicando! 📚', color: 'text-orange-500' };
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const getGameTypeLabel = (gameType) => {
  const labels = {
    trivia: { name: 'Trivia', emoji: '🧩', color: 'bg-purple-500' },
    adventure: { name: 'Aventura', emoji: '🏕️', color: 'bg-green-500' },
    market: { name: 'Mercadito', emoji: '🛒', color: 'bg-blue-500' },
  };
  return labels[gameType] || { name: gameType, emoji: '🎮', color: 'bg-gray-500' };
};

export const getDifficultyLabel = (difficulty) => {
  const labels = {
    easy: { name: 'Fácil', color: 'text-green-500', stars: '⭐' },
    medium: { name: 'Medio', color: 'text-yellow-500', stars: '⭐⭐' },
    hard: { name: 'Difícil', color: 'text-red-500', stars: '⭐⭐⭐' },
  };
  return labels[difficulty] || labels.medium;
};

export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
