'use client';

import { motion } from 'framer-motion';
import { Lineup, Player } from '@/types/football';

interface Props {
  homeLineup: Lineup;
  awayLineup: Lineup;
  homeTeamName: string;
  awayTeamName: string;
  homeColor: string;
  awayColor: string;
}

export function FormationPitch({ homeLineup, awayLineup, homeTeamName, awayTeamName, homeColor, awayColor }: Props) {
  const getPositions = (formation: string, side: 'home' | 'away') => {
    const formations: Record<string, number[][]> = {
      '4-4-2': [[50], [20, 40, 60, 80], [20, 40, 60, 80], [35, 65]],
      '4-3-3': [[50], [20, 40, 60, 80], [30, 50, 70], [25, 50, 75]],
      '4-2-3-1': [[50], [20, 40, 60, 80], [35, 65], [25, 50, 75], [50]],
      '3-5-2': [[50], [30, 50, 70], [15, 35, 50, 65, 85], [35, 65]],
      '3-4-3': [[50], [30, 50, 70], [20, 40, 60, 80], [25, 50, 75]],
      '5-3-2': [[50], [15, 30, 50, 70, 85], [30, 50, 70], [35, 65]],
    };

    const rows = formations[formation] || formations['4-4-2'];
    const positions: { x: number; y: number; playerIndex: number }[] = [];
    let playerIdx = 0;

    rows.forEach((row, rowIdx) => {
      row.forEach(xPos => {
        const totalRows = rows.length;
        let y: number;
        if (side === 'home') {
          // Home team: bottom half, from 94% (GK) to 55% (forwards)
          y = 94 - (rowIdx * (39 / (totalRows - 1)));
        } else {
          // Away team: top half, from 6% (GK) to 45% (forwards)
          y = 6 + (rowIdx * (39 / (totalRows - 1)));
        }
        positions.push({ x: xPos, y, playerIndex: playerIdx });
        playerIdx++;
      });
    });

    return positions;
  };

  const homePositions = getPositions(homeLineup.formation, 'home');
  const awayPositions = getPositions(awayLineup.formation, 'away');

  return (
    <div className="telemetry-panel formation-pitch">
      <div className="panel-header">
        <h3 className="panel-title">
          <span className="panel-title-icon">🏟️</span>
          Formation
        </h3>
        <div className="formation-pitch__formations">
          <span className="formation-pitch__formation-label" style={{ color: homeColor }}>
            {homeTeamName} {homeLineup.formation}
          </span>
          <span className="formation-pitch__vs">vs</span>
          <span className="formation-pitch__formation-label" style={{ color: awayColor }}>
            {awayLineup.formation} {awayTeamName}
          </span>
        </div>
      </div>

      <div className="formation-pitch__field">
        {/* Pitch markings */}
        <div className="formation-pitch__outline" />
        <div className="formation-pitch__halfway" />
        <div className="formation-pitch__center-circle" />
        <div className="formation-pitch__center-dot" />
        <div className="formation-pitch__penalty-area formation-pitch__penalty-area--top" />
        <div className="formation-pitch__penalty-area formation-pitch__penalty-area--bottom" />
        <div className="formation-pitch__goal-area formation-pitch__goal-area--top" />
        <div className="formation-pitch__goal-area formation-pitch__goal-area--bottom" />

        {/* Home team players - bottom half */}
        {homePositions.map((pos, idx) => {
          const player = homeLineup.startingXI[idx];
          if (!player) return null;
          return (
            <PlayerDot
              key={`home-${player.id}`}
              player={player}
              x={pos.x}
              y={pos.y}
              color={homeColor}
              isGoalkeeper={player.position === 'GK'}
              delay={idx * 0.04}
            />
          );
        })}

        {/* Away team players - top half */}
        {awayPositions.map((pos, idx) => {
          const player = awayLineup.startingXI[idx];
          if (!player) return null;
          return (
            <PlayerDot
              key={`away-${player.id}`}
              player={player}
              x={pos.x}
              y={pos.y}
              color={awayColor}
              isGoalkeeper={player.position === 'GK'}
              delay={idx * 0.04 + 0.5}
            />
          );
        })}
      </div>

      {/* Bench */}
      <div className="formation-pitch__bench">
        <div className="formation-pitch__bench-side">
          <div className="formation-pitch__bench-label">Bench</div>
          <div className="formation-pitch__bench-players">
            {homeLineup.substitutes.slice(0, 7).map(p => (
              <div key={p.id} className="formation-pitch__bench-player">
                <span className="formation-pitch__bench-num" style={{ borderColor: homeColor }}>{p.shirtNumber}</span>
                <span className="formation-pitch__bench-name">{p.name.split(' ').pop()}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="formation-pitch__bench-side">
          <div className="formation-pitch__bench-label">Bench</div>
          <div className="formation-pitch__bench-players">
            {awayLineup.substitutes.slice(0, 7).map(p => (
              <div key={p.id} className="formation-pitch__bench-player">
                <span className="formation-pitch__bench-num" style={{ borderColor: awayColor }}>{p.shirtNumber}</span>
                <span className="formation-pitch__bench-name">{p.name.split(' ').pop()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PlayerDot({ player, x, y, color, isGoalkeeper, delay }: {
  player: Player;
  x: number;
  y: number;
  color: string;
  isGoalkeeper: boolean;
  delay: number;
}) {
  const lastName = player.name.split(' ').pop() || player.name;
  return (
    <motion.div
      className="formation-pitch__player"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 200 }}
    >
      <div
        className="formation-pitch__player-dot"
        style={{
          background: isGoalkeeper
            ? 'linear-gradient(135deg, #fbbf24, #f59e0b)'
            : `linear-gradient(135deg, ${color}, ${color}cc)`,
          boxShadow: `0 0 12px ${isGoalkeeper ? '#fbbf24' : color}60`,
        }}
      >
        <span>{player.shirtNumber}</span>
      </div>
      <div className="formation-pitch__player-name">{lastName}</div>
    </motion.div>
  );
}
