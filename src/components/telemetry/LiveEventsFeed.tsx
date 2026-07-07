'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MatchEvent } from '@/types/football';
import { getEventIcon, formatMinute } from '@/lib/utils';

interface Props {
  events: MatchEvent[];
  homeTeamId: number;
  homeTeamName: string;
  awayTeamName: string;
}

export function LiveEventsFeed({ events, homeTeamId, homeTeamName, awayTeamName }: Props) {
  const sortedEvents = [...events].sort((a, b) => b.minute - a.minute);

  const getEventLabel = (event: MatchEvent) => {
    switch (event.type) {
      case 'goal': return 'GOAL';
      case 'penalty': return 'PENALTY';
      case 'own_goal': return 'OWN GOAL';
      case 'card':
        if (event.cardType === 'red') return 'RED CARD';
        if (event.cardType === 'yellow_red') return '2ND YELLOW';
        return 'YELLOW CARD';
      case 'substitution': return 'SUB';
      case 'var': return 'VAR';
      case 'foul': return 'FOUL';
      default: return (event.type as string).toUpperCase();
    }
  };

  const getEventAccent = (event: MatchEvent) => {
    switch (event.type) {
      case 'goal':
      case 'penalty': return 'event--goal';
      case 'own_goal': return 'event--own-goal';
      case 'card':
        if (event.cardType === 'red' || event.cardType === 'yellow_red') return 'event--red-card';
        return 'event--yellow-card';
      case 'substitution': return 'event--sub';
      case 'var': return 'event--var';
      default: return 'event--default';
    }
  };

  const isHome = (event: MatchEvent) => event.teamId === homeTeamId;

  return (
    <div className="telemetry-panel events-feed">
      <div className="panel-header">
        <h3 className="panel-title">
          <span className="panel-title-icon">📋</span>
          Match Events
        </h3>
        <span className="panel-count">{events.length}</span>
      </div>

      <div className="events-feed__list">
        <AnimatePresence>
          {sortedEvents.length === 0 ? (
            <div className="events-feed__empty">
              <span>No events yet</span>
            </div>
          ) : (
            sortedEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className={`events-feed__item ${getEventAccent(event)}`}
              >
                <div className="events-feed__minute">
                  {formatMinute(event.minute, event.extraMinute)}
                </div>
                <div className="events-feed__icon">{getEventIcon(event.type)}</div>
                <div className="events-feed__details">
                  <div className="events-feed__label">{getEventLabel(event)}</div>
                  <div className="events-feed__player">
                    {event.type === 'substitution' ? (
                      <>
                        <span className="events-feed__player-in">↑ {event.playerIn?.name}</span>
                        <span className="events-feed__player-out">↓ {event.playerOut?.name}</span>
                      </>
                    ) : (
                      <>
                        {event.playerName && <span>{event.playerName}</span>}
                        {event.assistPlayerName && (
                          <span className="events-feed__assist">Ast: {event.assistPlayerName}</span>
                        )}
                        {event.decision && (
                          <span className="events-feed__decision">{event.decision}</span>
                        )}
                        {event.reason && (
                          <span className="events-feed__reason">{event.reason}</span>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <div className={`events-feed__team-tag ${isHome(event) ? 'events-feed__team-tag--home' : 'events-feed__team-tag--away'}`}>
                  {isHome(event) ? homeTeamName : awayTeamName}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
