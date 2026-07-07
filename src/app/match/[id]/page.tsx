'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getMatchById } from '@/lib/api';
import { Match } from '@/types/football';
import { ScoreHeader } from '@/components/telemetry/ScoreHeader';
import { LiveEventsFeed } from '@/components/telemetry/LiveEventsFeed';
import { StatsPanel } from '@/components/telemetry/StatsPanel';
import { FormationPitch } from '@/components/telemetry/FormationPitch';
import { MomentumChart } from '@/components/telemetry/MomentumChart';
import { PossessionDonut } from '@/components/telemetry/PossessionDonut';
import { ShotMap } from '@/components/telemetry/ShotMap';
import { MatchTimebar } from '@/components/telemetry/MatchTimebar';
import '@/app/telemetry.css';

export default function MatchTelemetryPage() {
  const params = useParams();
  const matchId = parseInt(params.id as string);
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);

  const loadMatch = useCallback(async () => {
    try {
      const data = await getMatchById(matchId);
      if (data) {
        setMatch(data);
      }
    } catch (err) {
      console.error('Failed to load match:', err);
    } finally {
      setLoading(false);
    }
  }, [matchId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadMatch();
    }, 0);
    const interval = setInterval(loadMatch, 10000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [loadMatch]);
  if (loading || !match) {
    return (
      <div className="telemetry-dashboard" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, border: '3px solid #22c55e', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: '#64748b', fontSize: 14 }}>Loading match telemetry...</p>
        </div>
      </div>
    );
  }

  const homeColor = match.homeTeam.colors?.primary || '#22c55e';
  const awayColor = match.awayTeam.colors?.primary || '#ef4444';

  return (
    <div className="telemetry-dashboard">
      <Link href="/" className="telemetry-dashboard__back">
        <ArrowLeft size={14} />
        Back to matches
      </Link>

      <div className="telemetry-dashboard__grid">
        {/* Row 1: Score Header (full width) */}
        <div className="telemetry-dashboard__top-bar">
          <ScoreHeader match={match} />
        </div>

        {/* Row 2: Timeline bar (full width) */}
        <div className="telemetry-dashboard__timebar">
          <MatchTimebar
            events={match.events}
            homeTeamId={match.homeTeam.id}
            currentMinute={match.minute || 90}
          />
        </div>

        {/* Column 1: Events Feed */}
        <LiveEventsFeed
          events={match.events}
          homeTeamId={match.homeTeam.id}
          homeTeamName={match.homeTeam.shortName}
          awayTeamName={match.awayTeam.shortName}
        />

        {/* Column 2: Center - Formation + Momentum + Shots */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, overflow: 'auto' }}>
          {match.homeLineup && match.awayLineup && (
            <FormationPitch
              homeLineup={match.homeLineup}
              awayLineup={match.awayLineup}
              homeTeamName={match.homeTeam.shortName}
              awayTeamName={match.awayTeam.shortName}
              homeColor={homeColor}
              awayColor={awayColor}
            />
          )}
          <MomentumChart
            events={match.events}
            homeTeamName={match.homeTeam.shortName}
            awayTeamName={match.awayTeam.shortName}
          />
          {match.statistics && (
            <ShotMap
              statistics={match.statistics}
              homeTeamName={match.homeTeam.shortName}
              awayTeamName={match.awayTeam.shortName}
            />
          )}
        </div>

        {/* Column 3: Stats + Possession */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, overflow: 'auto' }}>
          {match.statistics && (
            <>
              <PossessionDonut
                statistics={match.statistics}
                homeTeamName={match.homeTeam.shortName}
                awayTeamName={match.awayTeam.shortName}
              />
              <StatsPanel
                statistics={match.statistics}
                homeTeamName={match.homeTeam.shortName}
                awayTeamName={match.awayTeam.shortName}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}