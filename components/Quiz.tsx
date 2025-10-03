import React, { useState, useEffect, useCallback } from 'react';
import { Question } from '../types';
import { useTimer } from '../hooks/useTimer';
import { CheckIcon } from './icons/CheckIcon';
import { XIcon } from './icons/XIcon';
import { TimerIcon } from './icons/TimerIcon';

interface QuizProps {
  questions: Question[];
  onQuizComplete: (score: number, time: number) => void;
  onRestart: () => void;
}

const Quiz: React.FC<QuizProps> = ({ questions, onQuizComplete, onRestart }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const { time, startTimer, stopTimer, formattedTime } = useTimer();

  useEffect(() => {
    startTimer();
    return () => stopTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAnswerClick = (answer: string) => {
    if (isAnswered) return;
    setSelectedAnswer(answer);
  };

  const handleConfirmAnswer = useCallback(() => {
    if (!selectedAnswer) return;

    setIsAnswered(true);
    if (selectedAnswer === questions[currentQuestionIndex].correctAnswer) {
      setScore(prevScore => prevScore + 1);
    }
  }, [selectedAnswer, questions, currentQuestionIndex]);

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      stopTimer();
      onQuizComplete(score, time);
    }
  };
  
  const handleStopQuiz = () => {
      if (window.confirm("¿Estás seguro de que quieres detener el cuestionario? Tu progreso se perderá.")) {
          stopTimer();
          onRestart();
      }
  };

  const getButtonClass = (option: string) => {
    const isSelected = option === selectedAnswer;

    // After answer is confirmed, show correct/incorrect
    if (isAnswered) {
      const isCorrect = option === questions[currentQuestionIndex].correctAnswer;
      if (isCorrect) return "bg-green-600 ring-2 ring-green-400";
      if (isSelected && !isCorrect) return "bg-red-600 ring-2 ring-red-400";
      return "bg-slate-700 opacity-60";
    }
    
    // Before confirming, show selection in blue
    if (isSelected) {
      return "bg-blue-600 ring-2 ring-blue-400";
    }

    // Default state
    return "bg-slate-700 hover:bg-slate-600";
  };
  
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="w-full animate-fade-in">
        <div className="flex justify-between items-center mb-4 text-slate-300 gap-4">
            <span className="text-lg font-semibold shrink-0">Pregunta {currentQuestionIndex + 1} de {questions.length}</span>
            <button onClick={handleStopQuiz} className="border border-red-500 text-red-400 px-3 py-1 rounded-lg hover:bg-red-500/20 transition-colors text-sm font-semibold">
              Detener Test
            </button>
            <div className="flex items-center gap-2 bg-slate-700 px-3 py-1 rounded-full ml-auto">
                <TimerIcon className="w-5 h-5" />
                <span className="font-mono text-lg">{formattedTime}</span>
            </div>
        </div>
        <div className="bg-slate-900/50 p-6 rounded-lg mb-6">
            <h2 className="text-xl md:text-2xl font-semibold leading-tight">{currentQuestion.question}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion.options.map((option, index) => (
                <button
                    key={index}
                    onClick={() => handleAnswerClick(option)}
                    disabled={isAnswered}
                    className={`p-4 rounded-lg text-left text-lg transition-all duration-200 w-full ${getButtonClass(option)}`}
                >
                    {option}
                </button>
            ))}
        </div>
        {isAnswered && (
            <div className="mt-6 p-4 rounded-lg bg-slate-700/50 animate-fade-in">
                <div className="flex items-start gap-3">
                    {selectedAnswer === currentQuestion.correctAnswer ? (
                        <CheckIcon className="w-8 h-8 text-green-400 flex-shrink-0 mt-1" />
                    ) : (
                        <XIcon className="w-8 h-8 text-red-400 flex-shrink-0 mt-1" />
                    )}
                    <div>
                        <h3 className="font-bold text-lg text-slate-100">Explicación</h3>
                        <p className="text-slate-300">{currentQuestion.explanation}</p>
                    </div>
                </div>
            </div>
        )}
        <div className="mt-8 text-center min-h-[56px]">
            {!isAnswered && selectedAnswer && (
                <button
                    onClick={handleConfirmAnswer}
                    className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-10 rounded-lg transition-transform duration-200 hover:scale-105 shadow-lg text-lg animate-fade-in"
                >
                    Confirmar
                </button>
            )}
            {isAnswered && (
                <button
                    onClick={handleNext}
                    className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold py-3 px-10 rounded-lg transition-transform duration-200 hover:scale-105 shadow-lg text-lg animate-fade-in"
                >
                    {currentQuestionIndex < questions.length - 1 ? "Siguiente Pregunta" : "Finalizar Cuestionario"}
                </button>
            )}
        </div>
    </div>
  );
};

export default Quiz;