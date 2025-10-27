import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { AVATARS } from '../utils/constants';

const HeaderNavbar = () => {
  const { user, logout } = useUserStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  const avatar = AVATARS.find(a => a.id === user.avatar);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-3 hover:opacity-80">
            <span className="text-4xl">🎮</span>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                YachAI
              </h1>
              <p className="text-xs text-gray-600">Aprende Jugando</p>
            </div>
          </Link>

          {/* User Info */}
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"
            >
              <span className="text-3xl">{avatar?.emoji}</span>
              <div>
                <p className="font-bold text-gray-800">{user.username}</p>
                <p className="text-sm text-gray-600">
                  Nivel {user.level} • {user.total_score} pts
                </p>
              </div>
            </Link>

            <Link
              to="/game-session"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
            >
              🎮 Nuevo Juego
            </Link>

            <button
              onClick={handleLogout}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              Salir
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default HeaderNavbar;
