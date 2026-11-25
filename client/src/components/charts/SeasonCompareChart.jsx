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

const SeasonCompareChart = ({ data = [], height = 300 }) => {
  const chartData = data.map((d) => ({
    season: d.season_label || d.label,
    Wins: Number(d.barca_wins || d.wins || 0),
    Draws: Number(d.barca_draws || d.draws || 0),
    Losses: Number(d.barca_losses || d.losses || 0),
    Points: Number(d.barca_points || d.points || 0),
    GoalsFor: Number(d.barca_gf || d.gf || 0),
  }));

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
          <XAxis dataKey="season" stroke="#94a3b8" tick={{ fontSize: 12 }} />
          <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '0.75rem',
              color: '#f8fafc',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
          <Bar dataKey="Wins" fill="#10b981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Draws" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Losses" fill="#ef4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SeasonCompareChart;
