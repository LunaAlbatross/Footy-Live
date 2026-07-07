'use client';

import { motion } from 'framer-motion';
import { Prediction } from '@/types/football';
import { Gamepad2, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  predictions: Prediction[];
  onPredict: (predictionId: string, pick: string) => void;
}

export function PredictionsGame({ predictions, onPredict }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-violet-500/10">
            <Gamepad2 className="w-4 h-4 text-violet-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Prediction Game</h3>
            <p className="text-xs text-gray-500">Make your picks and earn points!</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-extrabold text-violet-400 tabular-nums">
            {predictions.filter(p => p.correct).reduce((sum, p) => sum + (p.points || 0), 0)}
          </div>
          <div className="text-[10px] text-gray-600 font-medium uppercase tracking-wider">Points</div>
        </div>
      </div>

      <div className="grid gap-3">
        {predictions.map((prediction, index) => (
          <PredictionCard
            key={prediction.id}
            prediction={prediction}
            onPredict={onPredict}
            delay={index * 0.08}
          />
        ))}
      </div>
    </div>
  );
}

function PredictionCard({ prediction, onPredict, delay }: { prediction: Prediction; onPredict: (id: string, pick: string) => void; delay: number }) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'next_scorer': return '⚽';
      case 'final_score': return '🏆';
      case 'next_card': return '🟨';
      case 'total_goals': return '🎯';
      default: return '❓';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={cn(
        'glass-card p-5 transition-all',
        prediction.correct === true && '!border-emerald-500/25',
        prediction.correct === false && '!border-red-500/15',
        prediction.userPick && !prediction.correct && prediction.correct !== false && '!border-violet-500/20'
      )}
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="text-2xl">{getIcon(prediction.type)}</div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-white mb-1">{prediction.question}</h4>
          {prediction.correct !== undefined && (
            <div className="flex items-center gap-2 mt-1">
              {prediction.correct ? (
                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3" />
                  Correct (+{prediction.points})
                </span>
              ) : prediction.userPick ? (
                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-red-500/15 text-red-400 font-semibold border border-red-500/20">
                  <XCircle className="w-3 h-3" />
                  Incorrect
                </span>
              ) : null}
            </div>
          )}
        </div>
        <div className="text-xs text-gray-600 font-semibold whitespace-nowrap">
          +{prediction.points} pts
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {prediction.options.map((option, optionIndex) => {
          const isSelected = prediction.userPick === option;
          return (
            <motion.button
              key={optionIndex}
              whileHover={{ scale: prediction.userPick ? 1 : 1.02 }}
              whileTap={{ scale: prediction.userPick ? 1 : 0.98 }}
              onClick={() => !prediction.userPick && onPredict(prediction.id, option)}
              disabled={!!prediction.userPick}
              className={cn(
                'px-3 py-2.5 rounded-xl text-xs font-semibold transition-all border',
                isSelected
                  ? 'bg-violet-500/15 border-violet-500/30 text-violet-300'
                  : 'bg-white/[0.03] border-white/[0.06] text-gray-400 hover:bg-white/[0.06] hover:border-white/10 hover:text-white',
                prediction.userPick && !isSelected && 'opacity-40 cursor-not-allowed'
              )}
            >
              {option}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}