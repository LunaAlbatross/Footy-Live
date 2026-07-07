'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MatchCard } from '@/components/match/MatchCard';
import { FadeIn } from '@/components/ui/Animations';
import { Activity, Calendar, Trophy, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { getTodaysMatches } from '@/lib/api';
import { Match } from '@/types/football';
import { cn } from '@/lib/utils';

export default function Home() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'live' | 'scheduled' | 'finished'>('all');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadMatches = async () => {
    try {
      setLoading(true);
      const data = await getTodaysMatches();
      setMatches(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.warn('Error loading matches:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMatches();
    const interval = setInterval(loadMatches, 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredMatches = matches.filter(match => {
    if (filter === 'all') return true;
    if (filter === 'live') return match.status === 'LIVE' || match.status === 'IN_PLAY';
    if (filter === 'scheduled') return match.status === 'SCHEDULED';
    if (filter === 'finished') return match.status === 'FINISHED';
    return true;
  });

  const liveMatches = matches.filter(m => m.status === 'LIVE' || m.status === 'IN_PLAY');

  const stats = [
    { label: 'Live Telemetry', value: liveMatches.length, icon: <Activity size={18} className="text-red-500" /> },
    { label: 'Upcoming', value: matches.filter(m => m.status === 'SCHEDULED').length, icon: <Calendar size={18} className="text-emerald-500" /> },
    { label: 'Competitions', value: new Set(matches.map(m => m.competition.id)).size, icon: <Trophy size={18} className="text-blue-500" /> },
  ];

  const filterTabs = [
    { key: 'all' as const, label: 'All Matches' },
    { key: 'live' as const, label: 'Live', badge: liveMatches.length },
    { key: 'scheduled' as const, label: 'Scheduled' },
    { key: 'finished' as const, label: 'Finished' },
  ];

  return (
    <main className="container mx-auto px-6 py-8">
      {/* Telemetry Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            {liveMatches.length > 0 ? (
              <span className="live-indicator" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
            )}
            <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
              {liveMatches.length > 0 ? 'Live Feed Active' : 'System Ready'}
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white font-outfit">Match Control Center</h1>
          <p className="text-sm text-zinc-500 max-w-lg">
            Real-time football data pipeline. Select a match to view advanced telemetry, possession donuts, and timeline events.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {lastUpdated && (
            <div className="telemetry-card px-3 py-1.5 flex items-center gap-2 text-xs font-medium text-zinc-400 rounded-md">
              <Wifi size={14} className="text-emerald-500" />
              Sync: {lastUpdated.toLocaleTimeString()}
            </div>
          )}
          <button
            onClick={loadMatches}
            className="telemetry-card p-2 hover:text-white text-zinc-400 transition-colors rounded-md"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Meta Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {stats.map((stat, idx) => (
          <FadeIn key={stat.label} delay={idx * 0.1}>
            <div className="telemetry-card p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center">
                  {stat.icon}
                </div>
                <span className="text-sm font-medium text-zinc-400">{stat.label}</span>
              </div>
              <span className="text-2xl font-bold font-mono text-white">{stat.value}</span>
            </div>
          </FadeIn>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {filterTabs.map((tab) => {
          const isActive = filter === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={cn(
                'relative px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap',
                isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
              )}
            >
              {isActive && (
                <motion.div 
                  layoutId="filter-active-tab"
                  className="absolute inset-0 rounded-md border border-white/10 bg-white/5 pointer-events-none"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {tab.label}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className={cn(
                    "px-1.5 py-0.5 rounded text-[10px] font-bold",
                    isActive ? "bg-red-500/20 text-red-400" : "bg-zinc-800 text-zinc-500"
                  )}>
                    {tab.badge}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* Match Grid */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="telemetry-card p-6 h-[200px] flex flex-col justify-between animate-pulse">
              <div className="h-4 bg-white/5 w-1/3 rounded" />
              <div className="flex justify-between items-center">
                <div className="w-12 h-12 rounded-full bg-white/5" />
                <div className="h-8 bg-white/5 w-1/4 rounded" />
                <div className="w-12 h-12 rounded-full bg-white/5" />
              </div>
              <div className="h-4 bg-white/5 w-full rounded" />
            </div>
          ))}
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {filteredMatches.length > 0 ? (
            <motion.div
              key={filter}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {filteredMatches.map((match, index) => (
                <FadeIn key={match.id} delay={index * 0.05}>
                  <MatchCard match={match} />
                </FadeIn>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="telemetry-card p-12 text-center max-w-lg mx-auto mt-8 border-dashed border-white/20"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
                <WifiOff className="w-8 h-8 text-zinc-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 font-outfit">No Telemetry Signal</h3>
              <p className="text-sm text-zinc-500">
                {filter === 'all'
                  ? 'There are no match signals scheduled for the coming days.'
                  : `No ${filter} matches transmitting at the moment.`}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </main>
  );
}