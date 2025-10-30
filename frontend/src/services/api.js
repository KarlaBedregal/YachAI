import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ========== USUARIOS ==========

export const registerUser = async (userData) => {
  const response = await api.post('/api/users/register', userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  console.log('Enviando login:', credentials); // ← DEBUG
  const response = await api.post('/api/users/login', credentials);
  console.log('Respuesta login:', response.data); // ← DEBUG
  return response.data;
};

export const getUser = async (userId) => {
  const response = await api.get(`/api/users/${userId}`);
  return response.data;
};

export const getUserByUsername = async (username) => {
  const response = await api.get(`/api/users/username/${username}`);
  return response.data;
};

export const getUserStatistics = async (userId) => {
  const response = await api.get(`/api/users/${userId}/statistics`);
  return response.data;
};

export const getUserAchievements = async (userId) => {
  const response = await api.get(`/api/users/${userId}/achievements`);
  return response.data;
};

export const getUserSessions = async (userId, limit = 10) => {
  const response = await api.get(`/api/users/${userId}/sessions`, {
    params: { limit },
  });
  return response.data;
};

export const getLeaderboard = async (limit = 10) => {
  const response = await api.get('/api/users/leaderboard', {
    params: { limit },
  });
  return response.data;
};

// ========== JUEGOS ==========

export const startGame = async (userId, topic, gameType, difficulty = 'medium', ageRange = '8-14') => {
  const response = await api.post('/api/games/start', {
    user_id: userId,
    topic,
    game_type: gameType,
    difficulty,
    age_range: ageRange,
  });
  return response.data;
};

export const getGameSession = async (sessionId) => {
  const response = await api.get(`/api/games/${sessionId}`);
  return response.data;
};

export const submitGame = async (sessionId, answers) => {
  const response = await api.post(`/api/games/${sessionId}/submit`, {
    answers,
  });
  return response.data;
};

// ========== IA ==========

export const generateContent = async (topic, gameType, difficulty = 'medium', ageRange = '8-14') => {
  const response = await api.post('/api/ai/generate-content', {
    topic,
    game_type: gameType,
    difficulty,
    age_range: ageRange,
  });
  return response.data;
};

export const generateFeedback = async (topic, score, maxScore, gameType, answers) => {
  const response = await api.post('/api/ai/generate-feedback', {
    topic,
    score,
    max_score: maxScore,
    game_type: gameType,
    answers,
  });
  return response.data;
};

export const analyzeIntelligence = async (userId) => {
  const response = await api.post('/api/ai/analyze-intelligence', {
    user_id: userId,
  });
  return response.data;
};

export const getChatMessages = async (limit = 50) => {
  const response = await api.get('/api/chat/messages', { params: { limit } });
  return response.data;
};

export const sendChatMessage = async (userId, username, avatar, message) => {
  const response = await api.post('/api/chat/send', {
    user_id: userId,
    username,
    avatar,
    message,
  });
  return response.data;
};

export const deleteChatMessage = async (messageId, userId) => {
  const response = await api.delete(`/api/chat/delete/${messageId}`, {
    data: { user_id: userId },
  });
  return response.data;
};

export default api;

