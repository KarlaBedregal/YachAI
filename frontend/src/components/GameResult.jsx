import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { calculatePercentage, getScoreMessage, getGameTypeLabel } from '../utils/helpers';
import { INTELLIGENCE_TYPES } from '../utils/constants';

const GameResult = ({ result, topic, onPlayAgain, onGoToDashboard }) => {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);

  const percentage = calculatePercentage(result.score, result.max_score);
  const scoreMessage = getScoreMessage(percentage);
  const gameInfo = getGameTypeLabel(result.game_type);

  useEffect(() => {
    if (percentage >= 70) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [percentage]);

  // Obtener las inteligencias más desarrolladas
  const intelligenceScores = Object.entries(result.intelligence_analysis || {})
    .filter(([_, score]) => score > 0)
    .sort(([_, a], [__, b]) => b - a)
    .slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: Math.random() * window.innerWidth,
                y: -20,
                rotate: 0,
              }}
              animate={{
                y: window.innerHeight + 20,
                rotate: 360,
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                ease: 'linear',
              }}
              className="absolute text-2xl"
            >
              {['🎉', '🎊', '⭐', '🌟', '✨'][Math.floor(Math.random() * 5)]}
            </motion.div>
          ))}
        </div>
      )}

      {/* Main Result Card */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-6"
      >
        {/* Header */}
        <div className={`${gameInfo.color} text-white p-8 text-center`}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="text-7xl mb-4"
          >
            {gameInfo.emoji}
          </motion.div>
          <h1 className="text-3xl font-bold mb-2">¡Juego Completado!</h1>
          <p className="text-xl opacity-90">{topic}</p>
        </div>

        {/* Score Section */}
        <div className="p-8">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
              className="mb-4"
            >
              <div className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {result.score}
              </div>
              <div className="text-gray-600 text-lg">
                de {result.max_score} puntos
              </div>
            </motion.div>

            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="flex-1 bg-gray-200 rounded-full h-4 max-w-md">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ delay: 0.6, duration: 1 }}
                  className={`h-4 rounded-full ${
                    percentage >= 70 ? 'bg-green-500' : 
                    percentage >= 50 ? 'bg-yellow-500' : 'bg-orange-500'
                  }`}
                />
              </div>
              <span className="text-2xl font-bold text-gray-700">
                {percentage}%
              </span>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className={`text-2xl font-bold ${scoreMessage.color}`}
            >
              {scoreMessage.message}
            </motion.p>
          </div>

          {/* AI Feedback */}
          {result.feedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-200"
            >
              <h3 className="font-bold text-lg mb-2 text-gray-800 flex items-center gap-2">
                <span>🤖</span> Mensaje de tu tutor IA
              </h3>
              <p className="text-gray-700 leading-relaxed">{result.feedback}</p>
            </motion.div>
          )}

          {/* Intelligence Analysis */}
          {intelligenceScores.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="mb-8"
            >
              <h3 className="font-bold text-xl mb-4 text-gray-800">
                🧠 Inteligencias que desarrollaste
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                {intelligenceScores.map(([type, score]) => {
                  const intel = INTELLIGENCE_TYPES[type.toUpperCase()] || 
                                INTELLIGENCE_TYPES.LOGICAL_MATHEMATICAL;
                  return (
                    <div
                      key={type}
                      className="p-4 bg-white rounded-xl shadow-md border-2"
                      style={{ borderColor: intel.color }}
                    >
                      <div className="text-3xl mb-2">{intel.emoji}</div>
                      <h4 className="font-bold text-gray-800 mb-1">
                        {intel.name}
                      </h4>
                      <div className="text-sm text-gray-600 mb-2">
                        {intel.description}
                      </div>
                      <div className="text-xl font-bold" style={{ color: intel.color }}>
                        +{score} pts
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Recommendations */}
          {result.recommendations && result.recommendations.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              className="mb-8 p-6 bg-yellow-50 rounded-2xl border-2 border-yellow-200"
            >
              <h3 className="font-bold text-lg mb-3 text-gray-800 flex items-center gap-2">
                <span>💡</span> Recomendaciones
              </h3>
              <ul className="space-y-2">
                {result.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-1">▸</span>
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="grid md:grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onPlayAgain}
              className="py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
            >
              🔄 Jugar de Nuevo
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onGoToDashboard}
              className="py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-blue-700 transition-all shadow-lg"
            >
              📊 Ver Mi Progreso
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default GameResult;
