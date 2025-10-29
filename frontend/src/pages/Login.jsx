import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { loginUser } from '../services/api';
import { getUserByUsername } from '../services/api';
import { useUserStore } from '../store/userStore';


export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Intentando login...'); // ← DEBUG
    console.log('Username:', username);
    console.log('Password:', password);
    
    setLoading(true);
    setError('');

    try {
      console.log('Llamando a loginUser...'); // ← DEBUG
      
      const response = await loginUser({
        username: username.trim(),
        password: password.trim(),
      });
      
      console.log('Login exitoso:', response); // ← DEBUG

      setUser(response.user);
      navigate('/dashboard');
    } catch (err) {
      console.error('Error en login:', err); // ← DEBUG
      console.error('Error completo:', err.response); // ← DEBUG
      
      setError(err.response?.data?.error || 'Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card max-w-md w-full"
      >
        <h1 className="title-gradient text-center mb-8">
          🔐 Iniciar Sesión
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Usuario
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Tu nombre de usuario"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tu contraseña"
              className="w-full"
            />
          </div>

          {error && (
            <div className="bg-red-100 border-2 border-red-300 rounded-xl p-4 text-red-700">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50"
          >
            {loading ? 'Iniciando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-purple-600 hover:underline"
          >
            ← Volver al registro
          </button>
        </div>
      </motion.div>
    </div>
  );
}