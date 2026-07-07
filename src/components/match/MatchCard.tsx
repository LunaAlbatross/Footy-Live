'use client';

import { motion } from 'framer-motion';
import { Clock, MapPin, Users, ChevronRight } from 'lucide-react';
import { Match } from '@/types/football';
import { formatTime, formatDate, getStatusBadge, cn } from '@/lib/utils';
import Link from 'next/link';

interface Props {
  match: Match;
  compact?: boolean;
  onSelect?: (match: Match) => void;
}

export function MatchCard({ match, compact = false, onSelect }: Props) {
  const isLive = match.status === 'LIVE' || match.status === 'IN_PLAY';
  const isFinished = match.status === 'FINISHED';

  if (compact) {
    return (
      <Link href={`/match/${match.id}`}>
        <motion.div className="telemetry-card p-3 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isLive && <span className="live-indicator" />}
            <span className="text-xs font-semibold text-zinc-400">{match.competition.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold">{match.homeTeam.shortName}</span>
            <div className="score-bug px-3 py-1 flex items-center gap-2 font-mono text-sm">
              <span className={cn("font-bold", isLive ? "text-white" : "text-zinc-300")}>{match.score.fullTime.home ?? '-'}</span>
              <span className="text-zinc-600">-</span>
              <span className={cn("font-bold", isLive ? "text-white" : "text-zinc-300")}>{match.score.fullTime.away ?? '-'}</span>
            </div>
            <span className="text-sm font-semibold">{match.awayTeam.shortName}</span>
          </div>
        </motion.div>
      </Link>
    );
  }

  return (
    <Link href={`/match/${match.id}`}>
      <motion.div className="telemetry-card flex flex-col h-full cursor-pointer group overflow-hidden">
        {/* Top Meta Bar */}
        <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-2">
            {match.competition.emblem && (
              <img src={match.competition.emblem} alt={match.competition.name} className="w-4 h-4 opacity-50 grayscale group-hover:grayscale-0 transition-all" />
            )}
            <span className="text-xs font-medium tracking-wide text-zinc-400 uppercase">{match.competition.name}</span>
          </div>
          <div className="flex items-center gap-2">
            {isLive && <span className="live-indicator" />}
            <span className={cn(
              "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm",
              isLive ? "text-red-400 bg-red-400/10" : 
              isFinished ? "text-zinc-500 bg-white/5" : "text-emerald-400 bg-emerald-400/10"
            )}>
              {getStatusBadge(match.status)}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 flex-1 flex items-center justify-between">
          {/* Home Team */}
          <div className="flex flex-col items-center gap-3 w-1/3">
            <div className="relative">
              <div className="absolute inset-0 bg-white/5 blur-xl rounded-full scale-150" />
              <img src={match.homeTeam.crest} alt={match.homeTeam.name} className="w-14 h-14 object-contain relative z-10 drop-shadow-2xl" />
            </div>
            <h3 className="text-sm font-semibold text-center leading-tight line-clamp-2">{match.homeTeam.shortName}</h3>
          </div>

          {/* Score/Time Bug */}
          <div className="flex flex-col items-center justify-center w-1/3">
            <div className="score-bug px-5 py-2 flex items-center justify-center gap-3 w-full max-w-[120px]">
              <span className="text-3xl font-bold font-mono tracking-tighter">{match.score.fullTime.home ?? '-'}</span>
              <span className="text-zinc-600 text-xl font-light">-</span>
              <span className="text-3xl font-bold font-mono tracking-tighter">{match.score.fullTime.away ?? '-'}</span>
            </div>
            
            <div className="mt-3 flex flex-col items-center gap-1">
              {match.score.halfTime.home !== null && (
                <span className="text-[10px] font-medium text-zinc-500 uppercase">
                  HT {match.score.halfTime.home}-{match.score.halfTime.away}
                </span>
              )}
              {isLive && match.minute && (
                <span className="text-xs font-bold text-red-500 animate-pulse">
                  {match.minute}&apos;
                </span>
              )}
            </div>
          </div>

          {/* Away Team */}
          <div className="flex flex-col items-center gap-3 w-1/3">
            <div className="relative">
              <div className="absolute inset-0 bg-white/5 blur-xl rounded-full scale-150" />
              <img src={match.awayTeam.crest} alt={match.awayTeam.name} className="w-14 h-14 object-contain relative z-10 drop-shadow-2xl" />
            </div>
            <h3 className="text-sm font-semibold text-center leading-tight line-clamp-2">{match.awayTeam.shortName}</h3>
          </div>
        </div>

        {/* Footer Meta */}
        <div className="px-4 py-3 border-t border-white/5 bg-black/20 flex items-center justify-between mt-auto">
          <div className="flex items-center gap-3 text-[11px] font-medium text-zinc-500">
            {match.venue && match.venue !== 'TBD' && (
              <div className="flex items-center gap-1">
                <MapPin size={12} />
                <span className="truncate max-w-[100px]">{match.venue}</span>
              </div>
            )}
            {(match.attendance ?? 0) > 0 && (
              <div className="flex items-center gap-1">
                <Users size={12} />
                <span>{match.attendance?.toLocaleString()}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-medium text-zinc-500 group-hover:text-emerald-400 transition-colors">
            <Clock size={12} />
            <span>{formatTime(match.utcDate)} • {formatDate(match.utcDate)}</span>
            <ChevronRight size={14} className="ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}