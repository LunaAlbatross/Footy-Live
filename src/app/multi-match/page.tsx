'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/ui/Header';
import { MatchCard } from '@/components/match/MatchCard';
import { FadeIn } from '@/components/ui/Animations';
import { getTodaysMatches } from '@/lib/api';
import { Match } from '@/types/football';
import { LayoutDashboard, X, Grid3X3, List, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MultiMatchPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatches, setSelectedMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');

  useEffect(() => {
    async function load() {
      try {
        const data = await getTodaysMatches();
        setMatches(data);
      } catch (error) {
        console.warn('Failed to load matches:', error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function toggleSelectMatch(match: Match) {
    setSelectedMatches(prev => {
      const exists = prev.find(m => m.id === match.id);
      if (exists) return prev.filter(m => m.id !== match.id);
      if (prev.length >= 4) return prev;
      return [...prev, match];
    });
  }

  function clearSelection() {
    setSelectedMatches([]);
  }

  return (
    <div className="min-h-screen">
      <Header darkMode={true} toggleDarkMode={() => {}} />

      <main className="container mx-auto px-4 lg:px-6 py-8 space-y-8">
        {/* Page Header */}
        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl gradient-border">
            <div className="relative bg-gradient-to-br from-cyan-950/30 via-slate-900/60 to-slate-900/40 p-8 md:p-10 rounded-3xl glass">
              <div className="absolute top-0 right-0 w-60 h-60 bg-cyan-500/6 rounded-full blur-[80px] -translate-y-1/3 translate-x-1/3" />
              <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-5">
                  <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/15">
                    <Monitor className="w-8 h-8 text-cyan-400" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Multi-Match</h1>
                    <p className="text-gray-400 mt-1">Select up to 4 matches to monitor simultaneously</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      'p-2.5 rounded-xl transition-all border',
                      viewMode === 'grid'
                        ? 'bg-white/10 border-white/15 text-white'
                        : 'bg-white/[0.02] border-white/[0.04] text-gray-500 hover:text-gray-300'
                    )}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('compact')}
                    className={cn(
                      'p-2.5 rounded-xl transition-all border',
                      viewMode === 'compact'
                        ? 'bg-white/10 border-white/15 text-white'
                        : 'bg-white/[0.02] border-white/[0.04] text-gray-500 hover:text-gray-300'
                    )}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Selected Matches Bar */}
        {selectedMatches.length > 0 && (
          <FadeIn>
            <div className="glass-card p-5 neon-glow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/10">
                    <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-white font-semibold text-sm">
                    {selectedMatches.length}/4 match{selectedMatches.length > 1 ? 'es' : ''} selected
                  </span>
                </div>
                <button
                  onClick={clearSelection}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 text-sm font-medium transition-all border border-white/[0.06]"
                >
                  <X className="w-3.5 h-3.5" />
                  Clear
                </button>
              </div>
              <div className={cn(
                'grid gap-4',
                selectedMatches.length === 1 && 'grid-cols-1',
                selectedMatches.length === 2 && 'grid-cols-1 md:grid-cols-2',
                selectedMatches.length === 3 && 'grid-cols-1 md:grid-cols-3',
                selectedMatches.length >= 4 && 'grid-cols-1 md:grid-cols-2'
              )}>
                {selectedMatches.map((match) => (
                  <MatchCard key={match.id} match={match} compact={viewMode === 'compact'} />
                ))}
              </div>
            </div>
          </FadeIn>
        )}

        {/* Available Matches */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <div className="w-1.5 h-5 rounded-full bg-cyan-500" />
            {selectedMatches.length > 0 ? 'Add More Matches' : 'Available Matches'}
          </h2>

          {loading ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-card p-6 space-y-4">
                  <div className="skeleton h-4 w-1/3" />
                  <div className="skeleton h-10 w-full" />
                </div>
              ))}
            </div>
          ) : matches.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {matches.map((match, index) => {
                const isSelected = !!selectedMatches.find(m => m.id === match.id);
                return (
                  <FadeIn key={match.id} delay={index * 0.04}>
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className={cn(
                        'relative cursor-pointer transition-all rounded-2xl',
                        isSelected && 'ring-2 ring-emerald-500/50'
                      )}
                      onClick={() => toggleSelectMatch(match)}
                    >
                      {isSelected && (
                        <div className="absolute -top-2 -right-2 z-10">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                            <LayoutDashboard className="w-3.5 h-3.5 text-white" />
                          </div>
                        </div>
                      )}
                      <MatchCard match={match} compact />
                    </motion.div>
                  </FadeIn>
                );
              })}
            </div>
          ) : (
            <div className="glass-card p-16 text-center">
              <Monitor className="w-12 h-12 text-gray-700 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">No matches available</h3>
              <p className="text-gray-500">Check back later for live and upcoming matches</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}