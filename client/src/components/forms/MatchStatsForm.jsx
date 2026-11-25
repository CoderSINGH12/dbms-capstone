import React, { useState } from 'react';

const MatchStatsForm = ({ match, squad = [], initialStats = [], onSubmit, onCancel, isSubmitting = false }) => {
  const [homeScore, setHomeScore] = useState(match?.home_score ?? 0);
  const [awayScore, setAwayScore] = useState(match?.away_score ?? 0);

  // Map squad registrations to stat rows
  const [playerStats, setPlayerStats] = useState(() => {
    return squad.map((reg) => {
      const existing = initialStats.find((s) => s.registration_id === reg.registration_id);
      return {
        registration_id: reg.registration_id,
        player_name: reg.name,
        shirt_number: reg.shirt_number,
        position: reg.position,
        started: existing ? existing.started : 1,
        minutes: existing ? existing.minutes : 90,
        goals: existing ? existing.goals : 0,
        assists: existing ? existing.assists : 0,
        yellow: existing ? existing.yellow : 0,
        red: existing ? existing.red : 0,
      };
    });
  });

  const handleStatChange = (regId, field, value) => {
    setPlayerStats((prev) =>
      prev.map((row) =>
        row.registration_id === regId ? { ...row, [field]: value } : row
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Filter only players who played (> 0 minutes or started)
    const activeStats = playerStats
      .filter((s) => s.minutes > 0 || s.goals > 0 || s.assists > 0 || s.yellow > 0 || s.red > 0)
      .map((s) => ({
        registration_id: s.registration_id,
        started: s.started ? 1 : 0,
        minutes: Number(s.minutes) || 0,
        goals: Number(s.goals) || 0,
        assists: Number(s.assists) || 0,
        yellow: Number(s.yellow) || 0,
        red: Number(s.red) || 0,
      }));

    onSubmit({
      home_score: Number(homeScore),
      away_score: Number(awayScore),
      status: 'finished',
      stats: activeStats,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-sm">
      {/* Score Header */}
      <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-around text-center">
        <div>
          <span className="text-xs text-slate-400 block mb-1 font-semibold">{match.home_short_name || 'Home'}</span>
          <input
            type="number"
            min={0}
            value={homeScore}
            onChange={(e) => setHomeScore(e.target.value)}
            className="w-16 h-12 text-center text-2xl font-black bg-slate-900 border border-slate-700 rounded-lg text-white"
          />
        </div>
        <span className="text-xl font-bold text-slate-500">–</span>
        <div>
          <span className="text-xs text-slate-400 block mb-1 font-semibold">{match.away_short_name || 'Away'}</span>
          <input
            type="number"
            min={0}
            value={awayScore}
            onChange={(e) => setAwayScore(e.target.value)}
            className="w-16 h-12 text-center text-2xl font-black bg-slate-900 border border-slate-700 rounded-lg text-white"
          />
        </div>
      </div>

      {/* Roster Match-Level Statistics Table */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Player Performance Entries (Atomic Transaction)
        </h4>
        <div className="max-h-80 overflow-y-auto rounded-xl border border-slate-700/60 bg-slate-900/60">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800 text-slate-400 sticky top-0">
              <tr>
                <th className="p-2">#</th>
                <th className="p-2">Player</th>
                <th className="p-2 text-center">Start</th>
                <th className="p-2 text-center">Mins</th>
                <th className="p-2 text-center">Goals</th>
                <th className="p-2 text-center">Assists</th>
                <th className="p-2 text-center">🟨</th>
                <th className="p-2 text-center">🟥</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {playerStats.map((row) => (
                <tr key={row.registration_id} className="hover:bg-slate-800/40">
                  <td className="p-2 font-mono text-slate-400">{row.shirt_number || '-'}</td>
                  <td className="p-2 font-semibold truncate max-w-[120px]">{row.player_name}</td>
                  <td className="p-2 text-center">
                    <input
                      type="checkbox"
                      checked={!!row.started}
                      onChange={(e) => handleStatChange(row.registration_id, 'started', e.target.checked ? 1 : 0)}
                      className="rounded bg-slate-900 border-slate-700 text-amber-500"
                    />
                  </td>
                  <td className="p-2 text-center">
                    <input
                      type="number"
                      min={0}
                      max={130}
                      value={row.minutes}
                      onChange={(e) => handleStatChange(row.registration_id, 'minutes', e.target.value)}
                      className="w-12 px-1 py-0.5 text-center bg-slate-800 border border-slate-700 rounded"
                    />
                  </td>
                  <td className="p-2 text-center">
                    <input
                      type="number"
                      min={0}
                      value={row.goals}
                      onChange={(e) => handleStatChange(row.registration_id, 'goals', e.target.value)}
                      className="w-10 px-1 py-0.5 text-center bg-slate-800 border border-slate-700 rounded text-amber-400 font-bold"
                    />
                  </td>
                  <td className="p-2 text-center">
                    <input
                      type="number"
                      min={0}
                      value={row.assists}
                      onChange={(e) => handleStatChange(row.registration_id, 'assists', e.target.value)}
                      className="w-10 px-1 py-0.5 text-center bg-slate-800 border border-slate-700 rounded text-blue-400 font-bold"
                    />
                  </td>
                  <td className="p-2 text-center">
                    <input
                      type="number"
                      min={0}
                      max={2}
                      value={row.yellow}
                      onChange={(e) => handleStatChange(row.registration_id, 'yellow', e.target.value)}
                      className="w-10 px-1 py-0.5 text-center bg-slate-800 border border-slate-700 rounded text-amber-400"
                    />
                  </td>
                  <td className="p-2 text-center">
                    <input
                      type="number"
                      min={0}
                      max={1}
                      value={row.red}
                      onChange={(e) => handleStatChange(row.registration_id, 'red', e.target.value)}
                      className="w-10 px-1 py-0.5 text-center bg-slate-800 border border-slate-700 rounded text-rose-500"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg transition-colors flex items-center gap-2"
        >
          {isSubmitting ? 'Committing Transaction...' : 'Commit Result & Stats Atomically'}
        </button>
      </div>
    </form>
  );
};

export default MatchStatsForm;
