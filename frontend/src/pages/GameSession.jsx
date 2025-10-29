import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import HeaderNavbar from '../components/HeaderNavbar';
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

  const [step, setStep] = useState('select'); // select, playing, result
  const [sessionId, setSessionId] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedGameType, setSelectedGameType] = useState(null);
  const [gameContent, setGameContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [gameResult, setGameResult] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleGameStart = async ({ topic, gameType, difficulty }) => {
    setLoading(true);
    setError('');
    
    try {
      console.log('Iniciando juego:', { topic, gameType, difficulty });
      
      const response = await startGame(
        user.id,
        topic,
        gameType,
        difficulty,
        `${user.age}-${user.age + 4}` // Rango de edad basado en el usuario
      );

      console.log('Respuesta del backend:', response);

      if (!response.session || !response.session.id || !response.session.content) {
        throw new Error('La respuesta del servidor no contiene los datos esperados');
      }

      const session = response.session;

      setSessionId(session.id);
      setSelectedTopic(session.topic);
      setSelectedGameType(session.game_type);
      setCurrentSession(session);

      console.log('Contenido del juego:', session.content);

      // Extraer contenido según tipo de juego
      let content = null;

      if (gameType === 'trivia' && session.content.trivia_questions) {
        content = { questions: session.content.trivia_questions };
      } else if (gameType === 'adventure' && session.content.adventure_story) {
        content = { story: session.content.adventure_story };
      } else if (gameType === 'market' && session.content.market_missions) {
        content = { missions: session.content.market_missions };
      }

      if (!content) {
        console.error('Contenido no encontrado. Estructura de la sesión:', session);
        throw new Error(`No se pudo cargar el contenido del juego tipo "${gameType}"`);
      }

      setGameContent(content);
      
      setStep('playing');
    } catch (err) {
      console.error('Error al iniciar juego:', err);
      setError(err.response?.data?.error || err.message || 'Error al iniciar el juego');
    } finally {
      setLoading(false);
    }
  };

  const handleGameComplete = async (answers, score) => {
    setLoading(true);

    try {
      console.log('Enviando respuestas:', answers);
      
      const result = await submitGame(sessionId, answers);
      
      console.log('Resultado recibido:', result);
      
      setGameResult(result.result);
      setStep('result');
      
      // Actualizar puntos del usuario
      updateUserScore(score);
    } catch (err) {
      console.error('Error al enviar juego:', err);
      setError(err.response?.data?.error || 'Error al enviar el juego');
    } finally {
      setLoading(false);
    }
  };


  const handlePlayAgain = () => {
    setStep('select');
    setGameContent(null);
    setSessionId(null);
    setSelectedTopic(null);
    setSelectedGameType(null);
    setGameResult(null);
    setError('');
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  if (!user) {
    return null;
  }

    return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 py-6">
      <AnimatePresence mode="wait">
        {/* Game Selector */}
        {step === 'select' && !loading && (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {error && (
              <div className="max-w-6xl mx-auto mb-6 px-6">
                <div className="bg-red-100 border-2 border-red-300 rounded-xl p-4 text-red-700">
                  {error}
                </div>
              </div>
            )}
            <GameSelector onSelectGame={handleGameStart} />
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
                Generando contenido personalizado sobre: {selectedTopic}
              </p>
            </div>
          </motion.div>
        )}

        {/* Playing Game */}
        {step === 'playing' && gameContent && !loading && (
          <motion.div
            key="playing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            {selectedGameType === 'trivia' && gameContent.questions && (
              <TriviaGame
                questions={gameContent.questions}
                onComplete={handleGameComplete}
              />
            )}
            {selectedGameType === 'adventure' && gameContent.story && (
              <AdventureGame
                story={gameContent.story}
                onComplete={handleGameComplete}
              />
            )}
            {selectedGameType === 'market' && gameContent.missions && (
              <MarketGame
                missions={gameContent.missions}
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
            className="max-w-4xl mx-auto"
          >
            <GameResult
              result={gameResult}
              topic={selectedTopic}
              onPlayAgain={handlePlayAgain}
              onGoToDashboard={handleGoToDashboard}
            />
          </motion.div>
        )}

        {/* Error Message */}
        {error && step !== 'select' && (
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
                  setStep('select');
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
