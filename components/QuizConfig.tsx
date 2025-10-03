import React, { useState } from 'react';
import { QuizConfig as QuizConfigType } from '../types';

interface QuizConfigProps {
  onSubmit: (config: QuizConfigType) => void;
  onBack: () => void;
  error: string | null;
}

const questionOptions = [10, 20, 30, 40];
const difficultyOptions = ["Fácil", "Medio", "Difícil"];

const QuizConfig: React.FC<QuizConfigProps> = ({ onSubmit, onBack, error }) => {
  const [numQuestions, setNumQuestions] = useState<number>(10);
  const [difficulty, setDifficulty] = useState<string>("Medio");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ numQuestions, difficulty });
  };

  return (
    <div className="w-full max-w-md text-center animate-fade-in">
        <h2 className="text-3xl font-bold mb-6 text-slate-100">Configura tu Cuestionario</h2>
        <form onSubmit={handleSubmit}>
            <div className="mb-6">
                <label className="block text-lg font-medium text-slate-300 mb-3">Número de Preguntas</label>
                <div className="flex justify-center gap-2">
                    {questionOptions.map(num => (
                        <button key={num} type="button" onClick={() => setNumQuestions(num)} className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${numQuestions === num ? 'bg-cyan-500 text-white shadow-lg' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'}`}>
                            {num}
                        </button>
                    ))}
                </div>
            </div>
            <div className="mb-8">
                <label className="block text-lg font-medium text-slate-300 mb-3">Dificultad</label>
                <div className="flex justify-center gap-2">
                    {difficultyOptions.map(level => (
                        <button key={level} type="button" onClick={() => setDifficulty(level)} className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${difficulty === level ? 'bg-purple-500 text-white shadow-lg' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'}`}>
                            {level}
                        </button>
                    ))}
                </div>
            </div>
             {error && <p className="mb-4 text-red-400">{error}</p>}
            <div className="flex gap-4 justify-center">
                 <button type="button" onClick={onBack} className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-3 px-6 rounded-lg transition-transform duration-200 hover:scale-105">
                    Volver
                </button>
                <button type="submit" className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold py-3 px-6 rounded-lg transition-transform duration-200 hover:scale-105 shadow-lg">
                    Generar Cuestionario
                </button>
            </div>
        </form>
    </div>
  );
};

export default QuizConfig;