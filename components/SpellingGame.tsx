import React, { useState, useEffect, useRef } from 'react';
import { VocabularyItem, GameStats } from '../types';
import { Button } from './Button';
import { Check, HelpCircle, RefreshCw, ArrowRight, BookOpen, Languages, Eye } from 'lucide-react';

interface SpellingGameProps {
  words: VocabularyItem[];
  onRestart: () => void;
}

type ViewMode = 'TR' | 'DEF' | 'BOTH';

export const SpellingGame: React.FC<SpellingGameProps> = ({ words, onRestart }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [hintLevel, setHintLevel] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [stats, setStats] = useState<GameStats>({ correct: 0, total: 0, hintsUsed: 0 });
  const [completed, setCompleted] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('TR');
  
  const inputRef = useRef<HTMLInputElement>(null);
  const currentWord = words[currentIndex];

  // Calculate length details
  const targetLength = currentWord.english.length;
  const currentLength = userInput.length;
  const remainingChars = targetLength - currentLength;
  const isOverflow = remainingChars < 0;

  useEffect(() => {
    // Focus input on word change
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIndex]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
    if (isCorrect === false) setIsCorrect(null); // Reset error state on typing
  };

  const checkAnswer = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!userInput.trim()) return;

    const target = currentWord.english.toLowerCase();
    const input = userInput.toLowerCase().trim();

    if (input === target) {
      setIsCorrect(true);
      const newStats = { ...stats, correct: stats.correct + 1, total: stats.total + 1 };
      setStats(newStats);
      
      // Delay before next word to show success
      setTimeout(() => {
        handleNextWord();
      }, 1500);
    } else {
      setIsCorrect(false);
    }
  };

  const handleNextWord = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setUserInput('');
      setHintLevel(0);
      setIsCorrect(null);
    } else {
      setCompleted(true);
    }
  };

  const revealHint = () => {
    const target = currentWord.english;
    // Don't reveal the whole word immediately, reveal one char at a time
    if (hintLevel < target.length) {
      const nextLevel = hintLevel + 1;
      setHintLevel(nextLevel);
      setStats(prev => ({ ...prev, hintsUsed: prev.hintsUsed + 1 }));
      
      // Auto-fill the input with the hint so far to guide them
      const hintString = target.substring(0, nextLevel);
      setUserInput(hintString);
      inputRef.current?.focus();
    }
  };

  if (completed) {
    return (
      <div className="w-full max-w-md mx-auto bg-white rounded-3xl shadow-xl p-8 text-center animate-pop">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <BookOpen className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Harika! 🎉</h2>
        <p className="text-slate-500 mb-8">Bu alıştırmayı tamamladın.</p>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-50 p-4 rounded-2xl">
            <div className="text-2xl font-bold text-indigo-600">{stats.correct}/{words.length}</div>
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Doğru</div>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl">
            <div className="text-2xl font-bold text-amber-500">{stats.hintsUsed}</div>
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wide">İpucu</div>
          </div>
        </div>

        <Button onClick={onRestart} className="w-full">
          <RefreshCw className="w-5 h-5" />
          Yeni Kelimeler
        </Button>
      </div>
    );
  }

  // Determine Input Styles based on state
  let inputBorderColor = 'border-slate-200';
  let inputTextColor = 'text-slate-800';
  let inputBgColor = 'bg-white';
  
  if (isCorrect === true) {
    inputBorderColor = 'border-green-500';
    inputTextColor = 'text-green-600';
    inputBgColor = 'bg-green-50';
  } else if (isCorrect === false) {
    inputBorderColor = 'border-red-300';
    inputTextColor = 'text-red-500';
    inputBgColor = 'bg-red-50';
  } else if (isOverflow) {
    inputBorderColor = 'border-red-400';
    inputTextColor = 'text-red-600';
    inputBgColor = 'bg-red-50';
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Progress Bar */}
      <div className="mb-6 flex items-center justify-between text-sm text-slate-400 font-medium">
        <span>Kelime {currentIndex + 1} / {words.length}</span>
        <span>Skor: {stats.correct}</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2 mb-8 overflow-hidden">
        <div 
          className="bg-indigo-500 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${((currentIndex) / words.length) * 100}%` }}
        ></div>
      </div>

      {/* Card */}
      <div className="bg-white rounded-3xl shadow-xl p-8 relative overflow-hidden transition-all">
        {/* Status Indicator Stripe */}
        <div className={`absolute top-0 left-0 w-full h-2 ${
          isCorrect === true ? 'bg-green-500' : isCorrect === false ? 'bg-red-500' : 'bg-transparent'
        }`} />

        {/* View Mode Controls */}
        <div className="flex justify-center gap-2 mb-6">
          <button 
            onClick={() => setViewMode('TR')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              viewMode === 'TR' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            <Languages size={14} /> Türkçe
          </button>
          <button 
            onClick={() => setViewMode('DEF')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              viewMode === 'DEF' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            <BookOpen size={14} /> Açıklama
          </button>
           <button 
            onClick={() => setViewMode('BOTH')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              viewMode === 'BOTH' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            <Eye size={14} /> Hepsi
          </button>
        </div>

        <div className="text-center mb-8 min-h-[120px] flex flex-col items-center justify-center">
          {/* Badge */}
          <span className={`inline-block px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold tracking-wider mb-2 ${viewMode === 'DEF' ? 'opacity-0' : 'opacity-100'}`}>
            TÜRKÇE
          </span>
          
          {/* Main Turkish Word */}
          {viewMode !== 'DEF' && (
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-2 transition-all">
              {currentWord.turkish}
            </h1>
          )}

          {/* Divider if Both */}
          {viewMode === 'BOTH' && (
             <div className="w-12 h-1 bg-slate-100 rounded-full my-3"></div>
          )}

          {/* Definition */}
          {viewMode !== 'TR' && (
            <div className={`text-slate-500 italic px-2 ${viewMode === 'BOTH' ? 'text-sm' : 'text-xl font-medium text-slate-600'}`}>
              "{currentWord.definition}"
            </div>
          )}

           {/* Helper text for input */}
          <p className="text-slate-400 text-xs mt-3 uppercase tracking-widest font-semibold">İngilizcesini Yazın</p>
        </div>

        <form onSubmit={checkAnswer} className="space-y-2">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={handleInputChange}
              className={`w-full text-center text-2xl font-bold p-4 border-2 rounded-2xl outline-none transition-all placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-50 ${inputBorderColor} ${inputTextColor} ${inputBgColor} ${isCorrect === false ? 'animate-shake' : ''}`}
              placeholder="......"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              disabled={isCorrect === true}
            />
            {isCorrect === true && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 animate-pop">
                <Check className="w-6 h-6" />
              </div>
            )}
          </div>

          {/* Character Count Indicator */}
          <div className={`flex justify-end text-xs font-semibold tracking-wide h-5 transition-colors ${isOverflow ? 'text-red-500' : 'text-slate-400'}`}>
            {isCorrect !== true && (
               <span>
                 {remainingChars >= 0 ? `${remainingChars} harf` : `Fazla karakter!`}
               </span>
            )}
          </div>

          {/* Visual Hint Dots */}
          <div className="h-4 flex justify-center gap-1 mb-4">
             {currentWord.english.split('').map((char, idx) => (
                <div 
                  key={idx} 
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    idx < hintLevel ? 'bg-indigo-400' : 'bg-slate-200'
                  }`}
                />
             ))}
          </div>

          <div className="grid grid-cols-4 gap-3">
            <button
              type="button"
              onClick={revealHint}
              disabled={isCorrect === true || hintLevel >= currentWord.english.length}
              className="col-span-1 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-xl flex items-center justify-center p-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group relative"
              title="İpucu (Hint)"
            >
              <HelpCircle className="w-6 h-6 group-active:scale-90 transition-transform" />
            </button>
            
            <Button 
              type="submit" 
              variant={isCorrect === true ? "secondary" : "primary"}
              className="col-span-3 text-lg"
              disabled={isCorrect === true}
            >
              {isCorrect === true ? (
                <span className="flex items-center gap-2">Doğru! <Check className="w-5 h-5" /></span>
              ) : (
                "Kontrol Et"
              )}
            </Button>
          </div>
        </form>

        {isCorrect === false && (
          <div className="mt-4 text-center text-red-500 text-sm font-medium animate-pop">
            Tekrar dene veya ipucu kullan!
          </div>
        )}
      </div>
      
      {/* Skip/Next Controls */}
      <div className="mt-8 text-center">
         <button 
          onClick={handleNextWord} 
          className="text-slate-400 hover:text-indigo-600 text-sm font-medium flex items-center justify-center gap-2 mx-auto transition-colors"
        >
          Sonraki Kelime <ArrowRight className="w-4 h-4" />
         </button>
      </div>
    </div>
  );
};