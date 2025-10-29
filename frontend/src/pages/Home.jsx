import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AvatarSelector from '../components/AvatarSelector';
import { registerUser } from '../services/api';
import { useUserStore } from '../store/userStore';


export default function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');  
  const [age, setAge] = useState('');  
  const [selectedAvatar, setSelectedAvatar] = useState('lion');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!username.trim()) {
      setError('El nombre es requerido');
      return;
    }
    
    if (!password.trim() || password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    if (!age || age < 5 || age > 18) {
      setError('La edad debe estar entre 5 y 18 años');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await registerUser({
        username: username.trim(),
        password: password.trim(),
        avatar: selectedAvatar,
        age: parseInt(age)
      });

      setUser(response.user);
      navigate('/game-session');
    } catch (err) {
      // Mostrar error detallado si viene del backend
      if (err.response?.data?.details) {
        const firstError = err.response.data.details[0];
        setError(firstError.msg || err.response.data.error);
      } else {
        setError(err.response?.data?.error || 'Error al registrar usuario');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-center bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card max-w-2xl w-full"
      >
        {/* Título */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="text-center mb-8"
        >
          <h1 className="title-gradient mb-4">
            Bienvenido a YachAI
          </h1>
          <p className="text-xl text-gray-600">
            ¡Aprende jugando con inteligencia artificial! 🚀
          </p>
        </motion.div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              ¿Cómo te llamas?
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Tu nombre de usuario"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
              maxLength={20}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Crea una contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
              minLength={6}
            />
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
             ¿Cuántos años tienes?
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Tu edad (5-18 años)"
              min="5"
              max="18"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
            />
          </div>

          {/* Avatar */}
          <AvatarSelector
            selectedAvatar={selectedAvatar}
            onSelectAvatar={setSelectedAvatar}
          />

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-100 border-2 border-red-300 rounded-xl p-4 text-red-700"
            >
              {error}
            </motion.div>
          )}

          {/* Botón */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creando cuenta...' : ' ¡Comenzar a Jugar!'}
          </motion.button>
        </form>

        {/* Link a login */}
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