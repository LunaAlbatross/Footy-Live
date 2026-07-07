'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Activity, Info } from 'lucide-react';
import { getMatchById, getMockMatch } from '@/lib/api';
import { Match } from '@/types/football';
import { ScoreHeader } from '@/components/telemetry/ScoreHeader';
import { LiveEventsFeed } from '@/components/telemetry/LiveEventsFeed';
import { StatsPanel } from '@/components/telemetry/StatsPanel';
import { FormationPitch } from '@/components/telemetry/FormationPitch';
import { MomentumChart } from '@/components/telemetry/MomentumChart';
import { PossessionDonut } from '@/components/telemetry/PossessionDonut';
import { ShotMap } from '@/components/telemetry/ShotMap';
import { MatchTimebar } from '@/components/telemetry/MatchTimebar';
import { FadeIn } from '@/components/ui/Animations';
import '@/app/telemetry.css';

export default function MatchTelemetryPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const matchId = parseInt(params.id as string);
  const isDemo = searchParams.get('demo') === 'true';
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);

  const loadMatch = useCallback(async () => {
    try {
      if (isDemo) {
        // Load high-fidelity mock data (Barcelona vs Real Madrid) for LinkedIn demo!
        setMatch(getMockMatch(2));
      } else {
        const data = await getMatchById(matchId);
        if (data) {
          setMatch(data);
        }
      }
    } catch (err) {
      console.error('Failed to load match:', err);
    } finally {
      setLoading(false);
    }
  }, [matchId, isDemo]);

  useEffect(() => {
    loadMatch();
    const interval = setInterval(loadMatch, 10000);
    return () => clearInterval(interval);
  }, [loadMatch]);

  if (loading || !match) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 rounded-full border-4 border-white/10 border-t-emerald-500 animate-spin mb-4" />
        <p className="text-zinc-500 text-sm font-medium tracking-widest uppercase">Initializing Telemetry...</p>
      </div>
    );
  }

  const homeColor = match.homeTeam.colors?.primary || '#10b981';
  const awayColor = match.awayTeam.colors?.primary || '#3b82f6';
  
  const hasTelemetry = match.events?.length || match.statistics || match.homeLineup;

  return (
    <main className="container mx-auto px-4 lg:px-6 py-2 max-w-[98%] h-[calc(100vh-80px)] flex flex-col">
      <FadeIn className="flex-1 flex flex-col min-h-0">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-3 shrink-0">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft size={16} />
            Back to Hub
          </Link>
          <div className="flex items-center gap-2">
            <Activity size={14} className="text-emerald-500" />
            <span className="text-xs font-semibold text-emerald-500 uppercase tracking-widest">Telemetry Active</span>
          </div>
        </div>

        {/* Main Dashboard Layout */}
        <div className="flex-1 flex flex-col min-h-0 gap-4">
          
          {/* TOP SECTION: Score, Timeline & Tactical Shape */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 shrink-0">
            {/* Left/Center: Score & Timeline (8 cols) */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              <div className="telemetry-card overflow-hidden shrink-0">
                <ScoreHeader match={match} />
              </div>
              <div className="telemetry-card p-4 shrink-0">
                <MatchTimebar
                  events={match.events || []}
                  homeTeamId={match.homeTeam.id}
                  currentMinute={match.minute || 90}
                />
              </div>
            </div>

            {/* Right: Tactical Shape (4 cols) */}
            <div className="lg:col-span-4 flex flex-col h-full">
              {match.homeLineup && match.awayLineup ? (
                <div className="telemetry-card overflow-hidden flex-1 flex flex-col min-h-0 bg-gradient-to-b from-[#111] to-[#0a0a0a]">
                  <div className="flex-1 overflow-hidden p-2 flex items-center justify-center">
                    <FormationPitch
                      homeLineup={match.homeLineup}
                      awayLineup={match.awayLineup}
                      homeTeamName={match.homeTeam.shortName}
                      awayTeamName={match.awayTeam.shortName}
                      homeColor={homeColor}
                      awayColor={awayColor}
                    />
                  </div>
                </div>
              ) : (
                <div className="telemetry-card flex-1 flex items-center justify-center border-dashed">
                  <span className="text-sm text-zinc-500 uppercase tracking-widest font-bold">Lineups Unavailable</span>
                </div>
              )}
            </div>
          </div>

          {!hasTelemetry && (
            <div className="telemetry-card p-8 flex flex-col items-center justify-center text-center mt-4 border-dashed flex-1">
              <Info className="w-8 h-8 text-zinc-500 mb-3" />
              <h3 className="text-lg font-semibold text-white mb-1">Advanced Telemetry Unavailable</h3>
              <p className="text-sm text-zinc-500 max-w-md">
                Detailed event tracking and statistics are not provided by the current API tier for this match.
              </p>
            </div>
          )}

          {/* BOTTOM SECTION: Events, Momentum, Stats */}
          {hasTelemetry && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0">
              {/* Event Log (3/12) */}
              <div className="lg:col-span-3 flex flex-col min-h-0">
                <div className="telemetry-card flex-1 overflow-hidden flex flex-col">
                  <div className="px-4 py-2 border-b border-white/10 bg-white/5 shrink-0">
                    <h3 className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider">Event Log</h3>
                  </div>
                  <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
                    <LiveEventsFeed
                      events={match.events || []}
                      homeTeamId={match.homeTeam.id}
                      homeTeamName={match.homeTeam.shortName}
                      awayTeamName={match.awayTeam.shortName}
                    />
                  </div>
                </div>
              </div>

              {/* Match Momentum (5/12) */}
              <div className="lg:col-span-5 flex flex-col min-h-0">
                <div className="telemetry-card overflow-hidden flex-1 flex flex-col">
                  <div className="px-4 py-2 border-b border-white/10 bg-white/5 shrink-0">
                    <h3 className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider">Match Momentum</h3>
                  </div>
                  <div className="flex-1 overflow-hidden p-3">
                    <MomentumChart
                      events={match.events || []}
                      homeTeamName={match.homeTeam.shortName}
                      awayTeamName={match.awayTeam.shortName}
                    />
                  </div>
                </div>
              </div>

              {/* Stats & Control (4/12) */}
              <div className="lg:col-span-4 flex flex-col gap-4 min-h-0">
                {match.statistics && (
                  <>
                    <div className="telemetry-card overflow-hidden shrink-0">
                      <div className="px-4 py-2 border-b border-white/10 bg-white/5">
                        <h3 className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider">Control</h3>
                      </div>
                      <div className="p-3">
                        <PossessionDonut
                          statistics={match.statistics}
                          homeTeamName={match.homeTeam.shortName}
                          awayTeamName={match.awayTeam.shortName}
                        />
                      </div>
                    </div>

                    <div className="telemetry-card flex-1 overflow-hidden flex flex-col min-h-0">
                      <div className="px-4 py-2 border-b border-white/10 bg-white/5 shrink-0">
                        <h3 className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider">Team Stats</h3>
                      </div>
                      <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
                        <StatsPanel
                          statistics={match.statistics}
                          homeTeamName={match.homeTeam.shortName}
                          awayTeamName={match.awayTeam.shortName}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </FadeIn>
    </main>
  );
}