import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

const HomeAwayChart = ({ summary, height = 260 }) => {
  if (!summary) return null;

  const chartData = [
    {
      venue: 'Home (Camp Nou / Montjuïc)',
      Won: Number(summary.home_won || 0),
      Drawn: Number(summary.home_drawn || 0),
      Lost: Number(summary.home_lost || 0),
      GoalsFor: Number(summary.home_gf || 0),
      GoalsAgainst: Number(summary.home_ga || 0),
    },
    {
      venue: 'Away Matches',
      Won: Number(summary.away_won || 0),
      Drawn: Number(summary.away_drawn || 0),
      Lost: Number(summary.away_lost || 0),
      GoalsFor: Number(summary.away_gf || 0),
      GoalsAgainst: Number(summary.away_ga || 0),
    },
  ];

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
          <XAxis dataKey="venue" stroke="#94a3b8" tick={{ fontSize: 11 }} />
          <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '0.75rem',
              color: '#f8fafc',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
          <Bar dataKey="Won" fill="#10b981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="GoalsFor" fill="#004D98" radius={[4, 4, 0, 0]} />
          <Bar dataKey="GoalsAgainst" fill="#A50044" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HomeAwayChart;
