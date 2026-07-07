'use client';

import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ReferenceLine,
  CartesianGrid,
} from 'recharts';
import { generateMomentumData } from '@/lib/utils';
import { MatchEvent } from '@/types/football';

interface Props {
  events: MatchEvent[];
  homeTeamName: string;
  awayTeamName: string;
}

export function MomentumChart({ events, homeTeamName, awayTeamName }: Props) {
  const data = generateMomentumData(events);
  const currentValue = data[data.length - 1]?.value || 50;
  const trend = currentValue > 55 ? 'home' : currentValue < 45 ? 'away' : 'neutral';

  return (
    <div className="telemetry-panel momentum-chart">
      <div className="panel-header">
        <h3 className="panel-title">
          <span className="panel-title-icon">📈</span>
          Momentum
        </h3>
        <div className="momentum-chart__trend">
          <span className={`momentum-chart__trend-label momentum-chart__trend-label--${trend}`}>
            {trend === 'home' ? `${homeTeamName} ↑` : trend === 'away' ? `${awayTeamName} ↑` : 'Even'}
          </span>
        </div>
      </div>

      <div className="momentum-chart__graph">
        <div className="momentum-chart__team-label momentum-chart__team-label--home">
          {homeTeamName}
        </div>
        <ResponsiveContainer width="100%" height={140} minHeight={140}>
          <ComposedChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <defs>
              <linearGradient id="momentumGradUp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.4} />
                <stop offset="50%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="momentumGradDown" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.4} />
                <stop offset="50%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a1a2e" />
            <XAxis
              dataKey="minute"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#4b5563', fontSize: 10 }}
              tickFormatter={(v) => `${v}'`}
            />
            <YAxis hide domain={[20, 80]} />
            <ReferenceLine y={50} stroke="#334155" strokeDasharray="5 5" strokeWidth={1} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="none"
              fill="url(#momentumGradUp)"
              baseLine={50}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#22c55e"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#22c55e', stroke: '#000', strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
        <div className="momentum-chart__team-label momentum-chart__team-label--away">
          {awayTeamName}
        </div>
      </div>
    </div>
  );
}
