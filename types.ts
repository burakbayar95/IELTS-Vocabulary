export interface VocabularyItem {
  turkish: string;
  english: string;
  definition: string; // English definition (Cambridge style)
  level?: string;
  exampleSentence?: string;
}

export enum GameState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  PLAYING = 'PLAYING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface GameStats {
  correct: number;
  total: number;
  hintsUsed: number;
}