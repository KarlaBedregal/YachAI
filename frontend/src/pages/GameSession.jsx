import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '../store/userStore';
import { useGameStore } from '../store/gameStore';
import GameSelector from '../components/GameSelector';
import TriviaGame from '../components/TriviaGame';
import AdventureGame from '../components/AdventureGame';
import MarketGame from '../components/MarketGame';
import GameResult from '../components/GameResult';
import { startGame, submitGame } from '../services/api';
import { SUGGESTED_TOPICS } from '../utils/constants';

const GameSession = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const updateUserScore = useUserStore((state) => state.updateUserScore);
  const { currentSession, setCurrentSession, resetGame } = useGameStore();

  const [step, setStep] = useState('topic'); // topic, game-type, playing, result
  const [topic, setTopic] = useState('');
  const [gameType, setGameType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [gameResult, setGameResult] = useState(null);

  if (!user) {
    navigate('/');
    return null;
  }

  const handleTopicSelect = (selectedTopic) => {
    setTopic(selectedTopic);
    setStep('game-type');
  };

  const handleGameTypeSelect = async (selectedGameType) => {
    setGameType(selectedGameType);
    setLoading(true);
    setError('');

    try {
      // Iniciar sesión de juego
      const response = await startGame(user.id, topic, selectedGameType);
      setCurrentSession(response.session);
      setStep('playing');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar el juego');
    } finally {
      setLoading(false);
    }
  };

  const handleGameComplete = async (answers, score) => {
    setLoading(true);

    try {
      // Enviar resultados
      const response = await submitGame(currentSession.id, answers);
      setGameResult(response.result);
      updateUserScore(score);
      setStep('result');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al enviar resultados');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAgain = () => {
    resetGame();
    setTopic('');
    setGameType(null);
    setGameResult(null);
    setStep('topic');
  };

  const handleGoToDashboard = () => {
    resetGame();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 py-6">
      <AnimatePresence mode="wait">
        {/* Topic Selection */}
        {step === 'topic' && (
          <motion.div
            key="topic"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-5xl mx-auto p-6"
          >
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h1 className="text-4xl font-bold text-center mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                ¿Qué quieres aprender hoy?
              </h1>
              <p className="text-center text-gray-600 mb-8">
                Escribe cualquier tema o elige uno sugerido
              </p>

              {/* Custom Topic Input */}
              <div className="mb-8">
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && topic && handleTopicSelect(topic)}
                  placeholder="Ejemplo: El ciclo del agua, Animales del Perú, Matemáticas..."
                  className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition-all"
                />
                {topic && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleTopicSelect(topic)}
                    className="w-full mt-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-pink-700 shadow-lg"
                  >
                    Continuar →
                  </motion.button>
                )}
              </div>

              {/* Suggested Topics */}
              <div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">
                  📌 Temas Sugeridos
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {SUGGESTED_TOPICS.map((suggestedTopic) => (
                    <motion.button
                      key={suggestedTopic.id}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleTopicSelect(suggestedTopic.title)}
                      className="p-4 bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl hover:border-purple-400 transition-all shadow-md hover:shadow-lg text-left"
                    >
                      <div className="text-3xl mb-2">{suggestedTopic.emoji}</div>
                      <h4 className="font-bold text-gray-800 mb-1">
                        {suggestedTopic.title}
                      </h4>
                      <p className="text-xs text-gray-600">
                        {suggestedTopic.category}
                      </p>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Game Type Selection */}
        {step === 'game-type' && !loading && (
          <motion.div
            key="game-type"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
          >
            <div className="max-w-6xl mx-auto mb-6 px-6">
              <button
                onClick={() => setStep('topic')}
                className="px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                ← Cambiar tema
              </button>
              <p className="mt-2 text-gray-700 font-medium">
                Tema seleccionado: <span className="font-bold">{topic}</span>
              </p>
            </div>
            <GameSelector onSelectGame={handleGameTypeSelect} />
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center min-h-[60vh]"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="text-6xl mb-4"
              >
                🤖
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                La IA está creando tu juego...
              </h2>
              <p className="text-gray-600">
                Generando contenido personalizado sobre: {topic}
              </p>
            </div>
          </motion.div>
        )}

        {/* Playing Game */}
        {step === 'playing' && currentSession && !loading && (
          <motion.div
            key="playing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            {gameType === 'trivia' && (
              <TriviaGame
                questions={currentSession.content.trivia_questions}
                onComplete={handleGameComplete}
              />
            )}
            {gameType === 'adventure' && (
              <AdventureGame
                story={currentSession.content.adventure_story}
                onComplete={handleGameComplete}
              />
            )}
            {gameType === 'market' && (
              <MarketGame
                missions={currentSession.content.market_missions}
                onComplete={handleGameComplete}
              />
            )}
          </motion.div>
        )}

        {/* Game Result */}
        {step === 'result' && gameResult && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <GameResult
              result={gameResult}
              topic={topic}
              onPlayAgain={handlePlayAgain}
              onGoToDashboard={handleGoToDashboard}
            />
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl mx-auto p-6"
          >
            <div className="bg-red-100 border-2 border-red-400 rounded-xl p-6 text-center">
              <p className="text-red-700 font-semibold mb-4">{error}</p>
              <button
                onClick={() => {
                  setError('');
                  setStep('topic');
                }}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Intentar de nuevo
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GameSession;
