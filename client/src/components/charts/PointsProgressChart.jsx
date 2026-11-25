import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

const PointsProgressChart = ({ matches = [], focusTeamId = 1, height = 260 }) => {
  // Compute cumulative point progression across matchdays
  let currentPoints = 0;
  const chartData = [...matches]
    .filter((m) => m.status?.toLowerCase() === 'finished')
    .sort((a, b) => a.matchday - b.matchday)
    .map((m) => {
      const isHome = m.home_team_id === focusTeamId;
      const fScore = isHome ? m.home_score : m.away_score;
      const oScore = isHome ? m.away_score : m.home_score;

      if (fScore > oScore) currentPoints += 3;
      else if (fScore === oScore) currentPoints += 1;

      return {
        matchday: `MD ${m.matchday}`,
        Points: currentPoints,
        opponent: isHome ? m.away_short_name || m.away_name : m.home_short_name || m.home_name,
        score: `${m.home_score} - ${m.away_score}`,
      };
    });

  if (chartData.length === 0) return null;

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
          <XAxis dataKey="matchday" stroke="#94a3b8" tick={{ fontSize: 11 }} />
          <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-xl shadow-xl text-xs text-white">
                    <p className="font-bold text-amber-400">{item.matchday}: {item.opponent}</p>
                    <p className="text-slate-300">Score: {item.score}</p>
                    <p className="text-emerald-400 font-semibold mt-1">Total Points: {item.Points}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Line
            type="monotone"
            dataKey="Points"
            stroke="#EDBB00"
            strokeWidth={3}
            dot={{ r: 3, fill: '#A50044' }}
            activeDot={{ r: 6, fill: '#EDBB00' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PointsProgressChart;
