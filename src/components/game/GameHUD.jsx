"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Timer, Flame, Target, Pause, Play, Home } from "lucide-react";
import { useGame } from "../../context/GameContext";
import { useRouter } from "next/navigation";

export default function GameHUD({ question }) {
  const { state, dispatch } = useGame();
  const router = useRouter();

  useEffect(() => {
    if (!state.isPlaying || state.isPaused || state.isGameOver) return;

    const timer = setInterval(() => {
      dispatch({ type: "TICK_TIMER" });
    }, 1000);

    return () => clearInterval(timer);
  }, [state.isPlaying, state.isPaused, state.isGameOver, dispatch]);

  const accuracy = state.totalQuestions > 0 
    ? Math.round((state.correctAnswers / state.totalQuestions) * 100) 
    : 0;

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 bg-card/80 backdrop-blur-sm rounded-2xl border border-border">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            {Array.from({ length: state.lives }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <Heart className="w-5 h-5 text-red-500 fill-red-500" />
              </motion.div>
            ))}
            {Array.from({ length: Math.max(0, (state.difficulty === "easy" ? 5 : state.difficulty === "medium" ? 3 : 2) - state.lives) }).map((_, i) => (
              <Heart key={`empty-${i}`} className="w-5 h-5 text-muted-foreground/30" />
            ))}
          </div>

          <div className="h-6 w-px bg-border hidden md:block" />

          <div className="flex items-center gap-2">
            <Timer className={`w-5 h-5 ${state.timeRemaining <= 10 ? "text-red-500" : "text-muted-foreground"}`} />
            <span className={`font-mono font-bold ${state.timeRemaining <= 10 ? "text-red-500" : "text-foreground"}`}>
              {Math.floor(state.timeRemaining / 60)}:{String(state.timeRemaining % 60).padStart(2, "0")}
            </span>
          </div>

          <div className="h-6 w-px bg-border hidden md:block" />

          <div className="flex items-center gap-2">
            <Flame className={`w-5 h-5 ${state.streak >= 3 ? "text-orange-500" : "text-muted-foreground"}`} />
            <span className="font-bold text-foreground">{state.streak}</span>
          </div>

          <div className="h-6 w-px bg-border hidden md:block" />

          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-muted-foreground" />
            <span className="font-bold text-foreground">{accuracy}%</span>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="bg-gradient-to-r from-primary/20 to-purple-500/20 px-4 py-2 rounded-xl flex-1 md:flex-none">
            <span className="text-sm text-muted-foreground">Score</span>
            <p className="text-xl font-bold text-foreground">{state.score}</p>
          </div>

          <button
            onClick={() => dispatch({ type: "TOGGLE_PAUSE" })}
            className="p-2.5 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
          >
            {state.isPaused ? (
              <Play className="w-5 h-5 text-foreground" />
            ) : (
              <Pause className="w-5 h-5 text-foreground" />
            )}
          </button>

          <button
            onClick={() => {
              dispatch({ type: "RESET_GAME" });
              router.push("/");
            }}
            className="p-2.5 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
          >
            <Home className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </div>

      {question && (
        <motion.div
          key={question}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-center"
        >
          <p className="text-lg md:text-xl font-medium text-foreground">
            Select: <span className="text-primary font-bold">{question}</span>
          </p>
        </motion.div>
      )}

      {state.feedback && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className={`mt-4 p-3 rounded-xl text-center ${
            state.feedback.type === "correct" 
              ? "bg-green-500/20 border border-green-500/30" 
              : "bg-red-500/20 border border-red-500/30"
          }`}
        >
          <p className={`font-medium ${
            state.feedback.type === "correct" ? "text-green-500" : "text-red-500"
          }`}>
            {state.feedback.message}
          </p>
          {state.feedback.bonus && (
            <p className="text-sm text-green-400">{state.feedback.bonus}</p>
          )}
        </motion.div>
      )}

      {state.isPaused && !state.isGameOver && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-card p-8 rounded-2xl border border-border text-center"
          >
            <h2 className="text-2xl font-bold text-foreground mb-4">Game Paused</h2>
            <button
              onClick={() => dispatch({ type: "TOGGLE_PAUSE" })}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
            >
              Resume
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
