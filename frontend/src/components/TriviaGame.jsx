import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TriviaGame = ({ questions, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleSelectAnswer = (index) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(index);
    setShowExplanation(true);
    
    const isCorrect = index === currentQuestion.correct_answer;
    const points = isCorrect ? 10 : 0;
    
    setScore(score + points);
    setAnswers([...answers, {
      question_index: currentQuestionIndex,
      selected_answer: index,
      is_correct: isCorrect,
      points,
    }]);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      onComplete(answers, score);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Pregunta {currentQuestionIndex + 1} de {questions.length}
          </span>
          <span className="text-sm font-bold text-purple-600">
            🌟 {score} puntos
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <motion.div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-6"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {currentQuestion.question}
          </h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === currentQuestion.correct_answer;
              const showResult = selectedAnswer !== null;

              let buttonClass = 'bg-white hover:bg-gray-50 border-2 border-gray-300';
              
              if (showResult) {
                if (isCorrect) {
                  buttonClass = 'bg-green-100 border-green-500';
                } else if (isSelected && !isCorrect) {
                  buttonClass = 'bg-red-100 border-red-500';
                }
              } else if (isSelected) {
                buttonClass = 'bg-purple-100 border-purple-500';
              }

              return (
                <motion.button
                  key={index}
                  whileHover={selectedAnswer === null ? { scale: 1.02 } : {}}
                  whileTap={selectedAnswer === null ? { scale: 0.98 } : {}}
                  onClick={() => handleSelectAnswer(index)}
                  disabled={selectedAnswer !== null}
                  className={`
                    w-full p-4 rounded-xl text-left font-medium
                    transition-all duration-300 ${buttonClass}
                    ${selectedAnswer !== null ? 'cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showResult && isCorrect && <span className="text-2xl">✅</span>}
                    {showResult && isSelected && !isCorrect && <span className="text-2xl">❌</span>}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 p-4 rounded-xl ${
                selectedAnswer === currentQuestion.correct_answer
                  ? 'bg-green-50 border-2 border-green-300'
                  : 'bg-blue-50 border-2 border-blue-300'
              }`}
            >
              <p className="font-semibold mb-2">
                {selectedAnswer === currentQuestion.correct_answer ? '¡Correcto! 🎉' : 'Explicación:'}
              </p>
              <p className="text-gray-700">{currentQuestion.explanation}</p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Next Button */}
      {showExplanation && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleNext}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
        >
          {isLastQuestion ? '🎊 Ver Resultados' : 'Siguiente Pregunta →'}
        </motion.button>
      )}
    </div>
  );
};

export default TriviaGame;
