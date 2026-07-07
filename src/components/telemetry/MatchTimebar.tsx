'use client';

import { motion } from 'framer-motion';
import { MatchEvent } from '@/types/football';
import { getEventIcon, formatMinute } from '@/lib/utils';

interface Props {
  events: MatchEvent[];
  homeTeamId: number;
  currentMinute?: number;
}

export function MatchTimebar({ events, homeTeamId, currentMinute = 90 }: Props) {
  const isHome = (event: MatchEvent) => event.teamId === homeTeamId;

  return (
    <div className="telemetry-panel match-timebar">
      <div className="panel-header">
        <h3 className="panel-title">
          <span className="panel-title-icon">⏱️</span>
          Timeline
        </h3>
      </div>

      <div className="match-timebar__track">
        {/* Minute markers */}
        <div className="match-timebar__markers">
          {[0, 15, 30, 45, 60, 75, 90].map(min => (
            <div
              key={min}
              className="match-timebar__marker"
              style={{ left: `${(min / 90) * 100}%` }}
            >
              <span>{min}&apos;</span>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="match-timebar__bar">
          <motion.div
            className="match-timebar__bar-fill"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((currentMinute / 90) * 100, 100)}%` }}
            transition={{ duration: 1 }}
          />
          {/* Half time marker */}
          <div className="match-timebar__ht-marker" />
        </div>

        {/* Events on the timeline */}
        <div className="match-timebar__events">
          {events.map((event, idx) => (
            <motion.div
              key={event.id}
              className={`match-timebar__event ${isHome(event) ? 'match-timebar__event--home' : 'match-timebar__event--away'}`}
              style={{ left: `${Math.min((event.minute / 90) * 100, 100)}%` }}
              initial={{ opacity: 0, y: isHome(event) ? -10 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              title={`${formatMinute(event.minute, event.extraMinute)} - ${event.type}: ${event.playerName || ''}`}
            >
              <span className="match-timebar__event-icon">
                {getEventIcon(event.type)}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
