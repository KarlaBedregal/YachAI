import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUserStore } from '../store/userStore';
import { useGameStore } from '../store/gameStore';
import { getUserStatistics, getLeaderboard, getUserSessions, analyzeIntelligence } from '../services/api';
import { AVATARS, INTELLIGENCE_TYPES } from '../utils/constants';
import { formatScore, getGameTypeLabel, formatDate } from '../utils/helpers';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const setCurrentTopic = useGameStore((state) => state.setCurrentTopic);
  
  const [statistics, setStatistics] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [recentSessions, setRecentSessions] = useState([]);
  const [intelligenceProfile, setIntelligenceProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      const [stats, board, sessions] = await Promise.all([
        getUserStatistics(user.id),
        getLeaderboard(10),
        getUserSessions(user.id, 5),
      ]);

      setStatistics(stats);
      setLeaderboard(board);
      setRecentSessions(sessions);

      // Analizar inteligencias si hay datos
      if (stats && stats.games_played > 0) {
        const profile = await analyzeIntelligence(user.id);
        setIntelligenceProfile(profile.profile);
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewGame = () => {
    navigate('/game-session');
  };

  const avatar = AVATARS.find(a => a.id === user?.avatar);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 flex items-center justify-center">
        <div className="text-4xl animate-pulse">⏳ Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-8 mb-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="text-7xl">{avatar?.emoji}</div>
              <div>
                <h1 className="text-4xl font-bold text-gray-800">
                  ¡Hola, {user.username}!
                </h1>
                <p className="text-xl text-gray-600 mt-1">
                  Nivel {user.level} • {formatScore(user.total_score)} puntos
                </p>
              </div>
            </div>
            
            <button
              onClick={handleNewGame}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg text-lg"
            >
              🎮 Nuevo Juego
            </button>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {/* Statistics Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="text-4xl mb-3">🎮</div>
            <h3 className="text-2xl font-bold text-gray-800">
              {statistics?.games_played || 0}
            </h3>
            <p className="text-gray-600">Juegos Completados</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="text-4xl mb-3">📚</div>
            <h3 className="text-2xl font-bold text-gray-800">
              {statistics?.topics_completed || 0}
            </h3>
            <p className="text-gray-600">Temas Aprendidos</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="text-4xl mb-3">🏆</div>
            <h3 className="text-2xl font-bold text-gray-800">
              #{leaderboard.findIndex(u => u.id === user.id) + 1 || '-'}
            </h3>
            <p className="text-gray-600">Ranking Global</p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Intelligence Profile */}
          {intelligenceProfile && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                🧠 Tu Perfil de Inteligencias
              </h2>

              <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">Tu punto fuerte:</p>
                <p className="text-xl font-bold text-purple-700">
                  {intelligenceProfile.strongest_name}
                </p>
                <p className="text-sm text-gray-700 mt-2">
                  {intelligenceProfile.profile_description}
                </p>
              </div>

              <div className="space-y-3">
                {Object.entries(intelligenceProfile.scores).map(([type, score]) => {
                  const intel = INTELLIGENCE_TYPES[type.toUpperCase()];
                  if (!intel || score === 0) return null;
                  
                  const maxScore = Math.max(...Object.values(intelligenceProfile.scores));
                  const percentage = (score / maxScore) * 100;

                  return (
                    <div key={type}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium flex items-center gap-1">
                          {intel.emoji} {intel.name}
                        </span>
                        <span className="text-sm font-bold">{score} pts</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: intel.color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Recent Sessions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold mb-4">📊 Últimos Juegos</h2>

            {recentSessions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Aún no has jugado ningún juego. ¡Empieza ahora!
              </p>
            ) : (
              <div className="space-y-3">
                {recentSessions.map((session) => {
                  const gameInfo = getGameTypeLabel(session.game_type);
                  return (
                    <div
                      key={session.id}
                      className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-2xl">{gameInfo.emoji}</span>
                            <h3 className="font-bold text-gray-800">
                              {session.topic}
                            </h3>
                          </div>
                          <p className="text-sm text-gray-600">
                            {formatDate(session.started_at)}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-purple-600">
                            {session.score} pts
                          </div>
                          <div className={`text-xs px-2 py-1 rounded ${gameInfo.color} text-white`}>
                            {gameInfo.name}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* Leaderboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold mb-4">🏆 Ranking Global</h2>

            <div className="space-y-2">
              {leaderboard.slice(0, 10).map((player, index) => {
                const playerAvatar = AVATARS.find(a => a.id === player.avatar);
                const isCurrentUser = player.id === user.id;

                return (
                  <div
                    key={player.id}
                    className={`flex items-center gap-4 p-3 rounded-xl ${
                      isCurrentUser 
                        ? 'bg-gradient-to-r from-purple-100 to-pink-100 ring-2 ring-purple-400'
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className="text-2xl font-bold text-gray-600 w-8">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                    </div>
                    <div className="text-3xl">{playerAvatar?.emoji}</div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-800">
                        {player.username} {isCurrentUser && '(Tú)'}
                      </p>
                      <p className="text-sm text-gray-600">
                        Nivel {player.level}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-purple-600">
                        {formatScore(player.total_score)}
                      </p>
                      <p className="text-xs text-gray-500">puntos</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
