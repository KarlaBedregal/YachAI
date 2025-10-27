import React from 'react';
import { motion } from 'framer-motion';
import { GAME_TYPES } from '../utils/constants';

const GameSelector = ({ onSelectGame }) => {
  const games = [
    {
      type: GAME_TYPES.TRIVIA,
      title: 'Trivia',
      emoji: '🧩',
      description: 'Responde preguntas y demuestra lo que sabes',
      color: 'from-purple-500 to-pink-500',
      features: ['Preguntas de opción múltiple', 'Explicaciones detalladas', 'Puntos por respuesta correcta'],
    },
    {
      type: GAME_TYPES.ADVENTURE,
      title: 'Aventura',
      emoji: '🏕️',
      description: 'Vive una historia interactiva y aprende explorando',
      color: 'from-green-500 to-blue-500',
      features: ['Historia personalizada', 'Decisiones importantes', 'Múltiples finales'],
    },
    {
      type: GAME_TYPES.MARKET,
      title: 'Mercadito',
      emoji: '🛒',
      description: 'Aprende aplicando conocimientos en situaciones reales',
      color: 'from-blue-500 to-purple-600',
      features: ['Misiones prácticas', 'Simulación divertida', 'Aprende haciendo'],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
          Elige tu modo de juego
        </h1>
        <p className="text-gray-600 text-lg">
          Cada juego es una forma diferente de aprender 🎮
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {games.map((game, index) => (
          <motion.div
            key={game.type}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -10, scale: 1.02 }}
            onClick={() => onSelectGame(game.type)}
            className="cursor-pointer"
          >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all">
              {/* Header */}
              <div className={`bg-gradient-to-r ${game.color} p-6 text-white text-center`}>
                <div className="text-6xl mb-3">{game.emoji}</div>
                <h2 className="text-2xl font-bold">{game.title}</h2>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-700 mb-4 text-center">
                  {game.description}
                </p>

                <div className="space-y-2">
                  {game.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  className={`
                    w-full mt-6 py-3 rounded-xl font-bold text-white
                    bg-gradient-to-r ${game.color}
                    hover:shadow-lg transition-all
                  `}
                >
                  Jugar {game.title}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default GameSelector;
