import React from 'react';

interface ResultsProps {
  score: number;
  totalQuestions: number;
  time: number;
  onRestart: () => void;
}

const Results: React.FC<ResultsProps> = ({ score, totalQuestions, time, onRestart }) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  
  const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getFeedback = () => {
      if (percentage >= 90) return { message: "¡Excelente Trabajo!", color: "text-green-400" };
      if (percentage >= 70) return { message: "¡Gran Trabajo!", color: "text-cyan-400" };
      if (percentage >= 50) return { message: "¡Buen Esfuerzo!", color: "text-yellow-400" };
      return { message: "¡Sigue Practicando!", color: "text-red-400" };
  }

  const feedback = getFeedback();

  return (
    <div className="w-full text-center animate-fade-in">
      <h2 className="text-4xl font-bold mb-4 text-slate-100">¡Cuestionario Completo!</h2>
      <p className={`text-2xl font-semibold mb-8 ${feedback.color}`}>{feedback.message}</p>
      <div className="flex justify-center items-center gap-8 md:gap-16 mb-10">
        <div className="flex flex-col">
            <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">{score}/{totalQuestions}</span>
            <span className="text-slate-400">Puntuación</span>
        </div>
         <div className="flex flex-col">
            <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">{percentage}%</span>
            <span className="text-slate-400">Precisión</span>
        </div>
        <div className="flex flex-col">
            <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">{formatTime(time)}</span>
            <span className="text-slate-400">Tiempo Total</span>
        </div>
      </div>
      <button
        onClick={onRestart}
        className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold py-3 px-8 rounded-lg transition-transform duration-200 hover:scale-105 shadow-lg text-lg"
      >
        Crear Nuevo Cuestionario
      </button>
    </div>
  );
};

export default Results;