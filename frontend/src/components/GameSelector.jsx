import React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { GAME_TYPES } from '../utils/constants';

export default function GameSelector({ onSelectGame, loading }) {
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedGameType, setSelectedGameType] = useState(null);
  const games = [
    {
      type: 'trivia',
      title: 'Trivia',
      emoji: '🧩',
      description: 'Responde preguntas y demuestra lo que sabes',
      features: ['Preguntas de opción múltiple', 'Explicaciones detalladas', 'Puntos por respuesta correcta'],
      color: 'from-purple-500 to-pink-500'
    },
    {
      type: 'adventure',
      title: 'Aventura',
      emoji: '🏕️',
      description: 'Vive una historia interactiva y aprende explorando',
      features: ['Historia personalizada', 'Decisiones importantes', 'Múltiples finales'],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      type: 'market',
      title: 'Mercadito',
      emoji: '🛒',
      description: 'Aprende aplicando conocimientos en situaciones reales',
      features: ['Misiones prácticas', 'Simulación divertida', 'Aprende haciendo'],
      color: 'from-green-500 to-emerald-500'
    }
  ];
  const difficulties = [
    { value: 'easy', label: 'Fácil', emoji: '😊', color: 'bg-green-500' },
    { value: 'medium', label: 'Medio', emoji: '🤔', color: 'bg-yellow-500' },
    { value: 'hard', label: 'Difícil', emoji: '🤯', color: 'bg-red-500' }
  ];

  const handleStartGame = (gameType) => {
    if (!selectedTopic) {
      alert('Por favor escribe un tema antes de seleccionar el juego');
      return;
    }

    // Enviar con todos los campos requeridos
    onSelectGame({
      topic: selectedTopic,
      gameType: gameType,
      difficulty: selectedDifficulty
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Título */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🎮 Configura tu Juego
          </h1>
          <p className="text-xl text-gray-600">
            Elige el tema, dificultad y modo de juego
          </p>
        </motion.div>

        {/* Selector de Tema */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            📚 ¿Qué tema quieres aprender?
          </h2>
          <input
            type="text"
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            placeholder="Escribe el tema (ej: Animales del Perú, Matemáticas, El agua...)"
            className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition-all"
          />
        </motion.div>

        {/* Selector de Dificultad */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            🎯 Nivel de Dificultad
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {difficulties.map((diff) => (
              <button
                key={diff.value}
                onClick={() => setSelectedDifficulty(diff.value)}
                className={`
                  p-6 rounded-xl border-2 transition-all
                  ${selectedDifficulty === diff.value
                    ? 'border-purple-500 bg-purple-50 scale-105'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                  }
                `}
              >
                <div className="text-4xl mb-2">{diff.emoji}</div>
                <div className="font-bold text-lg">{diff.label}</div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Selector de Tipo de Juego */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
            🎲 Elige tu Modo de Juego
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {games.map((game, index) => (
              <motion.div
                key={game.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer"
                onClick={() => handleStartGame(game.type)}
              >
                <div className={`h-32 bg-gradient-to-r ${game.color} flex items-center justify-center`}>
                  <span className="text-7xl">{game.emoji}</span>
                </div>
                
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {game.title}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {game.description}
                  </p>

                  <button 
                    disabled={loading || !selectedTopic}
                    className={`
                      w-full mt-4 py-3 px-6 bg-gradient-to-r ${game.color} 
                      text-white font-bold rounded-lg transition-all
                      ${!selectedTopic || loading
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:shadow-lg'
                      }
                    `}
                  >
                    {loading ? '⏳ Generando...' : `Jugar ${game.title}`}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}