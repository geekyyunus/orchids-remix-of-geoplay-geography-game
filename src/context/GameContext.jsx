"use client";

import { createContext, useContext, useReducer, useEffect, useRef } from "react";

const GameContext = createContext();

const initialState = {
  mode: null,
  difficulty: "medium",
  score: 0,
  lives: 3,
  streak: 0,
  bestStreak: 0,
  totalQuestions: 0,
  correctAnswers: 0,
  timeRemaining: 60,
  isPaused: false,
  isPlaying: false,
  isGameOver: false,
  currentQuestion: null,
  feedback: null,
  selectedCountry: null,
  selectedState: null,
  soundEnabled: true,
  leaderboard: [],
};

const difficultySettings = {
  easy: { lives: 5, time: 90, hintEnabled: true },
  medium: { lives: 3, time: 60, hintEnabled: false },
  hard: { lives: 2, time: 45, hintEnabled: false },
};

function gameReducer(state, action) {
  switch (action.type) {
    case "SET_MODE":
      return { ...state, mode: action.payload };
    
    case "SET_DIFFICULTY":
      const settings = difficultySettings[action.payload];
      return { 
        ...state, 
        difficulty: action.payload,
        lives: settings.lives,
        timeRemaining: settings.time,
      };
    
    case "START_GAME":
      const diffSettings = difficultySettings[state.difficulty];
      return {
        ...state,
        isPlaying: true,
        isGameOver: false,
        score: 0,
        lives: diffSettings.lives,
        streak: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        timeRemaining: diffSettings.time,
        feedback: null,
      };
    
    case "SET_QUESTION":
      return { ...state, currentQuestion: action.payload, feedback: null };
    
    case "CORRECT_ANSWER":
      const newStreak = state.streak + 1;
      const streakBonus = Math.floor(newStreak / 3) * 5;
      const baseScore = state.difficulty === "easy" ? 10 : state.difficulty === "medium" ? 15 : 25;
      return {
        ...state,
        score: state.score + baseScore + streakBonus,
        streak: newStreak,
        bestStreak: Math.max(state.bestStreak, newStreak),
        totalQuestions: state.totalQuestions + 1,
        correctAnswers: state.correctAnswers + 1,
        feedback: { type: "correct", message: "Correct!", bonus: streakBonus > 0 ? `+${streakBonus} streak bonus!` : null },
      };
    
    case "WRONG_ANSWER":
      const newLives = state.lives - 1;
      return {
        ...state,
        lives: newLives,
        streak: 0,
        totalQuestions: state.totalQuestions + 1,
        feedback: { type: "wrong", message: `Wrong! It was ${action.payload}` },
        isGameOver: newLives <= 0,
      };
    
    case "TICK_TIMER":
      if (state.timeRemaining <= 1) {
        return { ...state, timeRemaining: 0, isGameOver: true };
      }
      return { ...state, timeRemaining: state.timeRemaining - 1 };
    
    case "TOGGLE_PAUSE":
      return { ...state, isPaused: !state.isPaused };
    
    case "END_GAME":
      return { ...state, isPlaying: false, isGameOver: true };
    
    case "RESET_GAME":
      return { ...initialState, soundEnabled: state.soundEnabled, leaderboard: state.leaderboard, difficulty: state.difficulty };
    
    case "SET_SELECTED_COUNTRY":
      return { ...state, selectedCountry: action.payload, selectedState: null };
    
    case "SET_SELECTED_STATE":
      return { ...state, selectedState: action.payload };
    
    case "TOGGLE_SOUND":
      return { ...state, soundEnabled: !state.soundEnabled };
    
    case "ADD_TO_LEADERBOARD":
      const newEntry = {
        id: Date.now(),
        score: state.score,
        mode: state.mode,
        difficulty: state.difficulty,
        accuracy: state.totalQuestions > 0 ? Math.round((state.correctAnswers / state.totalQuestions) * 100) : 0,
        date: new Date().toISOString(),
      };
      const updatedLeaderboard = [...state.leaderboard, newEntry]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
      return { ...state, leaderboard: updatedLeaderboard };
    
    case "LOAD_LEADERBOARD":
      return { ...state, leaderboard: action.payload };
    
    case "CLEAR_FEEDBACK":
      return { ...state, feedback: null };
    
    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("geoplay-leaderboard");
    if (saved) {
      dispatch({ type: "LOAD_LEADERBOARD", payload: JSON.parse(saved) });
    }
  }, []);

  useEffect(() => {
    if (state.leaderboard.length > 0) {
      localStorage.setItem("geoplay-leaderboard", JSON.stringify(state.leaderboard));
    }
  }, [state.leaderboard]);

  const playSound = (type) => {
    if (!state.soundEnabled) return;
    
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    if (type === "correct") {
      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2);
    } else {
      oscillator.frequency.setValueAtTime(311.13, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(233.08, audioContext.currentTime + 0.15);
    }
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  return (
    <GameContext.Provider value={{ state, dispatch, playSound }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
