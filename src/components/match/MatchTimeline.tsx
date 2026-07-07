'use client';

import { motion } from 'framer-motion';
import { MatchEvent } from '@/types/football';
import { formatMinute, getEventIcon, getEventColor, cn } from '@/lib/utils';

interface Props {
  events: MatchEvent[];
  homeTeamName: string;
  awayTeamName: string;
}

export function MatchTimeline({ events, homeTeamName, awayTeamName }: Props) {
  const sortedEvents = [...events].sort((a, b) => {
    if (a.minute !== b.minute) return a.minute - b.minute;
    return (a.extraMinute || 0) - (b.extraMinute || 0);
  });

  const getEventDetails = (event: MatchEvent) => {
    switch (event.type) {
      case 'goal':
        return {
          title: 'Goal',
          description: event.playerName,
          subtitle: event.assistPlayerName ? `Assist: ${event.assistPlayerName}` : undefined,
        };
      case 'penalty':
        return {
          title: 'Penalty Goal',
          description: event.playerName,
        };
      case 'own_goal':
        return {
          title: 'Own Goal',
          description: event.playerName,
        };
      case 'card':
        return {
          title: event.cardType === 'red' ? 'Red Card' : event.cardType === 'yellow_red' ? 'Second Yellow' : 'Yellow Card',
          description: event.playerName,
          subtitle: event.reason,
        };
      case 'substitution':
        return {
          title: 'Substitution',
          description: event.playerIn?.name,
          subtitle: event.playerOut?.name ? `Out: ${event.playerOut.name}` : undefined,
        };
      case 'var':
        return {
          title: 'VAR Review',
          description: event.decision || 'Review completed',
        };
      default:
        return {
          title: event.type.charAt(0).toUpperCase() + event.type.slice(1),
          description: event.playerName || event.reason,
        };
    }
  };

  const getEventIconComponent = (event: MatchEvent) => {
    const icon = getEventIcon(event.type);
    if (event.type === 'card') {
      if (event.cardType === 'red') return '🟥';
      if (event.cardType === 'yellow_red') return '🟥';
      return '🟨';
    }
    return icon;
  };

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-500/50 via-green-500/30 to-transparent" />

      <div className="space-y-4">
        {sortedEvents.map((event, index) => {
          const details = getEventDetails(event);
          const isHome = event.teamId % 2 === 1;

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: isHome ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                'relative flex items-start gap-4 p-4 rounded-xl transition-all hover:bg-white/5',
                isHome ? 'flex-row' : 'flex-row-reverse'
              )}
            >
              {/* Timeline dot */}
              <div className={cn(
                'absolute left-8 top-6 w-4 h-4 -ml-2 rounded-full border-2 border-black shadow-lg z-10',
                getEventColor(event.type)
              )} />

              {/* Time badge */}
              <div className="w-16 flex-shrink-0 text-center">
                <div className="text-sm font-bold text-white bg-white/10 rounded-lg px-2 py-1">
                  {formatMinute(event.minute, event.extraMinute)}
                </div>
              </div>

              {/* Event card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={cn(
                  'flex-1 p-4 rounded-xl border backdrop-blur-sm',
                  isHome 
                    ? 'bg-gradient-to-br from-green-500/10 to-transparent border-green-500/20' 
                    : 'bg-gradient-to-br from-red-500/10 to-transparent border-red-500/20'
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{getEventIconComponent(event)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-white">{details.title}</span>
                      <span className={cn(
                        'text-xs px-2 py-0.5 rounded-full',
                        isHome ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      )}>
                        {isHome ? homeTeamName : awayTeamName}
                      </span>
                    </div>
                    {details.description && (
                      <p className="text-base font-medium text-white">{details.description}</p>
                    )}
                    {details.subtitle && (
                      <p className="text-sm text-gray-400 mt-1">{details.subtitle}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })}

        {sortedEvents.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">📝</div>
            <p className="text-gray-400">No events yet</p>
            <p className="text-sm text-gray-500 mt-1">Match events will appear here</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}