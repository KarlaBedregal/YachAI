import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AvatarSelector from '../components/AvatarSelector';
import { registerUser } from '../services/api';
import { useUserStore } from '../store/userStore';

const Home = () => {
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);
  
  const [step, setStep] = useState(1); // 1: Welcome, 2: Register
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStart = () => {
    setStep(2);
  };

  const handleRegister = async () => {
    if (!username || username.length < 3) {
      setError('El nombre debe tener al menos 3 caracteres');
      return;
    }
    
    if (!selectedAvatar) {
      setError('Por favor elige un avatar');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await registerUser(username, selectedAvatar);
      setUser(response.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        {step === 1 ? (
          // Welcome Screen
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl p-12 text-center"
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              className="text-8xl mb-6"
            >
              🎮
            </motion.div>

            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              YachAI
            </h1>
            
            <p className="text-2xl text-gray-700 mb-2 font-semibold">
              Aprendizaje Gamificado con IA
            </p>
            
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Convierte cualquier tema educativo en minijuegos personalizados.
              ¡Aprende jugando con inteligencia artificial! 🚀
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl">
                <div className="text-4xl mb-3">🧩</div>
                <h3 className="font-bold text-lg mb-2">Trivia</h3>
                <p className="text-sm text-gray-600">
                  Responde preguntas sobre tu tema favorito
                </p>
              </div>
              
              <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
                <div className="text-4xl mb-3">🏕️</div>
                <h3 className="font-bold text-lg mb-2">Aventura</h3>
                <p className="text-sm text-gray-600">
                  Vive historias interactivas y educativas
                </p>
              </div>
              
              <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
                <div className="text-4xl mb-3">🛒</div>
                <h3 className="font-bold text-lg mb-2">Mercadito</h3>
                <p className="text-sm text-gray-600">
                  Aprende aplicando en situaciones reales
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStart}
                className="w-full max-w-md mx-auto block py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl font-bold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
              >
                🚀 Comenzar Aventura
              </motion.button>
              
              <button
                onClick={handleLogin}
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                ¿Ya tienes cuenta? Inicia sesión
              </button>
            </div>
          </motion.div>
        ) : (
          // Registration Screen
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl shadow-2xl p-10"
          >
            <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Crea tu Perfil de Jugador
            </h2>

            <div className="space-y-8">
              {/* Username Input */}
              <div>
                <label className="block text-lg font-bold text-gray-800 mb-3">
                  ¿Cómo te llamas?
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Escribe tu nombre de jugador"
                  className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition-all"
                  maxLength={20}
                />
                <p className="text-sm text-gray-500 mt-2">
                  {username.length}/20 caracteres
                </p>
              </div>

              {/* Avatar Selection */}
              <AvatarSelector
                selectedAvatar={selectedAvatar}
                onSelectAvatar={setSelectedAvatar}
              />

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 bg-red-100 border-2 border-red-300 rounded-xl text-red-700 text-center"
                >
                  {error}
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all"
                  disabled={loading}
                >
                  ← Atrás
                </button>
                
                <button
                  onClick={handleRegister}
                  disabled={loading || !username || !selectedAvatar}
                  className={`
                    flex-1 py-4 rounded-xl font-bold text-white text-lg
                    ${loading || !username || !selectedAvatar
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg'
                    }
                  `}
                >
                  {loading ? 'Creando...' : '¡Empezar a Jugar! 🎮'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Home;
