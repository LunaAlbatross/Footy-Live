'use client';

import { motion } from 'framer-motion';
import { Match } from '@/types/football';
import { MapPin, Users, Info } from 'lucide-react';
import { cn, getStatusBadge } from '@/lib/utils';

interface Props {
  match: Match;
}

export function ScoreHeader({ match }: Props) {
  const isLive = match.status === 'LIVE' || match.status === 'IN_PLAY';
  const isFinished = match.status === 'FINISHED';

  return (
    <div className="flex flex-col">
      {/* Top Meta Bar */}
      <div className="px-6 py-3 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
        <div className="flex items-center gap-3">
          {match.competition.emblem && (
            <img src={match.competition.emblem} alt={match.competition.name} className="w-5 h-5 opacity-70" />
          )}
          <span className="text-xs font-semibold tracking-widest text-zinc-400 uppercase">{match.competition.name}</span>
        </div>
        <div className="flex items-center gap-2">
          {isLive && <span className="live-indicator" />}
          <span className={cn(
            "text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded",
            isLive ? "text-red-400 bg-red-400/10" : 
            isFinished ? "text-zinc-400 bg-white/5" : "text-emerald-400 bg-emerald-400/10"
          )}>
            {getStatusBadge(match.status)}
          </span>
        </div>
      </div>

      {/* Main Score Area */}
      <div className="px-8 py-10 flex items-center justify-between relative overflow-hidden bg-gradient-to-b from-transparent to-black/40">
        {/* Background team crests */}
        <div className="absolute -left-20 top-1/2 -translate-y-1/2 opacity-[0.03] blur-xl pointer-events-none">
          <img src={match.homeTeam.crest} className="w-96 h-96" />
        </div>
        <div className="absolute -right-20 top-1/2 -translate-y-1/2 opacity-[0.03] blur-xl pointer-events-none">
          <img src={match.awayTeam.crest} className="w-96 h-96" />
        </div>

        {/* Home Team */}
        <div className="flex flex-col items-center gap-4 w-1/3 z-10">
          <motion.img
            src={match.homeTeam.crest}
            alt={match.homeTeam.name}
            className="w-24 h-24 object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            whileHover={{ scale: 1.05 }}
          />
          <h2 className="text-2xl font-bold text-center leading-tight font-outfit">{match.homeTeam.name}</h2>
        </div>

        {/* Score Block */}
        <div className="flex flex-col items-center justify-center w-1/3 z-10">
          <div className="score-bug px-8 py-3 flex items-center justify-center gap-6 shadow-2xl">
            <motion.span
              key={`h-${match.score.fullTime.home}`}
              initial={{ scale: 1.2, color: '#10b981' }}
              animate={{ scale: 1, color: '#ffffff' }}
              className="text-6xl font-black font-mono tracking-tighter"
            >
              {match.score.fullTime.home ?? '-'}
            </motion.span>
            <span className="text-zinc-600 text-3xl font-light">-</span>
            <motion.span
              key={`a-${match.score.fullTime.away}`}
              initial={{ scale: 1.2, color: '#10b981' }}
              animate={{ scale: 1, color: '#ffffff' }}
              className="text-6xl font-black font-mono tracking-tighter"
            >
              {match.score.fullTime.away ?? '-'}
            </motion.span>
          </div>
          
          <div className="mt-4 flex flex-col items-center gap-2">
            {match.score.halfTime.home !== null && (
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">
                HT {match.score.halfTime.home}-{match.score.halfTime.away}
              </span>
            )}
            {isLive && match.minute && (
              <span className="text-sm font-bold text-red-500 animate-pulse tracking-widest">
                {match.minute}&apos;
              </span>
            )}
          </div>
        </div>

        {/* Away Team */}
        <div className="flex flex-col items-center gap-4 w-1/3 z-10">
          <motion.img
            src={match.awayTeam.crest}
            alt={match.awayTeam.name}
            className="w-24 h-24 object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            whileHover={{ scale: 1.05 }}
          />
          <h2 className="text-2xl font-bold text-center leading-tight font-outfit">{match.awayTeam.name}</h2>
        </div>
      </div>

      {/* Progress Bar (if live) */}
      {isLive && match.minute && (
        <div className="w-full h-1 bg-white/5 relative">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-red-500"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((match.minute / 90) * 100, 100)}%` }}
            transition={{ duration: 1 }}
          />
          <div className="absolute top-0 left-1/2 w-0.5 h-full bg-white/20" />
        </div>
      )}

      {/* Bottom Meta */}
      <div className="px-6 py-4 border-t border-white/5 bg-black/40 flex items-center justify-center gap-8 text-xs font-medium text-zinc-500">
        {match.venue && match.venue !== 'TBD' && (
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-zinc-400" />
            <span>{match.venue}</span>
          </div>
        )}
        {match.referee && (
          <div className="flex items-center gap-2">
            <Info size={14} className="text-zinc-400" />
            <span>Ref: {match.referee}</span>
          </div>
        )}
        {(match.attendance ?? 0) > 0 && (
          <div className="flex items-center gap-2">
            <Users size={14} className="text-zinc-400" />
            <span>{match.attendance?.toLocaleString()}</span>
          </div>
        )}
      </div>
    </div>
  );
}
