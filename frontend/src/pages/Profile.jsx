import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUserStore } from '../store/userStore';
import { getUserStatistics, analyzeIntelligence, getUserAchievements } from '../services/api';
import { AVATARS, INTELLIGENCE_TYPES } from '../utils/constants';
import { formatScore } from '../utils/helpers';

const Profile = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  
  const [statistics, setStatistics] = useState(null);
  const [profile, setProfile] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    try {
      const [stats, intel, achiev] = await Promise.all([
        getUserStatistics(user.id),
        analyzeIntelligence(user.id),
        getUserAchievements(user.id),
      ]);

      setStatistics(stats);
      setProfile(intel.profile);
      setAchievements(achiev);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
        <div className="text-4xl animate-pulse">⏳</div>
      </div>
    );
  }

  const avatar = AVATARS.find(a => a.id === user?.avatar);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-8 mb-6"
        >
          <div className="flex items-center gap-6">
            <div className="text-8xl">{avatar?.emoji}</div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                {user.username}
              </h1>
              <div className="flex gap-6">
                <div>
                  <p className="text-sm text-gray-600">Nivel</p>
                  <p className="text-2xl font-bold text-purple-600">{user.level}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Puntos Totales</p>
                  <p className="text-2xl font-bold text-pink-600">
                    {formatScore(user.total_score)}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-xl font-medium transition-all"
            >
              ← Volver
            </button>
          </div>
        </motion.div>

        {/* Intelligence Profile */}
        {profile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-6"
          >
            <h2 className="text-2xl font-bold mb-6">🧠 Tu Perfil de Inteligencias</h2>
            
            <div className="mb-6 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
              <p className="text-lg font-semibold text-purple-700 mb-2">
                {profile.strongest_name}
              </p>
              <p className="text-gray-700">{profile.profile_description}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(profile.scores).map(([type, score]) => {
                const intel = INTELLIGENCE_TYPES[type.toUpperCase()];
                if (!intel || score === 0) return null;
                
                const maxScore = Math.max(...Object.values(profile.scores));
                const percentage = (score / maxScore) * 100;

                return (
                  <div key={type} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{intel.emoji}</span>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800">{intel.name}</h3>
                        <p className="text-xs text-gray-600">{intel.description}</p>
                      </div>
                      <span className="font-bold text-lg" style={{ color: intel.color }}>
                        {score}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="h-3 rounded-full transition-all"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: intel.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h2 className="text-2xl font-bold mb-6">🏆 Tus Logros</h2>

          {achievements.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Aún no tienes logros. ¡Sigue jugando para desbloquearlos!
            </p>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-xl"
                >
                  <h3 className="font-bold text-lg mb-1">{achievement.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {achievement.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(achievement.earned_at).toLocaleDateString('es-PE')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
