'use client';

import { motion } from 'framer-motion';
import { MatchStatistics } from '@/types/football';

interface Props {
  statistics: MatchStatistics;
  homeTeamName: string;
  awayTeamName: string;
}

export function ShotMap({ statistics, homeTeamName, awayTeamName }: Props) {
  const homeShots = statistics.shots.home;
  const awayShots = statistics.shots.away;
  const homeOnTarget = statistics.shotsOnTarget.home;
  const awayOnTarget = statistics.shotsOnTarget.away;
  const homeOffTarget = statistics.shotsOffTarget.home;
  const awayOffTarget = statistics.shotsOffTarget.away;
  const homeBlocked = statistics.blockedShots.home;
  const awayBlocked = statistics.blockedShots.away;

  const homeAccuracy = homeShots > 0 ? Math.round((homeOnTarget / homeShots) * 100) : 0;
  const awayAccuracy = awayShots > 0 ? Math.round((awayOnTarget / awayShots) * 100) : 0;

  return (
    <div className="telemetry-panel shot-map">
      <div className="panel-header">
        <h3 className="panel-title">
          <span className="panel-title-icon">🎯</span>
          Shot Analysis
        </h3>
      </div>

      <div className="shot-map__grid">
        {/* Home side */}
        <div className="shot-map__side">
          <div className="shot-map__team-label">{homeTeamName}</div>
          <div className="shot-map__goal">
            <svg viewBox="0 0 120 80" className="shot-map__goal-svg">
              {/* Goal frame */}
              <rect x="10" y="10" width="100" height="60" rx="2" fill="none" stroke="#334155" strokeWidth="2" />
              {/* Goal net pattern */}
              {[0, 1, 2, 3, 4].map(i => (
                <line key={`vl-${i}`} x1={10 + i * 25} y1="10" x2={10 + i * 25} y2="70" stroke="#1e293b" strokeWidth="0.5" />
              ))}
              {[0, 1, 2, 3].map(i => (
                <line key={`hl-${i}`} x1="10" y1={10 + i * 20} x2="110" y2={10 + i * 20} stroke="#1e293b" strokeWidth="0.5" />
              ))}
              {/* On target shots */}
              {Array.from({ length: homeOnTarget }).map((_, i) => (
                <motion.circle
                  key={`on-${i}`}
                  cx={25 + (i * 20) % 80}
                  cy={25 + Math.floor(i / 4) * 20}
                  r="5"
                  fill="#22c55e"
                  opacity={0.8}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                />
              ))}
              {/* Off target shots - outside the goal */}
              {Array.from({ length: homeOffTarget }).map((_, i) => (
                <motion.circle
                  key={`off-${i}`}
                  cx={i % 2 === 0 ? 5 : 115}
                  cy={20 + i * 15}
                  r="4"
                  fill="#ef4444"
                  opacity={0.5}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 + 0.5 }}
                />
              ))}
            </svg>
          </div>
          <div className="shot-map__breakdown">
            <div className="shot-map__stat">
              <span className="shot-map__stat-num shot-map__stat-num--green">{homeOnTarget}</span>
              <span className="shot-map__stat-label">On Target</span>
            </div>
            <div className="shot-map__stat">
              <span className="shot-map__stat-num shot-map__stat-num--red">{homeOffTarget}</span>
              <span className="shot-map__stat-label">Off Target</span>
            </div>
            <div className="shot-map__stat">
              <span className="shot-map__stat-num shot-map__stat-num--blue">{homeBlocked}</span>
              <span className="shot-map__stat-label">Blocked</span>
            </div>
          </div>
          <div className="shot-map__accuracy">
            <span>Accuracy</span>
            <motion.span
              className="shot-map__accuracy-value"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {homeAccuracy}%
            </motion.span>
          </div>
        </div>

        {/* Divider */}
        <div className="shot-map__divider" />

        {/* Away side */}
        <div className="shot-map__side">
          <div className="shot-map__team-label">{awayTeamName}</div>
          <div className="shot-map__goal">
            <svg viewBox="0 0 120 80" className="shot-map__goal-svg">
              <rect x="10" y="10" width="100" height="60" rx="2" fill="none" stroke="#334155" strokeWidth="2" />
              {[0, 1, 2, 3, 4].map(i => (
                <line key={`vl-${i}`} x1={10 + i * 25} y1="10" x2={10 + i * 25} y2="70" stroke="#1e293b" strokeWidth="0.5" />
              ))}
              {[0, 1, 2, 3].map(i => (
                <line key={`hl-${i}`} x1="10" y1={10 + i * 20} x2="110" y2={10 + i * 20} stroke="#1e293b" strokeWidth="0.5" />
              ))}
              {Array.from({ length: awayOnTarget }).map((_, i) => (
                <motion.circle
                  key={`on-${i}`}
                  cx={25 + (i * 20) % 80}
                  cy={25 + Math.floor(i / 4) * 20}
                  r="5"
                  fill="#ef4444"
                  opacity={0.8}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                />
              ))}
              {Array.from({ length: awayOffTarget }).map((_, i) => (
                <motion.circle
                  key={`off-${i}`}
                  cx={i % 2 === 0 ? 5 : 115}
                  cy={20 + i * 15}
                  r="4"
                  fill="#6366f1"
                  opacity={0.5}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 + 0.5 }}
                />
              ))}
            </svg>
          </div>
          <div className="shot-map__breakdown">
            <div className="shot-map__stat">
              <span className="shot-map__stat-num shot-map__stat-num--green">{awayOnTarget}</span>
              <span className="shot-map__stat-label">On Target</span>
            </div>
            <div className="shot-map__stat">
              <span className="shot-map__stat-num shot-map__stat-num--red">{awayOffTarget}</span>
              <span className="shot-map__stat-label">Off Target</span>
            </div>
            <div className="shot-map__stat">
              <span className="shot-map__stat-num shot-map__stat-num--blue">{awayBlocked}</span>
              <span className="shot-map__stat-label">Blocked</span>
            </div>
          </div>
          <div className="shot-map__accuracy">
            <span>Accuracy</span>
            <motion.span
              className="shot-map__accuracy-value"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {awayAccuracy}%
            </motion.span>
          </div>
        </div>
      </div>

      {/* xG if available */}
      {statistics.expectedGoals && (
        <div className="shot-map__xg">
          <div className="shot-map__xg-item">
            <span className="shot-map__xg-value shot-map__xg-value--home">
              {statistics.expectedGoals.home.toFixed(2)}
            </span>
            <span className="shot-map__xg-label">xG</span>
            <span className="shot-map__xg-value shot-map__xg-value--away">
              {statistics.expectedGoals.away.toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
