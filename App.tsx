import React, { useState, useCallback } from 'react';
import { GameState, VocabularyItem } from './types';
import { fetchVocabularyList } from './services/wordService';
import { SpellingGame } from './components/SpellingGame';
import { Button } from './components/Button';
import { GraduationCap, AlertCircle, Play } from 'lucide-react';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.IDLE);
  const [words, setWords] = useState<VocabularyItem[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const startNewGame = useCallback(async () => {
    setGameState(GameState.LOADING);
    setErrorMsg(null);
    try {
      const fetchedWords = await fetchVocabularyList(10); // Fetch 10 random words
      setWords(fetchedWords);
      setGameState(GameState.PLAYING);
    } catch (error) {
      console.error(error);
      setErrorMsg("Kelimeler yüklenirken bir hata oluştu. Lütfen tekrar deneyin.");
      setGameState(GameState.ERROR);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
      
      {/* Header / Logo */}
      <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center">
        <div className="flex items-center gap-2 text-indigo-900">
           <div className="p-2 bg-indigo-600 rounded-lg text-white">
             <GraduationCap size={24} />
           </div>
           <span className="font-bold text-xl tracking-tight">Speller</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-2xl relative z-10">
        
        {/* IDLE STATE: Welcome Screen */}
        {gameState === GameState.IDLE && (
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center animate-pop">
             <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
               Kelime Pratiği
             </h1>
             <p className="text-lg text-slate-500 mb-8 max-w-md mx-auto">
               A1, A2, B1 ve B2 seviyelerinden karışık İngilizce kelimelerin yazılışını öğrenin.
             </p>
             <div className="flex justify-center">
                <Button onClick={startNewGame} className="text-lg px-8 py-4 shadow-xl shadow-indigo-200">
                  <Play className="w-5 h-5 fill-current" />
                  Başla
                </Button>
             </div>
          </div>
        )}

        {/* LOADING STATE */}
        {gameState === GameState.LOADING && (
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-xl font-semibold text-slate-700">Kelimeler Seçiliyor...</h2>
          </div>
        )}

        {/* PLAYING STATE */}
        {gameState === GameState.PLAYING && (
          <SpellingGame words={words} onRestart={startNewGame} />
        )}

        {/* ERROR STATE */}
        {gameState === GameState.ERROR && (
          <div className="bg-white rounded-3xl shadow-xl p-8 text-center border-l-4 border-red-500">
            <div className="inline-flex p-3 bg-red-100 text-red-500 rounded-full mb-4">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Hata Oluştu</h3>
            <p className="text-slate-500 mb-6">{errorMsg || "Bir şeyler ters gitti."}</p>
            <Button onClick={startNewGame} variant="outline">
              Tekrar Dene
            </Button>
          </div>
        )}
        
      </main>

      {/* Footer Removed as requested */}
    </div>
  );
};

export default App;