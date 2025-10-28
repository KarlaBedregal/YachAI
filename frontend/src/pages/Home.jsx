import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AvatarSelector from '../components/AvatarSelector';
import { registerUser } from '../services/api';
import { useUserStore } from '../store/userStore';


export default function Home() {
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('lion');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('Por favor escribe tu nombre');
      return;
    }

    if (username.length < 3) {
      setError('El nombre debe tener al menos 3 caracteres');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await registerUser(username.trim(), selectedAvatar);
      setUser(response.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 md:p-12"
      >
        {/* Logo y Título */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-6xl mb-4"
          >
            🎮
          </motion.div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            YachAI
          </h1>
          <p className="text-xl text-gray-600">
            Aprendizaje Gamificado con IA
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleRegister} className="space-y-6">
          {/* Selector de Avatar */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              Elige tu avatar:
            </label>
            <AvatarSelector
              selectedAvatar={selectedAvatar}
              onSelectAvatar={setSelectedAvatar}
            />
          </div>

          {/* Input de Nombre */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              ¿Cómo te llamas?
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Escribe tu nombre..."
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-purple-500 focus:outline-none text-lg"
              maxLength={20}
            />
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg"
            >
              {error}
            </motion.div>
          )}

          {/* Botón */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl font-bold py-4 rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? '⏳ Creando...' : '🚀 ¡Comenzar Aventura!'}
          </motion.button>
        </form>

        {/* Link a Login */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-purple-600 font-semibold hover:underline"
            >
              Inicia sesión aquí
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}