import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { matchService } from '../services/matchService.js';
import { formatMatchDate, formatMatchTime, formatPosition, getPositionColor } from '../utils/matchUtils.js';
import { showNotification } from '../redux/uiSlice.js';
import Loader from '../components/Loader.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import FormModal from '../components/forms/FormModal.jsx';
import MatchStatsForm from '../components/forms/MatchStatsForm.jsx';

function MatchDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((s) => s.auth);

  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadMatch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await matchService.getMatchById(id);
      setMatchData(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMatch();
  }, [id]);

  const handleSaveResult = async (payload) => {
    setIsSubmitting(true);
    try {
      await matchService.saveMatchResult(id, payload);
      dispatch(showNotification({ type: 'success', message: 'Match result & player stats saved atomically!' }));
      setIsEditModalOpen(false);
      await loadMatch();
    } catch (err) {
      dispatch(showNotification({ type: 'error', message: err.message || 'Failed to save result' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Loader message="Loading match statistics from database..." size="large" />;
  if (error) return <ErrorBanner error={error} title="Error Loading Match" />;
  if (!matchData?.match) return <div className="p-12 text-center text-slate-400">Match not found.</div>;

  const { match, homeStats = [], awayStats = [] } = matchData;
  const isFinished = match.status?.toLowerCase() === 'finished';

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Link to="/matches" className="hover:text-amber-400 transition-colors">
            Matches
          </Link>
          <span>/</span>
          <span className="text-white font-medium">Matchday {match.matchday}</span>
        </div>

        {isAuthenticated && (
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-amber-400/20 text-amber-300 border border-amber-400/40 hover:bg-amber-400/30 text-xs font-bold transition-all shadow"
          >
            ⚙️ Edit Result & Player Stats (Admin)
          </button>
        )}
      </div>

      {/* Match Scoreboard Banner */}
      <div className="p-6 sm:p-10 rounded-3xl border border-[#004D98]/40 bg-gradient-to-r from-[#004D98]/25 via-[#030718]/95 to-[#081335]/90 backdrop-blur-2xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.85),0_0_35px_rgba(0,77,152,0.35)] relative overflow-hidden">
        {/* Top Info */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-6">
          <span className="font-extrabold text-[#EDBB00] tracking-wider uppercase drop-shadow-[0_0_8px_rgba(237,187,0,0.4)]">
            La Liga EA Sports • Matchday {match.matchday} ({match.season_label})
          </span>
          <span className="px-2.5 py-1 rounded-full bg-[#02040E] border border-[#004D98]/40 font-mono text-[#EDBB00]">
            {formatMatchDate(match.kickoff_utc)}
          </span>
        </div>

        {/* Score Board */}
        <div className="flex items-center justify-around py-4">
          {/* Home Team */}
          <div className="flex flex-col items-center text-center flex-1">
            <div className="w-16 h-16 sm:w-20 sm:h-20 p-2 bg-[#02040E] border border-[#004D98]/30 rounded-2xl flex items-center justify-center shadow-xl mb-3">
              {match.home_crest ? (
                <img src={match.home_crest} alt={match.home_name} className="w-full h-full object-contain" />
              ) : (
                <span className="text-xl font-bold text-slate-200">{match.home_name?.substring(0, 3)}</span>
              )}
            </div>
            <h2 className="text-base sm:text-xl font-extrabold text-white font-heading">{match.home_name}</h2>
            <span className="text-xs text-slate-400 mt-1">{match.home_stadium || 'Home Stadium'}</span>
          </div>

          {/* Scores or Status */}
          <div className="flex flex-col items-center px-4 shrink-0">
            {isFinished ? (
              <div className="flex items-center gap-3">
                <span className="text-4xl sm:text-6xl font-black text-[#EDBB00] font-heading drop-shadow-[0_0_20px_rgba(237,187,0,0.45)]">{match.home_score ?? 0}</span>
                <span className="text-2xl sm:text-4xl text-[#0055B3] font-light">–</span>
                <span className="text-4xl sm:text-6xl font-black text-[#EDBB00] font-heading drop-shadow-[0_0_20px_rgba(237,187,0,0.45)]">{match.away_score ?? 0}</span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <span className="text-lg font-bold text-[#EDBB00] font-mono">{formatMatchTime(match.kickoff_utc) || 'TBD'}</span>
                <span className="mt-1 px-3 py-1 rounded-full text-xs font-black bg-[#EDBB00]/15 text-[#EDBB00] border border-[#EDBB00]/40 shadow-[0_0_10px_rgba(237,187,0,0.25)]">
                  SCHEDULED
                </span>
              </div>
            )}
            {isFinished && (
              <span className="mt-2 text-xs font-bold text-slate-400 tracking-widest uppercase">
                Full Time
              </span>
            )}
          </div>

          {/* Away Team */}
          <div className="flex flex-col items-center text-center flex-1">
            <div className="w-16 h-16 sm:w-20 sm:h-20 p-2 bg-[#02040E] border border-[#004D98]/30 rounded-2xl flex items-center justify-center shadow-xl mb-3">
              {match.away_crest ? (
                <img src={match.away_crest} alt={match.away_name} className="w-full h-full object-contain" />
              ) : (
                <span className="text-xl font-bold text-slate-200">{match.away_name?.substring(0, 3)}</span>
              )}
            </div>
            <h2 className="text-base sm:text-xl font-extrabold text-white font-heading">{match.away_name}</h2>
            <span className="text-xs text-slate-400 mt-1">{match.away_stadium || 'Away Stadium'}</span>
          </div>
        </div>

        {/* Footer info: Venue & Referee */}
        <div className="mt-6 pt-4 border-t border-[#004D98]/20 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
          <span>🏟️ Venue: <strong className="text-slate-200">{match.venue || match.home_stadium || 'Estadio'}</strong></span>
          <span>⚖️ Match Referee: <strong className="text-slate-200">{match.referee || 'Official La Liga Committee'}</strong></span>
        </div>
      </div>

      {/* Player Match Statistics Tables (Relational DBMS) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-[#EDBB00] font-heading drop-shadow-[0_0_12px_rgba(237,187,0,0.3)] flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#004D98]" />
            Verified Match Lineups & Player Event Stats
          </h3>
          <span className="text-xs text-slate-400">
            {homeStats.length + awayStats.length} total recorded player stat rows
          </span>
        </div>

        {homeStats.length === 0 && awayStats.length === 0 ? (
          <div className="p-8 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 text-center text-slate-400 text-sm">
            No match-level player statistics recorded yet for this fixture.
            {isAuthenticated && (
              <div className="mt-3">
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs"
                >
                  Enter Player Statistics Now
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Home Stats */}
            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                {match.home_name} Roster & Performance
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-800/70 text-slate-400 uppercase">
                    <tr>
                      <th className="p-2">#</th>
                      <th className="p-2">Player</th>
                      <th className="p-2 text-center">Pos</th>
                      <th className="p-2 text-center">Mins</th>
                      <th className="p-2 text-center text-amber-400">G</th>
                      <th className="p-2 text-center text-blue-400">A</th>
                      <th className="p-2 text-center">🟨</th>
                      <th className="p-2 text-center">🟥</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-200">
                    {homeStats.map((s) => (
                      <tr key={s.registration_id} className="hover:bg-slate-800/40">
                        <td className="p-2 font-mono text-slate-400">{s.shirt_number || '—'}</td>
                        <td className="p-2 font-semibold text-white">
                          <Link to={`/players/${s.player_id}`} className="hover:text-amber-400 transition-colors">
                            {s.player_name}
                          </Link>
                          {!s.started && <span className="text-[10px] text-slate-500 ml-1">(Sub)</span>}
                        </td>
                        <td className="p-2 text-center">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] border ${getPositionColor(s.position)}`}>
                            {formatPosition(s.position)}
                          </span>
                        </td>
                        <td className="p-2 text-center text-slate-300">{s.minutes}'</td>
                        <td className="p-2 text-center font-bold text-amber-400">{s.goals || 0}</td>
                        <td className="p-2 text-center font-bold text-blue-400">{s.assists || 0}</td>
                        <td className="p-2 text-center text-amber-400">{s.yellow || 0}</td>
                        <td className="p-2 text-center text-rose-500">{s.red || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Away Stats */}
            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                {match.away_name} Roster & Performance
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-800/70 text-slate-400 uppercase">
                    <tr>
                      <th className="p-2">#</th>
                      <th className="p-2">Player</th>
                      <th className="p-2 text-center">Pos</th>
                      <th className="p-2 text-center">Mins</th>
                      <th className="p-2 text-center text-amber-400">G</th>
                      <th className="p-2 text-center text-blue-400">A</th>
                      <th className="p-2 text-center">🟨</th>
                      <th className="p-2 text-center">🟥</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-200">
                    {awayStats.map((s) => (
                      <tr key={s.registration_id} className="hover:bg-slate-800/40">
                        <td className="p-2 font-mono text-slate-400">{s.shirt_number || '—'}</td>
                        <td className="p-2 font-semibold text-white">
                          <Link to={`/players/${s.player_id}`} className="hover:text-amber-400 transition-colors">
                            {s.player_name}
                          </Link>
                          {!s.started && <span className="text-[10px] text-slate-500 ml-1">(Sub)</span>}
                        </td>
                        <td className="p-2 text-center">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] border ${getPositionColor(s.position)}`}>
                            {formatPosition(s.position)}
                          </span>
                        </td>
                        <td className="p-2 text-center text-slate-300">{s.minutes}'</td>
                        <td className="p-2 text-center font-bold text-amber-400">{s.goals || 0}</td>
                        <td className="p-2 text-center font-bold text-blue-400">{s.assists || 0}</td>
                        <td className="p-2 text-center text-amber-400">{s.yellow || 0}</td>
                        <td className="p-2 text-center text-rose-500">{s.red || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Admin Edit Modal */}
      <FormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit Result & Stats: ${match.home_short_name} vs ${match.away_short_name}`}
      >
        <MatchStatsForm
          match={match}
          squad={homeStats.concat(awayStats)}
          initialStats={homeStats.concat(awayStats)}
          onSubmit={handleSaveResult}
          onCancel={() => setIsEditModalOpen(false)}
          isSubmitting={isSubmitting}
        />
      </FormModal>
    </div>
  );
}

export default MatchDetail;