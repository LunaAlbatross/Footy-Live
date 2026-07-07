'use client';

import { motion } from 'framer-motion';
import { Clock, MapPin, Users, ChevronRight } from 'lucide-react';
import { Match } from '@/types/football';
import { formatTime, formatDate, getStatusBadge, cn } from '@/lib/utils';
import { PulseDot } from '@/components/ui/Animations';
import Link from 'next/link';

interface Props {
  match: Match;
  compact?: boolean;
}

function StatusBadge({ status }: { status: string }) {
  const isLive = status === 'LIVE' || status === 'IN_PLAY';
  const isFinished = status === 'FINISHED';
  const isScheduled = status === 'SCHEDULED';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg',
        isLive && 'bg-red-500/15 text-red-400 border border-red-500/20',
        isFinished && 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20',
        isScheduled && 'bg-blue-500/15 text-blue-400 border border-blue-500/20',
        !isLive && !isFinished && !isScheduled && 'bg-gray-500/15 text-gray-400 border border-gray-500/20'
      )}
    >
      {isLive && <PulseDot className="!h-2 !w-2" />}
      {getStatusBadge(status)}
    </span>
  );
}

export function MatchCard({ match, compact = false }: Props) {
  const isLive = match.status === 'LIVE' || match.status === 'IN_PLAY';

  if (compact) {
    return (
      <Link href={`/match/${match.id}`}>
        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          className="glass-card p-4 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <StatusBadge status={match.status} />
            {match.competition.emblem && (
              <img src={match.competition.emblem} alt={match.competition.name} className="w-5 h-5 object-contain opacity-50 group-hover:opacity-80 transition-opacity" />
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 flex-1">
              <img src={match.homeTeam.crest} alt={match.homeTeam.name} className="w-7 h-7 object-contain" />
              <span className="text-sm font-semibold text-white truncate">{match.homeTeam.shortName}</span>
            </div>
            <div className="flex items-center gap-2 px-3">
              <span className="text-xl font-extrabold text-white tabular-nums">
                {match.score.fullTime.home ?? '-'}
              </span>
              <span className="text-gray-600 text-sm">:</span>
              <span className="text-xl font-extrabold text-white tabular-nums">
                {match.score.fullTime.away ?? '-'}
              </span>
            </div>
            <div className="flex items-center gap-2.5 flex-1 justify-end">
              <span className="text-sm font-semibold text-white truncate">{match.awayTeam.shortName}</span>
              <img src={match.awayTeam.crest} alt={match.awayTeam.name} className="w-7 h-7 object-contain" />
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-gray-600">
            <span>{match.competition.name}</span>
            {isLive && match.minute && (
              <span className="text-red-400 font-bold">{match.minute}&apos;</span>
            )}
          </div>
        </motion.div>
      </Link>
    );
  }

  return (
    <Link href={`/match/${match.id}`}>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="glass-card overflow-hidden cursor-pointer group"
      >
        {/* Top gradient accent bar */}
        <div className={cn(
          'h-1 w-full',
          isLive
            ? 'bg-gradient-to-r from-red-500 via-orange-500 to-red-500'
            : match.status === 'FINISHED'
              ? 'bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-500'
              : 'bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500'
        )} />

        <div className="p-5 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <StatusBadge status={match.status} />
            <div className="flex items-center gap-2 text-gray-500 group-hover:text-gray-400 transition-colors">
              {match.competition.emblem && (
                <img src={match.competition.emblem} alt={match.competition.name} className="w-5 h-5 object-contain opacity-60" />
              )}
              <span className="text-xs font-medium">{match.competition.name}</span>
            </div>
          </div>

          {/* Teams & Score */}
          <div className="flex items-center justify-between py-2">
            {/* Home */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <motion.img
                whileHover={{ rotate: 10, scale: 1.15 }}
                transition={{ type: 'spring' }}
                src={match.homeTeam.crest}
                alt={match.homeTeam.name}
                className="w-11 h-11 object-contain flex-shrink-0"
              />
              <div className="min-w-0">
                <h3 className="text-base font-bold text-white truncate">{match.homeTeam.shortName}</h3>
                {match.homeLineup && (
                  <span className="text-[10px] text-gray-600 font-medium">{match.homeLineup.formation}</span>
                )}
              </div>
            </div>

            {/* Score */}
            <div className="flex flex-col items-center px-5">
              <div className="flex items-center gap-2.5">
                <motion.span
                  key={`h-${match.score.fullTime.home}`}
                  initial={{ scale: 1.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-3xl font-black text-white tabular-nums"
                >
                  {match.score.fullTime.home ?? '-'}
                </motion.span>
                <span className="text-xl text-gray-700 font-light">:</span>
                <motion.span
                  key={`a-${match.score.fullTime.away}`}
                  initial={{ scale: 1.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-3xl font-black text-white tabular-nums"
                >
                  {match.score.fullTime.away ?? '-'}
                </motion.span>
              </div>
              {match.score.halfTime.home !== null && (
                <span className="text-[10px] text-gray-600 mt-0.5">
                  HT: {match.score.halfTime.home}-{match.score.halfTime.away}
                </span>
              )}
              {isLive && match.minute && (
                <span className="text-xs text-red-400 font-bold mt-1">{match.minute}&apos;</span>
              )}
            </div>

            {/* Away */}
            <div className="flex items-center gap-3 flex-1 min-w-0 justify-end">
              <div className="min-w-0 text-right">
                <h3 className="text-base font-bold text-white truncate">{match.awayTeam.shortName}</h3>
                {match.awayLineup && (
                  <span className="text-[10px] text-gray-600 font-medium">{match.awayLineup.formation}</span>
                )}
              </div>
              <motion.img
                whileHover={{ rotate: -10, scale: 1.15 }}
                transition={{ type: 'spring' }}
                src={match.awayTeam.crest}
                alt={match.awayTeam.name}
                className="w-11 h-11 object-contain flex-shrink-0"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
            <div className="flex items-center gap-3 text-[11px] text-gray-600">
              {match.venue && match.venue !== 'TBD' && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate max-w-[120px]">{match.venue}</span>
                </div>
              )}
              {(match.attendance ?? 0) > 0 && (
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {match.attendance?.toLocaleString()}
                </div>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-gray-600">
              <Clock className="w-3 h-3" />
              {formatTime(match.utcDate)} • {formatDate(match.utcDate)}
              <ChevronRight className="w-3.5 h-3.5 text-gray-700 group-hover:text-emerald-400 transition-colors ml-1" />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}