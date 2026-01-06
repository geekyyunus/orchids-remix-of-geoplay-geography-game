
"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, RotateCcw, Pause, Play, HelpCircle } from "lucide-react";
import { useGame } from "../../../context/GameContext";
import GameHUD from "../../../components/game/GameHUD";
import GameOver from "../../../components/game/GameOver";
import CountryMap from "../../../components/game/CountryMap";
import StateMap from "../../../components/game/StateMap";
import CityMap from "../../../components/game/CityMap";
import { MAP_URLS, COUNTRIES_WITH_STATES, CITIES_DATA } from "../../../lib/geoData";

export default function PlayPage() {
  const { mode } = useParams();
  const router = useRouter();
  const { state, dispatch, playSound } = useGame();
  const [target, setTarget] = useState(null);
  const [availableTargets, setAvailableTargets] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [showHint, setShowHint] = useState(false);

  // Initialize game on mount
  useEffect(() => {
    dispatch({ type: "SET_MODE", payload: mode });
    dispatch({ type: "START_GAME" });
  }, [mode, dispatch]);

  // Handle game over logic
  useEffect(() => {
    if (state.isGameOver && state.isPlaying) {
      dispatch({ type: "ADD_TO_LEADERBOARD" });
    }
  }, [state.isGameOver, state.isPlaying, dispatch]);

  // Timer logic
  useEffect(() => {
    let timer;
    if (state.isPlaying && !state.isPaused && !state.isGameOver) {
      timer = setInterval(() => {
        dispatch({ type: "TICK_TIMER" });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [state.isPlaying, state.isPaused, state.isGameOver, dispatch]);

  // Next question logic
  const nextQuestion = (currentAvailable) => {
    const pool = currentAvailable || availableTargets;
    if (pool.length === 0) {
      dispatch({ type: "END_GAME" });
      return;
    }
    const randomIndex = Math.floor(Math.random() * pool.length);
    const newTarget = pool[randomIndex];
    setTarget(newTarget);
    dispatch({ type: "SET_QUESTION", payload: newTarget.name });
    setAvailableTargets(pool.filter((_, i) => i !== randomIndex));
    setShowHint(false);
  };

  const handleCorrect = () => {
    playSound("correct");
    dispatch({ type: "CORRECT_ANSWER" });
    setTimeout(() => {
      dispatch({ type: "CLEAR_FEEDBACK" });
      nextQuestion();
    }, 1000);
  };

  const handleWrong = (clickedName) => {
    playSound("wrong");
    dispatch({ type: "WRONG_ANSWER", payload: target.name });
    setTimeout(() => {
      dispatch({ type: "CLEAR_FEEDBACK" });
      if (state.lives > 1) {
        nextQuestion();
      }
    }, 1500);
  };

  const handleMapClick = (geo) => {
    if (state.isPaused || state.isGameOver || state.feedback) return;

    const clickedName = geo.properties.name || geo.properties.NAME || geo.properties.ST_NM;
    
    if (clickedName === target.name) {
      handleCorrect();
    } else {
      handleWrong(clickedName);
    }
  };

  const handleCityClick = (city) => {
    if (state.isPaused || state.isGameOver || state.feedback) return;

    if (city.name === target.name) {
      handleCorrect();
    } else {
      handleWrong(city.name);
    }
  };

  const startMode = (data) => {
    setAvailableTargets(data);
    nextQuestion(data);
  };

  if (state.isGameOver) {
    return <GameOver />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
      <header className="p-4 flex items-center justify-between border-b border-border bg-card z-20">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/")}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="font-bold text-lg capitalize">{mode} Mode</h1>
            {target && (
              <p className="text-sm text-muted-foreground">
                Find: <span className="text-primary font-bold">{target.name}</span>
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {state.difficulty === "easy" && (
            <button
              onClick={() => setShowHint(true)}
              className="p-2 rounded-lg bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 transition-colors"
              title="Show hint"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={() => dispatch({ type: "TOGGLE_PAUSE" })}
            className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
          >
            {state.isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
          </button>
          <button
            onClick={() => dispatch({ type: "START_GAME" })}
            className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </header>

      <GameHUD />

      <main className="flex-1 relative flex items-center justify-center p-4">
        {state.isPaused && (
          <div className="absolute inset-0 z-10 bg-background/60 backdrop-blur-sm flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <h2 className="text-3xl font-bold mb-4">Game Paused</h2>
              <button
                onClick={() => dispatch({ type: "TOGGLE_PAUSE" })}
                className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-bold shadow-lg"
              >
                Resume
              </button>
            </motion.div>
          </div>
        )}

        <AnimatePresence>
          {state.feedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`absolute top-8 z-30 px-6 py-3 rounded-full font-bold text-white shadow-xl ${
                state.feedback.type === "correct" ? "bg-emerald-500" : "bg-rose-500"
              }`}
            >
              {state.feedback.message}
              {state.feedback.bonus && (
                <span className="block text-xs font-normal text-white/90">{state.feedback.bonus}</span>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="w-full h-full max-w-5xl max-h-[70vh]">
          {mode === "country" && (
            <CountryMap 
              onMapReady={startMode} 
              onCountryClick={handleMapClick}
              target={target}
              showHint={showHint}
            />
          )}
          {mode === "state" && (
            <StateMap 
              onMapReady={startMode} 
              onStateClick={handleMapClick}
              target={target}
              showHint={showHint}
            />
          )}
          {mode === "city" && (
            <CityMap 
              onMapReady={startMode} 
              onCityClick={handleCityClick}
              target={target}
              showHint={showHint}
            />
          )}
        </div>
      </main>

      {/* Mode selection for State/City if needed */}
      {!target && !state.isGameOver && mode !== 'country' && (
        <div className="absolute inset-0 bg-background z-40 flex flex-col items-center justify-center p-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full space-y-8"
          >
            <div>
              <h2 className="text-3xl font-bold mb-2">Select a Region</h2>
              <p className="text-muted-foreground">Choose a country to start the {mode} quiz</p>
            </div>
            <div className="grid grid-cols-1 gap-4 text-left">
              {COUNTRIES_WITH_STATES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCountry(c)}
                  className={`p-6 rounded-2xl border-2 transition-all flex items-center justify-between ${
                    selectedCountry?.id === c.id ? "border-primary bg-primary/5 shadow-lg" : "border-border hover:border-primary/50"
                  }`}
                >
                  <div>
                    <span className="text-xl font-bold block">{c.name}</span>
                    <span className="text-xs text-muted-foreground">Click to select</span>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    selectedCountry?.id === c.id ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}>
                    <ChevronLeft className="w-5 h-5 rotate-180" />
                  </div>
                </button>
              ))}
            </div>
            {selectedCountry && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p className="text-sm text-primary font-medium animate-pulse">Loading map...</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}

      {/* Loading state for Country mode */}
      {!target && !state.isGameOver && mode === 'country' && (
        <div className="absolute inset-0 bg-background z-40 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <h2 className="text-xl font-bold">Loading World Map...</h2>
        </div>
      )}

    </div>
  );
}
