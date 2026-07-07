'use client';

import { motion } from 'framer-motion';
import { MatchStatistics } from '@/types/football';

interface Props {
  statistics: MatchStatistics;
  homeTeamName: string;
  awayTeamName: string;
}

export function PossessionDonut({ statistics, homeTeamName, awayTeamName }: Props) {
  const home = statistics.possession.home;
  const away = statistics.possession.away;
  const circumference = 2 * Math.PI * 45;
  const homeArc = (home / 100) * circumference;
  const awayArc = (away / 100) * circumference;

  return (
    <div className="telemetry-panel possession-donut">
      <div className="panel-header">
        <h3 className="panel-title">
          <span className="panel-title-icon">🎯</span>
          Possession
        </h3>
      </div>

      <div className="possession-donut__chart">
        <svg viewBox="0 0 100 100" className="possession-donut__svg">
          {/* Background circle */}
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke="#1a1a2e"
            strokeWidth="8"
          />
          {/* Home possession arc */}
          <motion.circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke="#22c55e"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${homeArc} ${circumference}`}
            strokeDashoffset={0}
            transform="rotate(-90 50 50)"
            initial={{ strokeDasharray: `0 ${circumference}` }}
            animate={{ strokeDasharray: `${homeArc} ${circumference}` }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
          {/* Away possession arc */}
          <motion.circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke="#ef4444"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${awayArc} ${circumference}`}
            strokeDashoffset={-homeArc}
            transform="rotate(-90 50 50)"
            initial={{ strokeDasharray: `0 ${circumference}` }}
            animate={{ strokeDasharray: `${awayArc} ${circumference}` }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
          />
          {/* Center text */}
          <text x="50" y="46" textAnchor="middle" className="possession-donut__center-text">
            {home}%
          </text>
          <text x="50" y="58" textAnchor="middle" className="possession-donut__center-sub">
            {away}%
          </text>
        </svg>

        <div className="possession-donut__legend">
          <div className="possession-donut__legend-item">
            <div className="possession-donut__legend-dot possession-donut__legend-dot--home" />
            <span>{homeTeamName}</span>
          </div>
          <div className="possession-donut__legend-item">
            <div className="possession-donut__legend-dot possession-donut__legend-dot--away" />
            <span>{awayTeamName}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
