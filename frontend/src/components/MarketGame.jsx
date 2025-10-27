import React, { useState } from 'react';
import { motion } from 'framer-motion';

const MarketGame = ({ missions, onComplete }) => {
  const [currentMissionIndex, setCurrentMissionIndex] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const currentMission = missions[currentMissionIndex];
  const isLastMission = currentMissionIndex === missions.length - 1;

  const toggleItemSelection = (itemId) => {
    if (showFeedback) return;
    
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  const handleSubmit = () => {
    const correctItems = new Set(currentMission.correct_items);
    const selectedSet = new Set(selectedItems);
    
    // Calcular precisión
    const correctSelected = [...correctItems].filter(item => selectedSet.has(item)).length;
    const totalCorrect = correctItems.size;
    
    const points = totalCorrect > 0 
      ? Math.round((correctSelected / totalCorrect) * currentMission.points)
      : 0;
    
    const answer = {
      mission_id: currentMission.mission_id,
      selected_items: selectedItems,
      points,
    };
    
    setAnswers([...answers, answer]);
    setScore(score + points);
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (isLastMission) {
      onComplete(answers, score);
    } else {
      setCurrentMissionIndex(currentMissionIndex + 1);
      setSelectedItems([]);
      setShowFeedback(false);
      setShowHint(false);
    }
  };

  const isItemCorrect = (itemId) => {
    return currentMission.correct_items.includes(itemId);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            🛒 Misión {currentMissionIndex + 1} de {missions.length}
          </h2>
          <span className="text-2xl font-bold text-blue-600">
            💰 {score} puntos
          </span>
        </div>
        
        {/* Mission Card */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl shadow-xl p-6">
          <h3 className="text-2xl font-bold mb-2">{currentMission.title}</h3>
          <p className="text-lg opacity-90">{currentMission.description}</p>
          
          {!showFeedback && (
            <button
              onClick={() => setShowHint(!showHint)}
              className="mt-4 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-all"
            >
              {showHint ? '🙈 Ocultar pista' : '💡 Ver pista'}
            </button>
          )}
          
          {showHint && !showFeedback && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3 p-3 bg-white/20 rounded-lg"
            >
              <p className="text-sm">{currentMission.hint}</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Market Items */}
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {currentMission.items.map((item, index) => {
            const isSelected = selectedItems.includes(item.id);
            const showResult = showFeedback;
            const isCorrect = isItemCorrect(item.id);
            
            let cardClass = 'bg-white border-2 border-gray-300';
            if (showResult) {
              if (isCorrect && isSelected) {
                cardClass = 'bg-green-100 border-green-500';
              } else if (!isCorrect && isSelected) {
                cardClass = 'bg-red-100 border-red-500';
              } else if (isCorrect && !isSelected) {
                cardClass = 'bg-yellow-100 border-yellow-500';
              }
            } else if (isSelected) {
              cardClass = 'bg-blue-100 border-blue-500';
            }

            return (
              <motion.button
                key={item.id}
                whileHover={!showFeedback ? { scale: 1.05 } : {}}
                whileTap={!showFeedback ? { scale: 0.95 } : {}}
                onClick={() => toggleItemSelection(item.id)}
                disabled={showFeedback}
                className={`
                  p-4 rounded-xl transition-all shadow-md hover:shadow-lg
                  ${cardClass}
                  ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <div className="text-5xl mb-2">{item.image}</div>
                <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
                {item.price && (
                  <p className="text-xs text-gray-600 mt-1">S/ {item.price}</p>
                )}
                {item.category && (
                  <p className="text-xs text-gray-500 mt-1 capitalize">{item.category}</p>
                )}
                
                {/* Result Indicators */}
                {showResult && (
                  <div className="mt-2 text-2xl">
                    {isCorrect && isSelected && '✅'}
                    {!isCorrect && isSelected && '❌'}
                    {isCorrect && !isSelected && '⚠️'}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        {!showFeedback ? (
          <button
            onClick={handleSubmit}
            disabled={selectedItems.length === 0}
            className={`
              flex-1 py-4 rounded-xl font-bold text-white text-lg shadow-lg
              ${selectedItems.length > 0
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                : 'bg-gray-400 cursor-not-allowed'
              }
            `}
          >
            ✓ Confirmar Selección ({selectedItems.length} items)
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex-1 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold rounded-xl text-lg hover:from-green-700 hover:to-blue-700 shadow-lg"
          >
            {isLastMission ? '🎊 Ver Resultados' : 'Siguiente Misión →'}
          </button>
        )}
      </div>

      {/* Feedback */}
      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-6 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300 rounded-2xl"
        >
          <h4 className="font-bold text-xl mb-2">
            Ganaste {answers[answers.length - 1]?.points || 0} puntos! 🎉
          </h4>
          <p className="text-gray-700">
            Items correctos seleccionados: {
              selectedItems.filter(id => isItemCorrect(id)).length
            } de {currentMission.correct_items.length}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default MarketGame;
