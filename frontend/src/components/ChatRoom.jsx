import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '../store/userStore';
import { getChatMessages, sendChatMessage, deleteChatMessage } from '../services/api';
import { AVATARS } from '../utils/constants';

const ChatRoom = () => {
  const user = useUserStore((state) => state.user);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    loadMessages();
    // Actualizar cada 5 segundos
    const interval = setInterval(loadMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      const data = await getChatMessages(50);
      setMessages(data);
    } catch (error) {
      console.error('Error cargando mensajes:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || newMessage.length > 500) return;
    
    setLoading(true);
    try {
      await sendChatMessage(user.id, user.username, user.avatar, newMessage);
      setNewMessage('');
      await loadMessages();
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      alert('Error al enviar el mensaje');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await deleteChatMessage(messageId, user.id);
      await loadMessages();
    } catch (error) {
      console.error('Error eliminando mensaje:', error);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-PE', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          💬 Chat General
        </h2>
        <p className="text-sm opacity-90">Conversa con otros jugadores</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-br from-purple-50 to-pink-50">
        <AnimatePresence>
          {messages.map((msg) => {
            const avatar = AVATARS.find(a => a.id === msg.avatar);
            const isOwnMessage = msg.user_id === user.id;

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md overflow-hidden">
                    <img 
                      src={avatar?.image || '/avatars/1.png'} 
                      alt={msg.username}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Message bubble */}
                <div className={`flex-1 max-w-md ${isOwnMessage ? 'text-right' : ''}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-gray-700">
                      {msg.username}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatTime(msg.created_at)}
                    </span>
                  </div>
                  
                  <div
                    className={`inline-block px-4 py-2 rounded-2xl ${
                      isOwnMessage
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : 'bg-white text-gray-800 shadow-md'
                    }`}
                  >
                    <p className="text-sm break-words">{msg.message}</p>
                  </div>

                  {/* Delete button (solo para mensajes propios) */}
                  {isOwnMessage && (
                    <button
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="text-xs text-red-500 hover:text-red-700 mt-1"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t-2 border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            maxLength={500}
            className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading || !newMessage.trim()}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '📤' : '💬'}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {newMessage.length}/500 caracteres
        </p>
      </form>
    </div>
  );
};

export default ChatRoom;