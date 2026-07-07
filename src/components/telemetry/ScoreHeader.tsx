'use client';

import { motion } from 'framer-motion';
import { Match } from '@/types/football';
import { PulseDot } from '@/components/ui/Animations';

interface Props {
  match: Match;
}

export function ScoreHeader({ match }: Props) {
  const isLive = match.status === 'LIVE' || match.status === 'IN_PLAY';
  const isPaused = match.status === 'PAUSED';
  const isFinished = match.status === 'FINISHED';

  return (
    <div className="telemetry-panel score-header">
      {/* Competition & Status Bar */}
      <div className="score-header__status-bar">
        <div className="score-header__competition">
          {match.competition.emblem && (
            <img
              src={match.competition.emblem}
              alt={match.competition.name}
              className="score-header__competition-emblem"
            />
          )}
          <span className="score-header__competition-name">{match.competition.name}</span>
        </div>
        <div className="score-header__match-status">
          {isLive && (
            <div className="score-header__live-badge">
              <PulseDot />
              <span>LIVE</span>
              {match.minute && <span className="score-header__minute">{match.minute}&apos;</span>}
            </div>
          )}
          {isPaused && (
            <div className="score-header__paused-badge">
              <span>HALF TIME</span>
            </div>
          )}
          {isFinished && (
            <div className="score-header__finished-badge">
              <span>FULL TIME</span>
            </div>
          )}
          {match.status === 'SCHEDULED' && (
            <div className="score-header__scheduled-badge">
              <span>UPCOMING</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Score Display */}
      <div className="score-header__main">
        {/* Home Team */}
        <div className="score-header__team score-header__team--home">
          <motion.img
            src={match.homeTeam.crest}
            alt={match.homeTeam.name}
            className="score-header__crest"
            whileHover={{ scale: 1.1, rotate: 5 }}
          />
          <div className="score-header__team-info">
            <span className="score-header__team-name">{match.homeTeam.name}</span>
            {match.homeLineup && (
              <span className="score-header__formation">{match.homeLineup.formation}</span>
            )}
          </div>
        </div>

        {/* Score */}
        <div className="score-header__score-block">
          <div className="score-header__score">
            <motion.span
              key={`h-${match.score.fullTime.home}`}
              initial={{ scale: 1.5, color: '#4ade80' }}
              animate={{ scale: 1, color: '#ffffff' }}
              className="score-header__score-num"
            >
              {match.score.fullTime.home ?? 0}
            </motion.span>
            <span className="score-header__score-separator">-</span>
            <motion.span
              key={`a-${match.score.fullTime.away}`}
              initial={{ scale: 1.5, color: '#4ade80' }}
              animate={{ scale: 1, color: '#ffffff' }}
              className="score-header__score-num"
            >
              {match.score.fullTime.away ?? 0}
            </motion.span>
          </div>
          {match.score.halfTime.home !== null && (
            <div className="score-header__ht">
              HT: {match.score.halfTime.home} - {match.score.halfTime.away}
            </div>
          )}
        </div>

        {/* Away Team */}
        <div className="score-header__team score-header__team--away">
          <div className="score-header__team-info score-header__team-info--away">
            <span className="score-header__team-name">{match.awayTeam.name}</span>
            {match.awayLineup && (
              <span className="score-header__formation">{match.awayLineup.formation}</span>
            )}
          </div>
          <motion.img
            src={match.awayTeam.crest}
            alt={match.awayTeam.name}
            className="score-header__crest"
            whileHover={{ scale: 1.1, rotate: -5 }}
          />
        </div>
      </div>

      {/* Match Progress Bar */}
      {isLive && match.minute && (
        <div className="score-header__progress">
          <div className="score-header__progress-track">
            <motion.div
              className="score-header__progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((match.minute / 90) * 100, 100)}%` }}
              transition={{ duration: 1 }}
            />
            {/* Half time marker */}
            <div className="score-header__progress-marker" style={{ left: '50%' }} />
          </div>
          <div className="score-header__progress-labels">
            <span>KO</span>
            <span>HT</span>
            <span>FT</span>
          </div>
        </div>
      )}

      {/* Match Info Strip */}
      <div className="score-header__info-strip">
        {match.venue && <span>📍 {match.venue}</span>}
        {match.referee && <span>👨‍⚖️ {match.referee}</span>}
        {match.attendance && <span>👥 {match.attendance.toLocaleString()}</span>}
      </div>
    </div>
  );
}
