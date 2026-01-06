"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Globe, Map, MapPin, Sun, Moon, Settings, Trophy, Volume2, VolumeX } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useGame } from "../context/GameContext";

export default function HomePage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { state, dispatch } = useGame();
  const [showSettings, setShowSettings] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const handleModeSelect = (mode) => {
    dispatch({ type: "SET_MODE", payload: mode });
    router.push(`/play/${mode}`);
  };

  const modes = [
    {
      id: "country",
      title: "Country Mode",
      description: "Test your knowledge of world countries",
      icon: Globe,
      gradient: "from-indigo-500 to-purple-600",
      bgGlow: "bg-indigo-500/20",
    },
    {
      id: "state",
      title: "State Mode",
      description: "Learn states and provinces",
      icon: Map,
      gradient: "from-emerald-500 to-teal-600",
      bgGlow: "bg-emerald-500/20",
    },
    {
      id: "city",
      title: "City Mode",
      description: "Find cities on the map",
      icon: MapPin,
      gradient: "from-orange-500 to-rose-600",
      bgGlow: "bg-orange-500/20",
    },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-3xl" />
      </div>

      <header className="relative z-10 flex items-center justify-between p-4 md:p-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-foreground">GeoPlay</span>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <button
            onClick={() => dispatch({ type: "TOGGLE_SOUND" })}
            className="p-2.5 rounded-xl bg-card border border-border hover:bg-muted transition-colors"
            aria-label="Toggle sound"
          >
            {state.soundEnabled ? (
              <Volume2 className="w-5 h-5 text-foreground" />
            ) : (
              <VolumeX className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
          <button
            onClick={() => setShowLeaderboard(true)}
            className="p-2.5 rounded-xl bg-card border border-border hover:bg-muted transition-colors"
            aria-label="Leaderboard"
          >
            <Trophy className="w-5 h-5 text-foreground" />
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2.5 rounded-xl bg-card border border-border hover:bg-muted transition-colors"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5 text-foreground" />
          </button>
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-card border border-border hover:bg-muted transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-foreground" />
            ) : (
              <Moon className="w-5 h-5 text-foreground" />
            )}
          </button>
        </motion.div>
      </header>

      <main className="relative z-10 flex flex-col items-center justify-center px-4 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-12 md:mb-16"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-foreground mb-4">
            <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              GeoPlay
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-md mx-auto">
            Learn geography by playing interactive map games
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full max-w-4xl">
          {modes.map((mode, index) => (
            <motion.button
              key={mode.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleModeSelect(mode.id)}
              className="group relative p-6 md:p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 text-left overflow-hidden"
            >
              <div className={`absolute inset-0 ${mode.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative z-10">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${mode.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <mode.icon className="w-7 h-7 text-white" />
                </div>
                
                <h2 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {mode.title}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {mode.description}
                </p>
              </div>

              <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-primary/10 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.button>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-muted-foreground">
            Difficulty: <span className="font-medium text-foreground capitalize">{state.difficulty}</span>
          </p>
        </motion.div>
      </main>

      {showSettings && (
        <SettingsModal 
          onClose={() => setShowSettings(false)} 
          state={state}
          dispatch={dispatch}
        />
      )}

      {showLeaderboard && (
        <LeaderboardModal 
          onClose={() => setShowLeaderboard(false)} 
          leaderboard={state.leaderboard}
        />
      )}
    </div>
  );
}

function SettingsModal({ onClose, state, dispatch }) {
  const difficulties = ["easy", "medium", "hard"];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-card rounded-2xl border border-border p-6 shadow-xl"
      >
        <h2 className="text-2xl font-bold text-foreground mb-6">Settings</h2>

        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">
              Difficulty
            </label>
            <div className="grid grid-cols-3 gap-2">
              {difficulties.map((diff) => (
                <button
                  key={diff}
                  onClick={() => dispatch({ type: "SET_DIFFICULTY", payload: diff })}
                  className={`py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
                    state.difficulty === diff
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {diff.charAt(0).toUpperCase() + diff.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Sound Effects</span>
            <button
              onClick={() => dispatch({ type: "TOGGLE_SOUND" })}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                state.soundEnabled ? "bg-primary" : "bg-muted"
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  state.soundEnabled ? "left-7" : "left-1"
                }`}
              />
            </button>
          </div>

          <div className="pt-4 border-t border-border">
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Easy: 5 lives, 90 seconds, hints enabled</p>
              <p>Medium: 3 lives, 60 seconds</p>
              <p>Hard: 2 lives, 45 seconds</p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
        >
          Done
        </button>
      </motion.div>
    </motion.div>
  );
}

function LeaderboardModal({ onClose, leaderboard }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-card rounded-2xl border border-border p-6 shadow-xl max-h-[80vh] overflow-hidden flex flex-col"
      >
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          Leaderboard
        </h2>

        {leaderboard.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No scores yet!</p>
            <p className="text-sm text-muted-foreground mt-1">Play a game to get on the board</p>
          </div>
        ) : (
          <div className="space-y-2 overflow-y-auto flex-1">
            {leaderboard.map((entry, index) => (
              <div
                key={entry.id}
                className={`flex items-center gap-3 p-3 rounded-xl ${
                  index === 0 ? "bg-yellow-500/10 border border-yellow-500/20" :
                  index === 1 ? "bg-gray-400/10 border border-gray-400/20" :
                  index === 2 ? "bg-amber-600/10 border border-amber-600/20" :
                  "bg-muted"
                }`}
              >
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  index === 0 ? "bg-yellow-500 text-black" :
                  index === 1 ? "bg-gray-400 text-black" :
                  index === 2 ? "bg-amber-600 text-white" :
                  "bg-muted-foreground/20 text-muted-foreground"
                }`}>
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{entry.score} pts</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {entry.mode} • {entry.difficulty} • {entry.accuracy}% accuracy
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full mt-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
}
