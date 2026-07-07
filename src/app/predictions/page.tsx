'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { PredictionsGame } from '@/components/predictions/PredictionsGame';
import { FadeIn } from '@/components/ui/Animations';
import { Prediction, Match } from '@/types/football';
import { Trophy, Target, Clock, TrendingUp, Sparkles, Crown } from 'lucide-react';
import { getTodaysMatches } from '@/lib/api';

export default function PredictionsPage() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [userScore, setUserScore] = useState(0);
  const [userRank] = useState(1247);

  const generateDynamicPredictions = useCallback((matches: Match[]) => {
    const liveMatches = matches.filter(m => m.status === 'LIVE' || m.status === 'IN_PLAY');
    const scheduledMatches = matches.filter(m => m.status === 'SCHEDULED');
    
    let newPredictions: Prediction[] = [];
    
    // Generate prompts for live matches
    liveMatches.forEach(match => {
      const templates = [
        {
          idSuffix: 'next_goal',
          type: 'next_scorer',
          question: `[LIVE] Who will score the next goal in ${match.homeTeam.shortName} vs ${match.awayTeam.shortName}?`,
          options: [match.homeTeam.shortName, match.awayTeam.shortName, 'No More Goals'],
          points: 25
        },
        {
          idSuffix: 'red_card',
          type: 'next_card',
          question: `[LIVE] Will there be a red card shown in the remainder of ${match.homeTeam.shortName} vs ${match.awayTeam.shortName}?`,
          options: ['Yes, Red Card', 'No Red Card'],
          points: 40
        },
        {
          idSuffix: 'next_corner',
          type: 'total_goals',
          question: `[LIVE] Which team will win the next corner kick in the match?`,
          options: [match.homeTeam.shortName, match.awayTeam.shortName],
          points: 15
        },
        {
          idSuffix: 'outcome',
          type: 'final_score',
          question: `[LIVE] What will be the final outcome of ${match.homeTeam.shortName} vs ${match.awayTeam.shortName}?`,
          options: [`${match.homeTeam.shortName} Win`, 'Draw', `${match.awayTeam.shortName} Win`],
          points: 20
        },
        {
          idSuffix: 'penalty',
          type: 'next_scorer',
          question: `[LIVE] Will a penalty kick be awarded in this match?`,
          options: ['Yes', 'No'],
          points: 35
        }
      ];

      // Shuffle templates and pick the first 2 for this match
      const shuffled = templates.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 2);

      selected.forEach(t => {
        newPredictions.push({
          id: `live_${match.id}_${t.idSuffix}`,
          type: t.type,
          question: t.question,
          options: t.options,
          points: t.points
        });
      });
    });

    // Generate prompts for scheduled matches
    scheduledMatches.slice(0, 3).forEach(match => {
      newPredictions.push({
        id: `sched_${match.id}_winner`,
        type: 'final_score',
        question: `Who will win the match between ${match.homeTeam.shortName} and ${match.awayTeam.shortName}?`,
        options: [match.homeTeam.shortName, 'Draw', match.awayTeam.shortName],
        points: 10
      });
    });

    // Fallback if no matches
    if (newPredictions.length === 0) {
      newPredictions = [
        { id: '1', type: 'next_scorer', question: 'No active matches. Predict the first goalscorer of the tournament!', options: ['Messi', 'Mbappe', 'Haaland'], points: 10 },
        { id: '2', type: 'final_score', question: 'Who will win the upcoming European Championship?', options: ['France', 'England', 'Spain'], points: 50 },
      ];
    }

    setPredictions(prev => {
      // Merge to keep existing userPicks intact based on ID
      return newPredictions.map(newP => {
        const existing = prev.find(p => p.id === newP.id);
        if (existing) return existing;
        return newP;
      });
    });
  }, []);

  const loadMatches = useCallback(async () => {
    try {
      const data = await getTodaysMatches();
      generateDynamicPredictions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [generateDynamicPredictions]);

  useEffect(() => {
    loadMatches();
    const interval = setInterval(loadMatches, 60000); // Check for new live matches every minute
    return () => clearInterval(interval);
  }, [loadMatches]);

  function handlePredict(predictionId: string, pick: string) {
    setPredictions(prev =>
      prev.map(p => {
        if (p.id === predictionId && !p.userPick) {
          // In a real application, this pick would be sent to a backend database.
          // The prediction will remain in "Pending" state until the match concludes 
          // or the specific event (like next goal) happens in real life, at which point 
          // the backend will push an update to resolve it and award points.
          return { ...p, userPick: pick };
        }
        return p;
      })
    );
  }

  const statCards = [
    { icon: Trophy, label: 'Your Score', value: userScore, bg: 'bg-indigo-500/10', text: 'text-indigo-400' },
    { icon: Target, label: 'Correct', value: predictions.filter(p => p.correct).length, bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
    { icon: Clock, label: 'Pending', value: predictions.filter(p => p.userPick && !p.correct && p.correct !== false).length, bg: 'bg-amber-500/10', text: 'text-amber-400' },
  ];

  return (
    <main className="container mx-auto px-6 py-8">
      {/* Hero */}
      <FadeIn>
        <div className="telemetry-card overflow-hidden mb-8 bg-gradient-to-br from-indigo-900/40 via-[#141416]/60 to-[#141416]/40 relative">
          <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-[100px] -translate-y-1/3 translate-x-1/3 pointer-events-none" />
          
          <div className="relative z-10 p-8 flex flex-col md:flex-row md:items-center gap-6">
            <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              <Sparkles className="w-8 h-8 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold font-outfit text-white tracking-tight">Predict & Win</h1>
              <p className="text-sm text-zinc-400 mt-1">Make predictions, earn points, and climb the ranks.</p>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {statCards.map((stat, idx) => (
          <FadeIn key={stat.label} delay={idx * 0.08}>
            <div className="telemetry-card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`w-4 h-4 ${stat.text}`} />
                </div>
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">{stat.label}</span>
              </div>
              <div className="text-3xl font-bold font-mono text-white tracking-tight">{stat.value}</div>
            </div>
          </FadeIn>
        ))}
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Predictions Game */}
        <FadeIn delay={0.2}>
          {loading ? (
            <div className="telemetry-card p-12 flex flex-col items-center justify-center min-h-[300px]">
              <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-indigo-500 animate-spin mb-4" />
              <p className="text-zinc-500 text-xs font-bold tracking-widest uppercase">Syncing Live Prompts...</p>
            </div>
          ) : (
            <PredictionsGame predictions={predictions} onPredict={handlePredict} />
          )}
        </FadeIn>
      </div>
    </main>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}