import React from 'react';
import { Link } from 'react-router-dom';
import { formatGoalDifference } from '../utils/formatters.js';

const StandingsTable = ({ standings = [], focusTeamId = 1, showFullTable = true }) => {
  const getZoneBorder = (pos) => {
    if (pos <= 4) return 'border-l-4 border-l-[#0066FF]';
    if (pos <= 6) return 'border-l-4 border-l-[#FFD700]';
    if (pos === 7) return 'border-l-4 border-l-emerald-400';
    if (pos >= 18) return 'border-l-4 border-l-[#FF0055]';
    return 'border-l-4 border-l-transparent';
  };

  const displayData = showFullTable ? standings : standings.slice(0, 10);

  return (
    <div className="overflow-x-auto rounded-3xl border border-[#004D98]/30 bg-gradient-to-br from-[#060F2B]/90 via-[#030718]/95 to-[#081335]/90 backdrop-blur-2xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.85),0_0_25px_rgba(0,77,152,0.25)]">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-[#004D98]/20 bg-[#02040E]/60 text-xs font-black uppercase tracking-wider text-slate-400">
            <th className="py-4 pl-5 pr-2 text-center w-12">Pos</th>
            <th className="py-4 px-3">Club</th>
            <th className="py-4 px-2 text-center w-10">P</th>
            <th className="py-4 px-2 text-center w-10">W</th>
            <th className="py-4 px-2 text-center w-10">D</th>
            <th className="py-4 px-2 text-center w-10">L</th>
            <th className="py-4 px-2 text-center hidden md:table-cell w-12">GF</th>
            <th className="py-4 px-2 text-center hidden md:table-cell w-12">GA</th>
            <th className="py-4 px-2 text-center w-14 font-bold">GD</th>
            <th className="py-4 px-3 text-center w-14 font-black text-[#EDBB00] drop-shadow-[0_0_8px_rgba(237,187,0,0.5)]">PTS</th>
            <th className="py-4 px-3 text-center hidden lg:table-cell w-32">Form</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#004D98]/10 text-slate-200">
          {displayData.map((row) => {
            const isFocus = row.team_id === focusTeamId;
            return (
              <tr
                key={row.team_id || row.position}
                className={`transition-all duration-200 ${getZoneBorder(row.position)} ${
                  isFocus
                    ? 'bg-gradient-to-r from-[#004D98]/35 via-[#0055B3]/20 to-transparent font-bold text-white shadow-[inset_0_0_20px_rgba(0,77,152,0.25)]'
                    : 'hover:bg-[#004D98]/10'
                }`}
              >
                <td className="py-3.5 pl-5 pr-2 text-center font-bold">
                  <span
                    className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${
                      isFocus
                        ? 'bg-[#EDBB00] text-[#030718] font-black shadow-[0_0_10px_#EDBB00]'
                        : 'text-slate-300'
                    }`}
                  >
                    {row.position}
                  </span>
                </td>
                <td className="py-3.5 px-3">
                  <Link
                    to={`/laliga/teams/${row.team_id}`}
                    className="flex items-center gap-2.5 hover:text-[#EDBB00] transition-colors group"
                  >
                    {row.crest_url ? (
                      <img
                        src={row.crest_url}
                        alt={row.team_name}
                        className="w-6 h-6 object-contain shrink-0"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-slate-800 text-[10px] flex items-center justify-center font-bold text-slate-300">
                        {row.tla || row.short_name?.substring(0, 3)}
                      </div>
                    )}
                    <span className="font-semibold group-hover:underline">
                      {row.short_name || row.team_name}
                    </span>
                    {isFocus && (
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#004D98] text-[#EDBB00] border border-[#EDBB00]/40 font-black ml-1.5 shadow-[0_0_8px_rgba(237,187,0,0.3)]">
                        Blaugrana
                      </span>
                    )}
                  </Link>
                </td>
                <td className="py-3.5 px-2 text-center text-slate-400">{row.played}</td>
                <td className="py-3.5 px-2 text-center text-slate-300">{row.won}</td>
                <td className="py-3.5 px-2 text-center text-slate-400">{row.drawn}</td>
                <td className="py-3.5 px-2 text-center text-slate-400">{row.lost}</td>
                <td className="py-3.5 px-2 text-center text-slate-400 hidden md:table-cell">{row.gf}</td>
                <td className="py-3.5 px-2 text-center text-slate-400 hidden md:table-cell">{row.ga}</td>
                <td className="py-3.5 px-2 text-center font-semibold text-slate-200">
                  {formatGoalDifference(row.gd)}
                </td>
                <td className="py-3.5 px-3 text-center font-black text-[#EDBB00] text-base drop-shadow-[0_0_8px_rgba(237,187,0,0.4)]">
                  {row.points}
                </td>
                <td className="py-3.5 px-3 text-center hidden lg:table-cell">
                  <div className="flex items-center justify-center gap-1">
                    {row.form && row.form.length > 0 ? (
                      row.form.map((res, i) => (
                        <span
                          key={i}
                          title={res === 'W' ? 'Win' : res === 'D' ? 'Draw' : 'Loss'}
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm ${
                            res === 'W'
                              ? 'bg-emerald-500'
                              : res === 'D'
                              ? 'bg-[#EDBB00] text-[#030718]'
                              : 'bg-rose-500'
                          }`}
                        >
                          {res}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-600">-</span>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 px-4 py-3 bg-[#030718]/90 border-t border-[#004D98]/30 text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#004D98]" />
          <span>UEFA Champions League</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#EDBB00]" />
          <span>UEFA Europa League</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
          <span>Conference League</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" />
          <span>Relegation</span>
        </div>
      </div>
    </div>
  );
};

export default StandingsTable;
