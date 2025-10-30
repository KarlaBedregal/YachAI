import React, { useState } from 'react';
import { AVATARS } from '../utils/constants';
import { motion } from 'framer-motion';

const AvatarSelector = ({ selectedAvatar, onSelectAvatar }) => {
  return (
    <div className="avatar-selector">
      <h3 className="text-xl font-bold text-center mb-4 text-gray-800">
        Elige tu avatar
      </h3>
      
      <div className="grid grid-cols-5 gap-4">
        {AVATARS.map((avatar) => (
          <motion.button
            key={avatar.id}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectAvatar(avatar.id)}
            className={`
              p-4 rounded-xl text-5xl transition-all
              ${selectedAvatar === avatar.id
                ? 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg ring-4 ring-purple-300'
                : 'bg-white hover:bg-gray-50 shadow-md'
              }
            `}
          >
            <img 
              src={avatar.image} 
              alt={avatar.name}
              className="w-full h-full object-contain"
            />
          </motion.button>
        ))}
      </div>
      
      {selectedAvatar && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-4 text-gray-700 font-semibold"
        >
          Has elegido: {AVATARS.find(a => a.id === selectedAvatar)?.name}
        </motion.p>
      )}
    </div>
  );
};

export default AvatarSelector;
