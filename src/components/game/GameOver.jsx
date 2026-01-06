"use client";

import { motion } from "framer-motion";
import { Trophy, Target, Flame, RotateCcw, Home, Share2 } from "lucide-react";
import { useGame } from "../../context/GameContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function GameOver() {
  const { state, dispatch } = useGame();
  const router = useRouter();

  const accuracy = state.totalQuestions > 0 
    ? Math.round((state.correctAnswers / state.totalQuestions) * 100) 
    : 0;

  useEffect(() => {
    if (state.isGameOver && state.score > 0) {
      dispatch({ type: "ADD_TO_LEADERBOARD" });
    }
  }, [state.isGameOver]);

  const handlePlayAgain = () => {
    dispatch({ type: "START_GAME" });
  };

  const handleGoHome = () => {
    dispatch({ type: "RESET_GAME" });
    router.push("/");
  };

  const getGrade = () => {
    if (accuracy >= 90) return { grade: "A+", color: "text-green-500" };
    if (accuracy >= 80) return { grade: "A", color: "text-green-400" };
    if (accuracy >= 70) return { grade: "B", color: "text-blue-500" };
    if (accuracy >= 60) return { grade: "C", color: "text-yellow-500" };
    if (accuracy >= 50) return { grade: "D", color: "text-orange-500" };
    return { grade: "F", color: "text-red-500" };
  };

  const { grade, color } = getGrade();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-md bg-card rounded-2xl border border-border p-6 md:p-8 shadow-2xl"
      >
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center"
          >
            <Trophy className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold text-foreground">Game Over!</h2>
          <p className="text-muted-foreground mt-1 capitalize">{state.mode} Mode • {state.difficulty}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-muted p-4 rounded-xl text-center">
            <p className="text-3xl font-bold text-foreground">{state.score}</p>
            <p className="text-sm text-muted-foreground">Score</p>
          </div>
          <div className="bg-muted p-4 rounded-xl text-center">
            <p className={`text-3xl font-bold ${color}`}>{grade}</p>
            <p className="text-sm text-muted-foreground">Grade</p>
          </div>
          <div className="bg-muted p-4 rounded-xl text-center">
            <div className="flex items-center justify-center gap-1">
              <Target className="w-5 h-5 text-muted-foreground" />
              <p className="text-xl font-bold text-foreground">{accuracy}%</p>
            </div>
            <p className="text-sm text-muted-foreground">Accuracy</p>
          </div>
          <div className="bg-muted p-4 rounded-xl text-center">
            <div className="flex items-center justify-center gap-1">
              <Flame className="w-5 h-5 text-orange-500" />
              <p className="text-xl font-bold text-foreground">{state.bestStreak}</p>
            </div>
            <p className="text-sm text-muted-foreground">Best Streak</p>
          </div>
        </div>

        <div className="text-center mb-6 p-4 bg-muted/50 rounded-xl">
          <p className="text-sm text-muted-foreground">
            {state.correctAnswers} correct out of {state.totalQuestions} questions
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleGoHome}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-medium transition-colors"
          >
            <Home className="w-5 h-5" />
            Home
          </button>
          <button
            onClick={handlePlayAgain}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            Play Again
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
