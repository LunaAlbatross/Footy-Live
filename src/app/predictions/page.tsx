'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/ui/Header';
import { PredictionsGame } from '@/components/predictions/PredictionsGame';
import { FadeIn } from '@/components/ui/Animations';
import { Prediction } from '@/types/football';
import { Trophy, Target, Clock, TrendingUp, Sparkles, Crown } from 'lucide-react';

export default function PredictionsPage() {
  const [predictions, setPredictions] = useState<Prediction[]>([
    { id: '1', type: 'next_scorer', question: 'Who will score the next goal?', options: ['Home Team Player', 'Away Team Player', 'No More Goals'], points: 10 },
    { id: '2', type: 'final_score', question: 'What will be the match result?', options: ['Home Win', 'Draw', 'Away Win'], points: 15 },
    { id: '3', type: 'next_card', question: 'Which team receives the next card?', options: ['Home Team', 'Away Team', 'No More Cards'], points: 5 },
    { id: '4', type: 'total_goals', question: 'Total goals in the match?', options: ['Under 2.5', '2-3 Goals', 'Over 3.5'], points: 10 },
    { id: '5', type: 'next_scorer', question: 'First half or second half - more goals?', options: ['First Half', 'Second Half', 'Equal'], points: 20 },
  ]);

  const [userScore, setUserScore] = useState(0);
  const [userRank] = useState(1247);

  function handlePredict(predictionId: string, pick: string) {
    setPredictions(prev =>
      prev.map(p => {
        if (p.id === predictionId && !p.userPick) {
          setTimeout(() => {
            const isCorrect = Math.random() > 0.5;
            setPredictions(prev =>
              prev.map(p2 =>
                p2.id === predictionId
                  ? { ...p2, correct: isCorrect, points: isCorrect ? p2.points : 0 }
                  : p2
              )
            );
            if (isCorrect) {
              setUserScore(s => s + (p.points || 0));
            }
          }, 3000);
          return { ...p, userPick: pick };
        }
        return p;
      })
    );
  }

  const statCards = [
    { icon: Trophy, label: 'Your Score', value: userScore, bg: 'bg-violet-500/10', text: 'text-violet-400' },
    { icon: Target, label: 'Correct', value: predictions.filter(p => p.correct).length, bg: 'bg-amber-500/10', text: 'text-amber-400' },
    { icon: Clock, label: 'Pending', value: predictions.filter(p => p.userPick && !p.correct && p.correct !== false).length, bg: 'bg-red-500/10', text: 'text-red-400' },
    { icon: TrendingUp, label: 'Rank', value: `#${userRank}`, bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  ];

  const leaderboard = [
    { rank: 1, name: 'FootballFan99', score: 2450, emoji: '👑' },
    { rank: 2, name: 'GoalPredictor', score: 2380, emoji: '🥈' },
    { rank: 3, name: 'MatchExpert', score: 2290, emoji: '🥉' },
    { rank: userRank, name: 'You', score: userScore, emoji: '⚡', isUser: true },
  ];

  return (
    <div className="min-h-screen">
      <Header darkMode={true} toggleDarkMode={() => {}} />

      <main className="container mx-auto px-4 lg:px-6 py-8 space-y-8">
        {/* Hero */}
        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl gradient-border">
            <div className="relative bg-gradient-to-br from-violet-950/40 via-slate-900/60 to-slate-900/40 p-8 md:p-10 rounded-3xl glass">
              <div className="absolute top-0 right-0 w-72 h-72 bg-violet-500/8 rounded-full blur-[100px] -translate-y-1/3 translate-x-1/3" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-500/5 rounded-full blur-[60px] translate-y-1/3 -translate-x-1/3" />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="p-4 rounded-2xl bg-violet-500/10 border border-violet-500/15">
                    <Sparkles className="w-8 h-8 text-violet-400" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Predict & Win</h1>
                    <p className="text-gray-400 mt-1">Make predictions, earn points, and climb the leaderboard!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, idx) => (
            <FadeIn key={stat.label} delay={idx * 0.08}>
              <div className="glass-card p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                    <stat.icon className={`w-4 h-4 ${stat.text}`} />
                  </div>
                  <span className="text-sm text-gray-500 font-medium">{stat.label}</span>
                </div>
                <div className="text-3xl font-extrabold text-white tracking-tight">{stat.value}</div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Predictions Game */}
        <FadeIn delay={0.3}>
          <PredictionsGame predictions={predictions} onPredict={handlePredict} />
        </FadeIn>

        {/* Leaderboard */}
        <FadeIn delay={0.4}>
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10">
                <Crown className="w-4 h-4 text-amber-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Top Predictors</h3>
            </div>
            <div className="space-y-2">
              {leaderboard.map((player, index) => (
                <motion.div
                  key={player.rank}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={cn(
                    'flex items-center justify-between p-4 rounded-xl transition-colors',
                    player.isUser
                      ? 'bg-violet-500/10 border border-violet-500/20'
                      : 'bg-white/[0.02] hover:bg-white/[0.04]'
                  )}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{player.emoji}</span>
                    <div>
                      <div className={`font-semibold text-sm ${player.isUser ? 'text-violet-400' : 'text-white'}`}>
                        {player.name}
                      </div>
                      <div className="text-xs text-gray-600">Rank #{player.rank}</div>
                    </div>
                  </div>
                  <div className="text-lg font-extrabold text-white tabular-nums">{player.score}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeIn>
      </main>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}