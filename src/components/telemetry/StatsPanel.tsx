'use client';

import { motion } from 'framer-motion';
import { MatchStatistics } from '@/types/football';

interface Props {
  statistics: MatchStatistics;
  homeTeamName: string;
  awayTeamName: string;
}

interface StatItem {
  label: string;
  home: number;
  away: number;
  format?: 'number' | 'percent' | 'decimal';
  category: 'attacking' | 'defending' | 'possession' | 'discipline';
}

export function StatsPanel({ statistics, homeTeamName, awayTeamName }: Props) {
  const stats: StatItem[] = [
    // Attacking
    { label: 'Shots', home: statistics.shots.home, away: statistics.shots.away, category: 'attacking' },
    { label: 'Shots on Target', home: statistics.shotsOnTarget.home, away: statistics.shotsOnTarget.away, category: 'attacking' },
    { label: 'Shots off Target', home: statistics.shotsOffTarget.home, away: statistics.shotsOffTarget.away, category: 'attacking' },
    { label: 'Blocked Shots', home: statistics.blockedShots.home, away: statistics.blockedShots.away, category: 'attacking' },
    { label: 'Corners', home: statistics.corners.home, away: statistics.corners.away, category: 'attacking' },
    { label: 'Attacks', home: statistics.attacks.home, away: statistics.attacks.away, category: 'attacking' },
    { label: 'Dangerous Attacks', home: statistics.dangerousAttacks.home, away: statistics.dangerousAttacks.away, category: 'attacking' },
    // Possession
    { label: 'Possession', home: statistics.possession.home, away: statistics.possession.away, format: 'percent', category: 'possession' },
    { label: 'Passes', home: statistics.passes.home, away: statistics.passes.away, category: 'possession' },
    { label: 'Pass Accuracy', home: statistics.passAccuracy.home, away: statistics.passAccuracy.away, format: 'percent', category: 'possession' },
    // Defending
    { label: 'Tackles', home: statistics.tackles.home, away: statistics.tackles.away, category: 'defending' },
    { label: 'Saves', home: statistics.saves.home, away: statistics.saves.away, category: 'defending' },
    { label: 'Offsides', home: statistics.offsides.home, away: statistics.offsides.away, category: 'defending' },
    // Discipline
    { label: 'Fouls', home: statistics.fouls.home, away: statistics.fouls.away, category: 'discipline' },
    { label: 'Yellow Cards', home: statistics.yellowCards.home, away: statistics.yellowCards.away, category: 'discipline' },
    { label: 'Red Cards', home: statistics.redCards.home, away: statistics.redCards.away, category: 'discipline' },
  ];

  if (statistics.expectedGoals) {
    stats.unshift({
      label: 'xG',
      home: statistics.expectedGoals.home,
      away: statistics.expectedGoals.away,
      format: 'decimal',
      category: 'attacking',
    });
  }

  const categories = [
    { key: 'attacking', label: 'Attacking', icon: '⚔️' },
    { key: 'possession', label: 'Possession', icon: '🎯' },
    { key: 'defending', label: 'Defending', icon: '🛡️' },
    { key: 'discipline', label: 'Discipline', icon: '📒' },
  ] as const;

  const formatValue = (val: number, format?: string) => {
    if (format === 'percent') return `${val}%`;
    if (format === 'decimal') return val.toFixed(2);
    return val.toString();
  };

  return (
    <div className="telemetry-panel stats-panel">
      <div className="panel-header">
        <h3 className="panel-title">
          <span className="panel-title-icon">📊</span>
          Match Statistics
        </h3>
      </div>

      {/* Team name headers */}
      <div className="stats-panel__team-header">
        <span className="stats-panel__team-name stats-panel__team-name--home">{homeTeamName}</span>
        <span className="stats-panel__team-name stats-panel__team-name--away">{awayTeamName}</span>
      </div>

      {/* Stats by category */}
      <div className="stats-panel__categories">
        {categories.map(cat => {
          const catStats = stats.filter(s => s.category === cat.key);
          if (catStats.length === 0) return null;
          
          return (
            <div key={cat.key} className="stats-panel__category">
              <div className="stats-panel__category-label">
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </div>
              {catStats.map((stat, idx) => {
                const total = stat.home + stat.away || 1;
                const homePercent = (stat.home / total) * 100;
                const homeLeading = stat.label === 'Fouls' || stat.label === 'Yellow Cards' || stat.label === 'Red Cards'
                  ? stat.home < stat.away
                  : stat.home > stat.away;
                const awayLeading = stat.label === 'Fouls' || stat.label === 'Yellow Cards' || stat.label === 'Red Cards'
                  ? stat.away < stat.home
                  : stat.away > stat.home;

                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.02 }}
                    className="stats-panel__row"
                  >
                    <div className={`stats-panel__value stats-panel__value--home ${homeLeading ? 'stats-panel__value--leading' : ''}`}>
                      {formatValue(stat.home, stat.format)}
                    </div>
                    <div className="stats-panel__bar-container">
                      <div className="stats-panel__label">{stat.label}</div>
                      <div className="stats-panel__bar">
                        <motion.div
                          className="stats-panel__bar-home"
                          initial={{ width: 0 }}
                          animate={{ width: `${homePercent}%` }}
                          transition={{ duration: 0.8 }}
                        />
                        <motion.div
                          className="stats-panel__bar-away"
                          initial={{ width: 0 }}
                          animate={{ width: `${100 - homePercent}%` }}
                          transition={{ duration: 0.8 }}
                        />
                      </div>
                    </div>
                    <div className={`stats-panel__value stats-panel__value--away ${awayLeading ? 'stats-panel__value--leading' : ''}`}>
                      {formatValue(stat.away, stat.format)}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
