'use client';

import { motion } from 'framer-motion';
import { Lineup, Player } from '@/types/football';
import { getPositionCoordinates } from '@/lib/utils';
import { Users, Trophy } from 'lucide-react';

interface Props {
  lineup: Lineup;
  teamName: string;
  teamColor: string;
  side: 'home' | 'away';
}

export function LineupVisualizer({ lineup, teamName, teamColor, side }: Props) {

  const getPositionStyle = (player: Player, index: number) => {
    const coords = getPositionCoordinates(player.position, index, lineup.formation, side);
    return {
      left: `${coords.x}%`,
      top: `${coords.y}%`,
    };
  };

  const goalkeeper = lineup.startingXI.find(p => p.position === 'GK');
  const fieldPlayers = lineup.startingXI.filter(p => p.position !== 'GK');

  return (
    <div className="space-y-6">
      {/* Formation Info */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-semibold text-white">{teamName}</h3>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">Formation</span>
            <span className="text-2xl font-bold text-white">{lineup.formation}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Trophy className="w-4 h-4" />
          <span>Coach: {lineup.coach.name}</span>
        </div>
      </motion.div>

      {/* Pitch Visualization */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative aspect-[3/4] bg-gradient-to-b from-green-800/30 to-green-900/30 rounded-2xl border border-white/10 overflow-hidden"
      >
        {/* Pitch markings */}
        <div className="absolute inset-4 border-2 border-white/20 rounded-lg" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-white/20 rounded-full" />
        <div className="absolute left-1/2 top-0 w-32 h-16 border-2 border-white/20 border-t-0" />
        <div className="absolute left-1/2 bottom-0 w-32 h-16 border-2 border-white/20 border-b-0" />
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/10" />
        
        {/* Halfway line */}
        <div className="absolute left-4 right-4 top-1/2 h-0.5 bg-white/10" />

        {/* Players */}
        {goalkeeper && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={getPositionStyle(goalkeeper, 0)}
          >
            <PlayerBadge player={goalkeeper} color={teamColor} isGoalkeeper />
          </motion.div>
        )}

        {fieldPlayers.map((player, index) => (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * (index + 1) }}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={getPositionStyle(player, index + 1)}
          >
            <PlayerBadge player={player} color={teamColor} />
          </motion.div>
        ))}
      </motion.div>

      {/* Substitutes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6"
      >
        <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Substitutes</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {lineup.substitutes.map((player, index) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-all"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white text-xs font-bold">
                {player.shirtNumber}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">{player.name}</div>
                <div className="text-xs text-gray-500">{player.position}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

interface PlayerBadgeProps {
  player: Player;
  color: string;
  isGoalkeeper?: boolean;
}

function PlayerBadge({ player, color, isGoalkeeper }: PlayerBadgeProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.1, zIndex: 10 }}
      className="group cursor-pointer"
    >
      <div className="relative">
        {/* Jersey */}
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-2 border-white/20"
          style={{
            background: isGoalkeeper
              ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
              : `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
          }}
        >
          <span className="text-white font-bold text-sm">{player.shirtNumber}</span>
        </div>
        
        {/* Player name tooltip */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="bg-black/90 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap border border-white/10">
            {player.name}
          </div>
        </div>
      </div>
    </motion.div>
  );
}