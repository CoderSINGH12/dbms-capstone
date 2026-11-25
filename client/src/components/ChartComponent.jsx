import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area, CartesianGrid,
} from 'recharts';

const PIE_COLORS = ['#10b981', '#f59e0b', '#ef4444'];

export function SeasonPieChart({ stats }) {
  const { darkMode } = useSelector((s) => s.ui);
  const data = useMemo(() => [
    { name: 'Wins', value: Number(stats?.wins || stats?.won || 0) },
    { name: 'Draws', value: Number(stats?.draws || stats?.drawn || 0) },
    { name: 'Losses', value: Number(stats?.losses || stats?.lost || 0) },
  ], [stats]);

  const tooltipStyle = {
    backgroundColor: '#0f172a',
    border: '1px solid #334155',
    borderRadius: '0.75rem',
    color: '#f8fafc',
  };

  return (
    <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
      <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
        Season Match Outcomes
      </h3>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={5}
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}`}
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={PIE_COLORS[index]} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function TopScorersChart({ players = [] }) {
  const topScorers = useMemo(() => {
    return [...players]
      .filter((p) => Number(p.goals || p.stats?.goals || 0) > 0)
      .sort((a, b) => Number(b.goals || b.stats?.goals || 0) - Number(a.goals || a.stats?.goals || 0))
      .slice(0, 6)
      .map((p) => ({
        name: (p.name || p.player_name || '').split(' ').pop(),
        goals: Number(p.goals || p.stats?.goals || 0),
        assists: Number(p.assists || p.stats?.assists || 0),
      }));
  }, [players]);

  const tooltipStyle = {
    backgroundColor: '#0f172a',
    border: '1px solid #334155',
    borderRadius: '0.75rem',
    color: '#f8fafc',
  };

  return (
    <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
      <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
        Squad Top Performers
      </h3>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={topScorers} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
            <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11 }} />
            <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: '11px' }} />
            <Bar dataKey="goals" fill="#A50044" radius={[4, 4, 0, 0]} name="Goals" />
            <Bar dataKey="assists" fill="#EDBB00" radius={[4, 4, 0, 0]} name="Assists" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function FormChart({ matches = [], focusTeamId = 1 }) {
  const formData = useMemo(() => {
    return [...matches]
      .filter((m) => m.status?.toLowerCase() === 'finished')
      .slice(-10)
      .map((m, i) => {
        const isHome = m.home_team_id === focusTeamId;
        const myScore = isHome ? m.home_score : m.away_score;
        const oppScore = isHome ? m.away_score : m.home_score;
        const points = myScore > oppScore ? 3 : myScore === oppScore ? 1 : 0;
        const opponent = isHome ? (m.away_short_name || 'AWY') : (m.home_short_name || 'HOM');
        return {
          match: (opponent).substring(0, 4),
          points,
          opponentFull: isHome ? m.away_name : m.home_name,
          score: `${m.home_score} - ${m.away_score}`,
          index: i + 1,
        };
      });
  }, [matches, focusTeamId]);

  if (formData.length === 0) return null;

  return (
    <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
      <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
        Recent Form (Last {formData.length} Matches)
      </h3>
      <div className="w-full h-52">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="formGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#004D98" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#A50044" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
            <XAxis dataKey="match" stroke="#94a3b8" tick={{ fontSize: 10 }} />
            <YAxis domain={[0, 3]} ticks={[0, 1, 3]} stroke="#94a3b8" tick={{ fontSize: 10 }} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="bg-slate-900 border border-slate-700 p-2 rounded shadow text-xs text-white">
                      <p className="font-bold text-amber-400">vs {item.opponentFull}</p>
                      <p>Score: {item.score}</p>
                      <p className="text-emerald-400">Points earned: {item.points}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="points"
              stroke="#EDBB00"
              fill="url(#formGrad)"
              strokeWidth={2}
              dot={{ r: 4, fill: '#A50044' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function ChartComponent({ stats, players, matches, focusTeamId = 1 }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
      {stats && <SeasonPieChart stats={stats} />}
      {players && players.length > 0 && <TopScorersChart players={players} />}
      {matches && matches.length > 0 && <FormChart matches={matches} focusTeamId={focusTeamId} />}
    </div>
  );
}
