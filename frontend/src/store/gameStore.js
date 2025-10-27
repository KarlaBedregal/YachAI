import { create } from 'zustand';

export const useGameStore = create((set) => ({
  currentSession: null,
  currentTopic: '',
  currentGameType: null,
  currentAnswers: [],
  isPlaying: false,
  
  setCurrentSession: (session) => set({ currentSession: session, isPlaying: true }),
  
  setCurrentTopic: (topic) => set({ currentTopic: topic }),
  
  setCurrentGameType: (gameType) => set({ currentGameType: gameType }),
  
  addAnswer: (answer) => set((state) => ({
    currentAnswers: [...state.currentAnswers, answer],
  })),
  
  resetAnswers: () => set({ currentAnswers: [] }),
  
  endGame: () => set({
    currentSession: null,
    isPlaying: false,
    currentAnswers: [],
  }),
  
  resetGame: () => set({
    currentSession: null,
    currentTopic: '',
    currentGameType: null,
    currentAnswers: [],
    isPlaying: false,
  }),
}));
