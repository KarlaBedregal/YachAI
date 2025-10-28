import React from 'react';
import { motion } from 'framer-motion';
import { GAME_TYPES } from '../utils/constants';

export default function GameSelector({ onSelectGame }) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Elige tu modo de juego
          </h1>
          <p className="text-xl text-gray-600">
            Cada juego es una forma diferente de aprender 🎮
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {games.map((game, index) => (
            <motion.div
              key={game.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer"
              onClick={() => onSelectGame(game.type)}
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
                
                <ul className="space-y-2">
                  {game.features.map((feature, i) => (
                    <li key={i} className="flex items-start text-sm text-gray-500">
                      <span className="mr-2">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full mt-6 py-3 px-6 bg-gradient-to-r ${game.color} text-white font-bold rounded-lg hover:shadow-lg transition-all`}>
                  Jugar {game.title}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}