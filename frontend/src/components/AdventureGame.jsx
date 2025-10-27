import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AdventureGame = ({ story, onComplete }) => {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [storyText, setStoryText] = useState([story.introduction]);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentScene = story.scenes[currentSceneIndex];
  const isLastScene = currentSceneIndex === story.scenes.length - 1;

  const handleChoice = (choiceIndex) => {
    const choice = currentScene.choices[choiceIndex];
    const points = choice.points || 0;
    
    // Agregar feedback a la historia
    setStoryText([...storyText, choice.feedback || choice.text]);
    
    // Guardar respuesta
    const answer = {
      scene_number: currentScene.scene_number,
      choice_index: choiceIndex,
      is_correct: choice.is_correct,
      points,
    };
    
    const newAnswers = [...answers, answer];
    const newScore = score + points;
    
    setAnswers(newAnswers);
    setScore(newScore);

    // Avanzar o finalizar
    if (isLastScene) {
      setStoryText([...storyText, choice.feedback, story.conclusion]);
      setIsFinished(true);
    } else {
      const nextSceneIndex = currentSceneIndex + 1;
      setCurrentSceneIndex(nextSceneIndex);
      setTimeout(() => {
        setStoryText([...storyText, choice.feedback, story.scenes[nextSceneIndex].description]);
      }, 500);
    }
  };

  const handleFinish = () => {
    onComplete(answers, score);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
          {story.title}
        </h1>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600">
            Escena {currentScene.scene_number} de {story.scenes.length}
          </span>
          <span className="text-lg font-bold text-green-600">
            ⭐ {score} puntos
          </span>
        </div>
      </div>

      {/* Story Display */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-xl p-8 mb-6 min-h-[300px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSceneIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Scene Description */}
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-800 leading-relaxed text-lg whitespace-pre-wrap">
                {currentScene.description}
              </p>
            </div>

            {/* Learning Point */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-4 p-4 bg-blue-100 border-l-4 border-blue-500 rounded-r-xl"
            >
              <p className="text-sm font-semibold text-blue-800">
                💡 {currentScene.learning_point}
              </p>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Choices */}
      {!isFinished ? (
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            ¿Qué decides hacer?
          </h3>
          {currentScene.choices.map((choice, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleChoice(index)}
              className="w-full p-5 bg-white hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 border-2 border-gray-300 hover:border-green-400 rounded-xl text-left font-medium transition-all shadow-md hover:shadow-lg"
            >
              <div className="flex items-start">
                <span className="text-2xl mr-3">{String.fromCharCode(65 + index)}.</span>
                <span className="text-gray-800">{choice.text}</span>
              </div>
            </motion.button>
          ))}
        </div>
      ) : (
        /* Finish Button */
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="mb-6 p-6 bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              ¡Aventura Completada! 🎉
            </h2>
            <p className="text-lg text-gray-700">
              Has obtenido <span className="font-bold text-green-600">{score} puntos</span>
            </p>
          </div>
          <button
            onClick={handleFinish}
            className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-blue-700 transition-all shadow-lg text-lg"
          >
            Ver Resultados Finales →
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default AdventureGame;
