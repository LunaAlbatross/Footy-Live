'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/ui/Header';
import { FadeIn } from '@/components/ui/Animations';
import { Trophy, Globe2 } from 'lucide-react';
import { getCompetitions } from '@/lib/api';

interface Competition {
  id: number;
  name: string;
  code: string;
  type: string;
  emblem: string;
  area?: { name: string; flag?: string };
}

export default function LeaguesPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getCompetitions();
        setCompetitions(data);
      } catch (error) {
        console.warn('Error loading competitions:', error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen">
      <Header darkMode={true} toggleDarkMode={() => {}} />

      <main className="container mx-auto px-4 lg:px-6 py-8 space-y-8">
        {/* Page Header */}
        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl gradient-border">
            <div className="relative bg-gradient-to-br from-amber-950/30 via-slate-900/60 to-slate-900/40 p-8 md:p-10 rounded-3xl glass">
              <div className="absolute top-0 right-0 w-60 h-60 bg-amber-500/6 rounded-full blur-[80px] -translate-y-1/3 translate-x-1/3" />
              <div className="relative z-10 flex items-center gap-5">
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/15">
                  <Trophy className="w-8 h-8 text-amber-400" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Leagues</h1>
                  <p className="text-gray-400 mt-1">Explore competitions from around the world</p>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Competitions Grid */}
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="glass-card p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="skeleton w-12 h-12 rounded-xl" />
                  <div className="space-y-2 flex-1">
                    <div className="skeleton h-4 w-2/3" />
                    <div className="skeleton h-3 w-1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : competitions.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {competitions.map((comp, idx) => (
              <FadeIn key={comp.id} delay={idx * 0.04}>
                <motion.div
                  whileHover={{ y: -3 }}
                  className="glass-card p-5 cursor-default group"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      {comp.emblem ? (
                        <img src={comp.emblem} alt={comp.name} className="w-12 h-12 object-contain" />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                          <Trophy className="w-6 h-6 text-amber-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-white truncate">{comp.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {comp.area?.name && (
                          <span className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Globe2 className="w-3 h-3" />
                            {comp.area.name}
                          </span>
                        )}
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.04] text-gray-600 font-medium uppercase">
                          {comp.type}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        ) : (
          <div className="glass-card p-16 text-center">
            <Trophy className="w-12 h-12 text-gray-700 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">No competitions available</h3>
            <p className="text-gray-500">Competition data is not available at the moment</p>
          </div>
        )}
      </main>
    </div>
  );
}