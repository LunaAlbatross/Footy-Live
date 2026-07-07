'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/ui/Header';
import { MatchCard } from '@/components/match/MatchCard';
import { FadeIn } from '@/components/ui/Animations';
import { Zap, Calendar, CheckCircle2, Trophy, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { getTodaysMatches } from '@/lib/api';
import { Match } from '@/types/football';
import { cn } from '@/lib/utils';

export default function Home() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'live' | 'scheduled' | 'finished'>('all');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadMatches = async (showLoading = false) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
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
    const timer = setTimeout(() => {
      loadMatches(false);
    }, 0);
    const interval = setInterval(() => loadMatches(false), 30000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
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
    {
      icon: Zap,
      label: 'Live Now',
      value: liveMatches.length,
      gradient: 'from-red-500 to-orange-500',
      glow: 'shadow-red-500/20',
      bg: 'bg-red-500/10',
      text: 'text-red-400',
    },
    {
      icon: Calendar,
      label: 'Upcoming',
      value: matches.filter(m => m.status === 'SCHEDULED').length,
      gradient: 'from-blue-500 to-cyan-500',
      glow: 'shadow-blue-500/20',
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
    },
    {
      icon: CheckCircle2,
      label: 'Finished',
      value: matches.filter(m => m.status === 'FINISHED').length,
      gradient: 'from-emerald-500 to-green-500',
      glow: 'shadow-emerald-500/20',
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
    },
    {
      icon: Trophy,
      label: 'Competitions',
      value: new Set(matches.map(m => m.competition.id)).size,
      gradient: 'from-violet-500 to-purple-500',
      glow: 'shadow-violet-500/20',
      bg: 'bg-violet-500/10',
      text: 'text-violet-400',
    },
  ];

  const filterTabs = [
    { key: 'all' as const, label: 'All Matches' },
    { key: 'live' as const, label: 'Live', badge: liveMatches.length },
    { key: 'scheduled' as const, label: 'Scheduled' },
    { key: 'finished' as const, label: 'Finished' },
  ];

  return (
    <div className="min-h-screen">
      <Header darkMode={true} toggleDarkMode={() => {}} />

      <main className="container mx-auto px-4 lg:px-6 py-8 space-y-8">
        {/* Hero Section */}
        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl gradient-border">
            <div className="relative bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-800/40 p-8 md:p-12 rounded-3xl glass">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] -translate-y-1/3 translate-x-1/3" />
              <div className="absolute bottom-0 left-0 w-60 h-60 bg-violet-500/8 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3" />
              <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-blue-500/5 rounded-full blur-[60px] -translate-x-1/2 -translate-y-1/2" />

              <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div className="space-y-4">
                  {/* Live indicator */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold"
                  >
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
                    </span>
                    {liveMatches.length > 0 ? `${liveMatches.length} Live Now` : 'Monitoring'}
                  </motion.div>

                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
                    <span className="text-white">Match </span>
                    <span className="gradient-text">Intelligence</span>
                  </h1>

                  <p className="text-lg text-gray-400 max-w-xl leading-relaxed">
                    Real-time statistics, live telemetry, formations, and predictions —
                    all in one premium experience.
                  </p>
                </div>

                {/* Connection status */}
                <div className="flex items-center gap-3">
                  {lastUpdated && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-gray-500">
                      <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Updated {lastUpdated.toLocaleTimeString()}</span>
                    </div>
                  )}
                  <motion.button
                    whileTap={{ rotate: 180 }}
                    onClick={() => loadMatches(true)}
                    className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-colors"
                  >
                    <RefreshCw className={`w-4 h-4 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <FadeIn key={stat.label} delay={idx * 0.08}>
              <div className="glass-card p-5 group cursor-default">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2.5 rounded-xl ${stat.bg} transition-colors`}>
                    <stat.icon className={`w-4.5 h-4.5 ${stat.text}`} />
                  </div>
                  <span className="text-sm text-gray-500 font-medium">{stat.label}</span>
                </div>
                <motion.div
                  key={stat.value}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-3xl font-extrabold text-white tracking-tight"
                >
                  {stat.value}
                </motion.div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={cn(
                'relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap',
                filter === tab.key
                  ? 'text-white'
                  : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.03]'
              )}
            >
              {filter === tab.key && (
                <motion.div
                  layoutId="filter-active"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/15 to-emerald-500/5 border border-emerald-500/20"
                  transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="relative z-10 px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs font-bold">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Matches */}
        {loading ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="glass-card p-6 space-y-4">
                <div className="skeleton h-4 w-1/3" />
                <div className="flex items-center justify-between">
                  <div className="skeleton h-10 w-10 rounded-full" />
                  <div className="skeleton h-8 w-20" />
                  <div className="skeleton h-10 w-10 rounded-full" />
                </div>
                <div className="skeleton h-3 w-2/3 mx-auto" />
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
                transition={{ duration: 0.3 }}
                className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
              >
                {filteredMatches.map((match, index) => (
                  <FadeIn key={match.id} delay={index * 0.06}>
                    <MatchCard match={match} />
                  </FadeIn>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-24"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/[0.03] border border-white/[0.06] mb-6">
                  <WifiOff className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">No matches found</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  {filter === 'all'
                    ? 'There are no matches scheduled for the coming days'
                    : `No ${filter} matches at the moment`}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}