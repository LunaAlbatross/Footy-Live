'use client';

import { motion } from 'framer-motion';
import { MatchStatistics } from '@/types/football';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';

interface Props {
  statistics: MatchStatistics;
}

interface StatRow {
  label: string;
  homeValue: number;
  awayValue: number;
  format?: 'number' | 'percent';
  reversed?: boolean;
}

export function StatisticsBoard({ statistics }: Props) {
  const statRows: StatRow[] = [
    { label: 'Possession', homeValue: statistics.possession.home, awayValue: statistics.possession.away, format: 'percent' },
    { label: 'Shots', homeValue: statistics.shots.home, awayValue: statistics.shots.away },
    { label: 'Shots on Target', homeValue: statistics.shotsOnTarget.home, awayValue: statistics.shotsOnTarget.away },
    { label: 'Shots off Target', homeValue: statistics.shotsOffTarget.home, awayValue: statistics.shotsOffTarget.away },
    { label: 'Blocked Shots', homeValue: statistics.blockedShots.home, awayValue: statistics.blockedShots.away },
    { label: 'Corners', homeValue: statistics.corners.home, awayValue: statistics.corners.away },
    { label: 'Offsides', homeValue: statistics.offsides.home, awayValue: statistics.offsides.away },
    { label: 'Fouls', homeValue: statistics.fouls.home, awayValue: statistics.fouls.away },
    { label: 'Yellow Cards', homeValue: statistics.yellowCards.home, awayValue: statistics.yellowCards.away },
    { label: 'Red Cards', homeValue: statistics.redCards.home, awayValue: statistics.redCards.away },
    { label: 'Saves', homeValue: statistics.saves.home, awayValue: statistics.saves.away },
    { label: 'Total Passes', homeValue: statistics.passes.home, awayValue: statistics.passes.away },
    { label: 'Pass Accuracy', homeValue: statistics.passAccuracy.home, awayValue: statistics.passAccuracy.away, format: 'percent' },
    { label: 'Tackles', homeValue: statistics.tackles.home, awayValue: statistics.tackles.away },
    { label: 'Attacks', homeValue: statistics.attacks.home, awayValue: statistics.attacks.away },
    { label: 'Dangerous Attacks', homeValue: statistics.dangerousAttacks.home, awayValue: statistics.dangerousAttacks.away },
  ];

  if (statistics.expectedGoals) {
    statRows.unshift({
      label: 'Expected Goals (xG)',
      homeValue: Math.round(statistics.expectedGoals.home * 100) / 100,
      awayValue: Math.round(statistics.expectedGoals.away * 100) / 100,
    });
  }

  const possessionData = [
    { name: 'Home', value: statistics.possession.home, fill: '#22c55e' },
    { name: 'Away', value: statistics.possession.away, fill: '#ef4444' },
  ];

  return (
    <div className="space-y-6">
      {/* Possession Chart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Possession</h3>
        <div className="h-32 w-full">
          <ResponsiveContainer width="100%" height="100%" minHeight={128}>
            <BarChart data={possessionData} barSize={60}>
              <XAxis dataKey="name" hide />
              <YAxis hide domain={[0, 100]} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {possessionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-8 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{statistics.possession.home}%</div>
            <div className="text-sm text-gray-400">Home</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">{statistics.possession.away}%</div>
            <div className="text-sm text-gray-400">Away</div>
          </div>
        </div>
      </motion.div>

      {/* Statistics Grid */}
      <div className="grid gap-3">
        {statRows.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, x: stat.reversed ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white/5 border border-white/10 rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className={cn(
                'text-sm font-medium w-24 truncate',
                stat.homeValue > stat.awayValue ? 'text-green-400' : 'text-gray-400'
              )}>
                {stat.homeValue}
              </span>
              <span className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</span>
              <span className={cn(
                'text-sm font-medium w-24 text-right truncate',
                stat.awayValue > stat.homeValue ? 'text-red-400' : 'text-gray-400'
              )}>
                {stat.awayValue}
              </span>
            </div>
            
            {/* Bar visualization */}
            <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(stat.homeValue / (stat.homeValue + stat.awayValue || 1)) * 100}%` }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-600 to-green-400"
              />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(stat.awayValue / (stat.homeValue + stat.awayValue || 1)) * 100}%` }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="absolute right-0 top-0 h-full bg-gradient-to-l from-red-600 to-red-400"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}