'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/ui/Header';
import { MatchCard } from '@/components/match/MatchCard';
import { FadeIn } from '@/components/ui/Animations';
import { Calendar } from 'lucide-react';
import { getTodaysMatches } from '@/lib/api';
import { Match } from '@/types/football';

export default function FixturesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getTodaysMatches();
        setMatches(data);
      } catch (error) {
        console.warn('Error loading fixtures:', error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const scheduledMatches = matches.filter(m => m.status === 'SCHEDULED');
  const finishedMatches = matches.filter(m => m.status === 'FINISHED');
  const liveMatches = matches.filter(m => m.status === 'LIVE' || m.status === 'IN_PLAY');

  return (
    <div className="min-h-screen">
      <Header darkMode={true} toggleDarkMode={() => {}} />

      <main className="container mx-auto px-4 lg:px-6 py-8 space-y-8">
        {/* Page Header */}
        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl gradient-border">
            <div className="relative bg-gradient-to-br from-blue-950/40 via-slate-900/60 to-slate-900/40 p-8 md:p-10 rounded-3xl glass">
              <div className="absolute top-0 right-0 w-60 h-60 bg-blue-500/8 rounded-full blur-[80px] -translate-y-1/3 translate-x-1/3" />
              <div className="relative z-10 flex items-center gap-5">
                <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/15">
                  <Calendar className="w-8 h-8 text-blue-400" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Fixtures</h1>
                  <p className="text-gray-400 mt-1">Browse upcoming and recent matches across all competitions</p>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Live Matches Section */}
        {liveMatches.length > 0 && (
          <FadeIn delay={0.1}>
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-400" />
                </span>
                Live Now
              </h2>
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {liveMatches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            </div>
          </FadeIn>
        )}

        {/* Scheduled Matches */}
        <FadeIn delay={0.2}>
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <div className="w-1.5 h-5 rounded-full bg-blue-500" />
              Upcoming Matches
            </h2>
            {loading ? (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="glass-card p-6 space-y-4">
                    <div className="skeleton h-4 w-1/3" />
                    <div className="skeleton h-10 w-full" />
                    <div className="skeleton h-3 w-2/3" />
                  </div>
                ))}
              </div>
            ) : scheduledMatches.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {scheduledMatches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            ) : (
              <div className="glass-card p-12 text-center">
                <Calendar className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                <p className="text-gray-500">No upcoming matches scheduled</p>
              </div>
            )}
          </div>
        </FadeIn>

        {/* Finished Matches */}
        <FadeIn delay={0.3}>
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <div className="w-1.5 h-5 rounded-full bg-emerald-500" />
              Recent Results
            </h2>
            {finishedMatches.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {finishedMatches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            ) : (
              <div className="glass-card p-12 text-center">
                <p className="text-gray-500">No recent results</p>
              </div>
            )}
          </div>
        </FadeIn>
      </main>
    </div>
  );
}