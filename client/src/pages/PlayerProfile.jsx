import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavoritePlayer } from '../redux/favoritesSlice.js';
import { playerService } from '../services/playerService.js';
import { formatPosition, getPositionColor, formatMatchDate } from '../utils/matchUtils.js';
import { calculateAge } from '../utils/formatters.js';
import Loader from '../components/Loader.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

function PlayerProfile() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const favoritePlayerIds = useSelector((s) => s.favorites.playerIds || []);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isFavorite = favoritePlayerIds.includes(Number(id));

  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await playerService.getPlayerById(id);
        if (isMounted) setProfileData(res);
      } catch (err) {
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchProfile();
    return () => { isMounted = false; };
  }, [id]);

  const player = profileData?.player;
  const careerTotals = profileData?.careerTotals;
  const seasonHistory = profileData?.seasonHistory || [];
  const recentMatches = profileData?.recentMatches || [];

  const age = useMemo(() => calculateAge(player?.date_of_birth), [player]);

  const chartData = useMemo(() => {
    return [...seasonHistory]
      .reverse()
      .map((sh) => ({
        season: sh.season_label,
        Goals: Number(sh.goals || 0),
        Assists: Number(sh.assists || 0),
        Appearances: Number(sh.appearances || 0),
      }));
  }, [seasonHistory]);

  if (loading) return <Loader message="Fetching player career profile from database..." size="large" />;
  if (error) return <ErrorBanner error={error} title="Error Loading Player Profile" />;
  if (!player) return <div className="p-12 text-center text-slate-400">Player not found.</div>;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link to="/players" className="hover:text-amber-400 transition-colors">
          Squad & Players
        </Link>
        <span>/</span>
        <span className="text-white font-medium">{player.name}</span>
      </div>

      {/* Hero Profile Banner */}
      <div className="p-6 sm:p-8 rounded-3xl border border-[#004D98]/40 bg-gradient-to-r from-[#004D98]/25 via-[#030718]/95 to-[#081335]/90 backdrop-blur-2xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.85),0_0_35px_rgba(0,77,152,0.35)] relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          {/* Avatar */}
          <div className="relative shrink-0">
            {player.image_url ? (
              <img
                src={player.image_url}
                alt={player.name}
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover shadow-2xl border-2 border-[#004D98]/40"
              />
            ) : (
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-gradient-to-br from-[#004D98] to-[#0055B3] flex items-center justify-center text-[#EDBB00] text-3xl font-black shadow-2xl">
                {player.name.substring(0, 2).toUpperCase()}
              </div>
            )}
            {seasonHistory[0]?.shirt_number && (
              <span className="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl bg-[#EDBB00] text-[#030718] font-black text-sm flex items-center justify-center shadow-[0_0_12px_#EDBB00]">
                #{seasonHistory[0].shirt_number}
              </span>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getPositionColor(seasonHistory[0]?.position)}`}>
                {seasonHistory[0]?.position || 'Squad Member'}
              </span>
              <span className="text-xs px-3 py-1 rounded-full bg-[#02040E] text-slate-300 border border-[#004D98]/30">
                {player.nationality || 'Spain'}
              </span>
              {age && (
                <span className="text-xs px-3 py-1 rounded-full bg-[#02040E] text-slate-300 border border-[#004D98]/30">
                  {age} Years Old
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-[#EDBB00] font-heading drop-shadow-[0_0_20px_rgba(237,187,0,0.35)] tracking-tight">
              {player.name}
            </h1>

            <p className="text-xs sm:text-sm text-slate-400">
              Primary Club: <strong className="text-[#EDBB00]">{seasonHistory[0]?.team_name || 'FC Barcelona'}</strong> • Date of Birth: {player.date_of_birth || 'N/A'}
            </p>

            <div className="pt-2">
              <button
                onClick={() => dispatch(toggleFavoritePlayer(Number(id)))}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg active:scale-95 ${
                  isFavorite
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'bg-[#004D98]/60 hover:bg-[#0055B3] text-white hover:text-[#EDBB00] border border-[#004D98]/50 shadow-[0_0_12px_rgba(0,77,152,0.3)]'
                }`}
              >
                <svg
                  className={`w-4 h-4 ${isFavorite ? 'text-rose-500 fill-current' : ''}`}
                  fill={isFavorite ? 'currentColor' : 'none'}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{isFavorite ? 'Saved in Favorites' : 'Add to Favorite Players'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Career Aggregates Grid */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2 font-heading">
          <span className="w-2.5 h-2.5 rounded-full bg-[#EDBB00]" />
          Career Totals (Database Aggregated)
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-4 rounded-2xl border border-[#004D98]/30 bg-gradient-to-br from-[#060F2B]/90 via-[#030718]/95 to-[#081335]/90 text-center shadow-lg">
            <span className="text-xs uppercase font-extrabold text-slate-400 block mb-1">Appearances</span>
            <span className="text-2xl font-black text-white">{careerTotals?.appearances || 0}</span>
          </div>
          <div className="p-4 rounded-2xl border border-[#004D98]/30 bg-gradient-to-br from-[#060F2B]/90 via-[#030718]/95 to-[#081335]/90 text-center shadow-lg">
            <span className="text-xs uppercase font-extrabold text-slate-400 block mb-1">Starts</span>
            <span className="text-2xl font-black text-slate-300">{careerTotals?.starts || 0}</span>
          </div>
          <div className="p-4 rounded-2xl border border-[#004D98]/30 bg-gradient-to-br from-[#060F2B]/90 via-[#030718]/95 to-[#081335]/90 text-center shadow-lg">
            <span className="text-xs uppercase font-extrabold text-slate-400 block mb-1">Minutes</span>
            <span className="text-2xl font-black text-white">{careerTotals?.minutes || 0}'</span>
          </div>
          <div className="p-4 rounded-2xl border border-[#004D98]/30 bg-gradient-to-br from-[#060F2B]/90 via-[#030718]/95 to-[#081335]/90 text-center shadow-lg">
            <span className="text-xs uppercase font-extrabold text-slate-400 block mb-1">Goals</span>
            <span className="text-2xl font-black text-[#EDBB00] drop-shadow-[0_0_8px_rgba(237,187,0,0.4)]">{careerTotals?.goals || 0}</span>
          </div>
          <div className="p-4 rounded-2xl border border-[#004D98]/30 bg-gradient-to-br from-[#060F2B]/90 via-[#030718]/95 to-[#081335]/90 text-center shadow-lg">
            <span className="text-xs uppercase font-extrabold text-slate-400 block mb-1">Assists</span>
            <span className="text-2xl font-black text-[#60A5FA]">{careerTotals?.assists || 0}</span>
          </div>
          <div className="p-4 rounded-2xl border border-[#004D98]/30 bg-gradient-to-br from-[#060F2B]/90 via-[#030718]/95 to-[#081335]/90 text-center shadow-lg">
            <span className="text-xs uppercase font-extrabold text-slate-400 block mb-1">Cards (🟨/🟥)</span>
            <span className="text-2xl font-black text-slate-300">
              {careerTotals?.yellow || 0} / {careerTotals?.red || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Season-by-Season Progression Chart */}
      {chartData.length > 0 && (
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            Season-by-Season Goal & Assist Production (SQL LAG Demonstration)
          </h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
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
                <Bar dataKey="Goals" fill="#EDBB00" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Assists" fill="#004D98" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Season Breakdown Table (Report 17) */}
      <div>
        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#004D98]" />
          Season Registrations & Statistics
        </h3>
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/70">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/60 text-xs uppercase font-semibold text-slate-400">
              <tr>
                <th className="p-3">Season</th>
                <th className="p-3">Club</th>
                <th className="p-3 text-center">#</th>
                <th className="p-3">Position</th>
                <th className="p-3 text-center">Apps</th>
                <th className="p-3 text-center">Starts</th>
                <th className="p-3 text-center">Minutes</th>
                <th className="p-3 text-center font-bold text-amber-400">Goals</th>
                <th className="p-3 text-center font-bold text-blue-400">Assists</th>
                <th className="p-3 text-center">🟨</th>
                <th className="p-3 text-center">🟥</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {seasonHistory.map((s) => (
                <tr key={s.registration_id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-semibold text-white">{s.season_label}</td>
                  <td className="p-3 text-slate-300">{s.team_name}</td>
                  <td className="p-3 text-center font-mono text-slate-400">{s.shirt_number || '—'}</td>
                  <td className="p-3">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${getPositionColor(s.position)}`}>
                      {formatPosition(s.position)}
                    </span>
                  </td>
                  <td className="p-3 text-center">{s.appearances}</td>
                  <td className="p-3 text-center text-slate-400">{s.starts}</td>
                  <td className="p-3 text-center text-slate-400">{s.minutes}'</td>
                  <td className="p-3 text-center font-bold text-amber-400">{s.goals}</td>
                  <td className="p-3 text-center font-bold text-blue-400">{s.assists}</td>
                  <td className="p-3 text-center text-slate-400">{s.yellow}</td>
                  <td className="p-3 text-center text-slate-400">{s.red}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Match Log (if match-level records exist) */}
      {recentMatches.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#A50044]" />
            Recent Match Appearances (Match-Level Granularity)
          </h3>
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/70">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800/60 text-xs uppercase font-semibold text-slate-400">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Match</th>
                  <th className="p-3 text-center">Score</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-center">Minutes</th>
                  <th className="p-3 text-center font-bold text-amber-400">Goals</th>
                  <th className="p-3 text-center font-bold text-blue-400">Assists</th>
                  <th className="p-3 text-center">🟨</th>
                  <th className="p-3 text-center">🟥</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {recentMatches.map((m) => (
                  <tr key={m.match_id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 text-slate-400 text-xs">{formatMatchDate(m.kickoff_utc)}</td>
                    <td className="p-3 font-semibold text-white">
                      <Link to={`/matches/${m.match_id}`} className="hover:text-amber-400 transition-colors">
                        {m.home_name} vs {m.away_name}
                      </Link>
                    </td>
                    <td className="p-3 text-center font-bold">
                      {m.home_score} – {m.away_score}
                    </td>
                    <td className="p-3 text-center text-xs text-slate-400">
                      {m.started ? 'Starter' : 'Sub'}
                    </td>
                    <td className="p-3 text-center text-slate-300">{m.minutes}'</td>
                    <td className="p-3 text-center font-bold text-amber-400">{m.goals}</td>
                    <td className="p-3 text-center font-bold text-blue-400">{m.assists}</td>
                    <td className="p-3 text-center text-slate-400">{m.yellow}</td>
                    <td className="p-3 text-center text-slate-400">{m.red}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlayerProfile;
