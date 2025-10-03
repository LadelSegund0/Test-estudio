import React, { useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
// Importa la URL del worker para que Vite lo gestione
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.js?url';

import FileUpload from './components/FileUpload';
import QuizConfig from './components/QuizConfig';
import Quiz from './components/Quiz';
import Results from './components/Results';
import Loader from './components/Loader';
import { generateQuiz } from './services/geminiService';
import { AppState, QuizConfig as QuizConfigType, Question } from './types';

// Configura el worker de PDF.js usando la URL importada
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default function App() {
  const [appState, setAppState] = useState<AppState>(AppState.FILE_UPLOAD);
  const [pdfText, setPdfText] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizConfig, setQuizConfig] = useState<QuizConfigType | null>(null);
  const [finalScore, setFinalScore] = useState<{ score: number; time: number } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    setIsLoading(true);
    setLoadingMessage('Extrayendo texto de los PDF(s)...');
    setError(null);

    try {
      let fullText = '';
      for (const file of Array.from(files)) {
        const arrayBuffer = await file.arrayBuffer();
        const typedArray = new Uint8Array(arrayBuffer);
        const pdf = await pdfjsLib.getDocument(typedArray).promise;
        const numPages = pdf.numPages;
        for (let i = 1; i <= numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          fullText += textContent.items.map(item => 'str' in item ? item.str : '').join(' ') + '\n';
        }
      }
      setPdfText(fullText);
      setAppState(AppState.QUIZ_CONFIG);
    } catch (e) {
      console.error("Error processing PDF:", e);
      setError("Error al procesar los archivos PDF. Por favor, asegúrate de que son PDFs válidos e inténtalo de nuevo.");
      setAppState(AppState.FILE_UPLOAD);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleConfigSubmit = useCallback(async (config: QuizConfigType) => {
    setQuizConfig(config);
    setIsLoading(true);
    setLoadingMessage('Generando tu cuestionario con Gemini... Esto puede tardar un momento.');
    setError(null);

    try {
      const generatedQuestions = await generateQuiz(pdfText, config.numQuestions, config.difficulty);
      if (generatedQuestions.length === 0) {
        throw new Error("Gemini no devolvió preguntas. El contenido del PDF puede ser demasiado corto o complejo.");
      }
      setQuestions(generatedQuestions);
      setAppState(AppState.TAKING_QUIZ);
    } catch (e) {
      console.error("Error generating quiz:", e);
      const errorMessage = e instanceof Error ? e.message : "Ocurrió un error desconocido.";
      setError(`Error al generar el cuestionario. ${errorMessage}`);
      setAppState(AppState.QUIZ_CONFIG);
    } finally {
      setIsLoading(false);
    }
  }, [pdfText]);

  const handleQuizComplete = useCallback((score: number, time: number) => {
    setFinalScore({ score, time });
    setAppState(AppState.RESULTS);
  }, []);
  
  const handleRestart = useCallback(() => {
    setAppState(AppState.FILE_UPLOAD);
    setPdfText('');
    setQuestions([]);
    setQuizConfig(null);
    setFinalScore(null);
    setError(null);
  }, []);

  const handleBackToUpload = useCallback(() => {
    setAppState(AppState.FILE_UPLOAD);
    setPdfText('');
    setQuizConfig(null);
    setError(null);
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return <Loader message={loadingMessage} />;
    }

    switch(appState) {
      case AppState.FILE_UPLOAD:
        return <FileUpload onFileChange={handleFileChange} error={error} />;
      case AppState.QUIZ_CONFIG:
        return <QuizConfig onSubmit={handleConfigSubmit} onBack={handleBackToUpload} error={error} />;
      case AppState.TAKING_QUIZ:
        return <Quiz questions={questions} onQuizComplete={handleQuizComplete} onRestart={handleRestart} />;
      case AppState.RESULTS:
        if (finalScore && quizConfig) {
          return <Results score={finalScore.score} totalQuestions={quizConfig.numQuestions} time={finalScore.time} onRestart={handleRestart} />;
        }
        return null; // Should not happen
      default:
        return <FileUpload onFileChange={handleFileChange} error={error} />;
    }
  };

  return (
    <div className="bg-slate-900 text-white min-h-screen flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-3xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
            Ladel's test
          </h1>
          <p className="text-slate-300 mt-2 text-lg">Empower your Mind</p>
          <p className="text-slate-400 mt-1">Powered by Google Gemini</p>
        </header>
        <main className="bg-slate-800 rounded-2xl shadow-2xl p-6 md:p-10 border border-slate-700 min-h-[400px] flex items-center justify-center animate-fade-in">
          {renderContent()}
        </main>
        <footer className="text-center mt-8 text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Ladel's test. Todos los derechos reservados.</p>
        </footer>
      </div>
    </div>
  );
}
