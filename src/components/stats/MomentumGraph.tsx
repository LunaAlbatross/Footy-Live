'use client';

import { motion } from 'framer-motion';
import { Line, XAxis, YAxis, ResponsiveContainer, ReferenceLine, Area, ComposedChart } from 'recharts';
import { MomentumPoint } from '@/types/football';
import { generateMomentumData } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Props {
  events?: MomentumPoint[];
  homeTeamName: string;
  awayTeamName: string;
}

export function MomentumGraph({ events, homeTeamName, awayTeamName }: Props) {
  // Generate momentum data from events or use provided data
  const data = events || generateMomentumData([]);

  const currentValue = data[data.length - 1]?.value || 50;
  const trend = currentValue > 50 ? 'home' : currentValue < 50 ? 'away' : 'neutral';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${trend === 'home' ? 'bg-green-500/20' : trend === 'away' ? 'bg-red-500/20' : 'bg-gray-500/20'}`}>
            {trend === 'home' ? (
              <TrendingUp className="w-5 h-5 text-green-400" />
            ) : trend === 'away' ? (
              <TrendingDown className="w-5 h-5 text-red-400" />
            ) : (
              <span className="text-gray-400 text-lg">⚖️</span>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Match Momentum</h3>
            <p className="text-sm text-gray-400">
              {trend === 'home' ? `${homeTeamName} dominating` : trend === 'away' ? `${awayTeamName} dominating` : 'Evenly matched'}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">{Math.round(currentValue)}%</div>
          <div className="text-xs text-gray-400">Current momentum</div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%" minHeight={192}>
          <ComposedChart data={data}>
            <defs>
              <linearGradient id="momentumGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="minute"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickFormatter={(value) => `${value}'`}
            />
            <YAxis hide domain={[0, 100]} />
            <ReferenceLine y={50} stroke="#4b5563" strokeDasharray="3 3" />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#22c55e"
              strokeWidth={2}
              fill="url(#momentumGradient)"
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#22c55e"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, fill: '#22c55e', stroke: '#fff', strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-sm text-gray-400">{homeTeamName}</span>
        </div>
        <div className="text-xs text-gray-500">50% = Neutral</div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">{awayTeamName}</span>
          <div className="w-3 h-3 rounded-full bg-red-500" />
        </div>
      </div>

      {/* Key moments */}
      {data.filter(d => d.event).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 pt-4 border-t border-white/10"
        >
          <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Key Moments</h4>
          <div className="flex flex-wrap gap-2">
            {data.filter(d => d.event).slice(0, 5).map((point, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-xs px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-gray-300"
              >
                {point.minute}&apos; - {point.event}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}