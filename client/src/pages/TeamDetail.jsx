import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { teamService } from '../services/teamService.js';
import { matchService } from '../services/matchService.js';
import { useSelectedSeason } from '../hooks/useSelectedSeason.js';
import Loader from '../components/Loader.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import MatchCard from '../components/MatchCard.jsx';
import { formatGoalDifference } from '../utils/formatters.js';

function TeamDetail() {
  const { id } = useParams();
  const { selectedSeason } = useSelectedSeason();
  const { darkMode } = useSelector((state) => state.ui);

  const [team, setTeam] = useState(null);
  const [summary, setSummary] = useState(null);
  const [squad, setSquad] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('squad');
  const [positionFilter, setPositionFilter] = useState('All');

  const seasonId = selectedSeason?.id || 1;

  useEffect(() => {
    let isMounted = true;
    async function loadTeamData() {
      setLoading(true);
      setError(null);
      try {
        const [teamData, summaryData, squadData, matchesData] = await Promise.all([
          teamService.getTeamById(id),
          teamService.getTeamSeasonSummary(id, seasonId).catch(() => null),
          teamService.getTeamSquad(id, seasonId).catch(() => []),
          matchService.getMatches({ teamId: id, seasonId, limit: 38 }).catch(() => ({ data: [] })),
        ]);

        if (isMounted) {
          setTeam(teamData);
          setSummary(summaryData);
          setSquad(Array.isArray(squadData) ? squadData : squadData?.data || []);
          setMatches(matchesData?.data || matchesData || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load club details');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (id) {
      loadTeamData();
    }

    return () => {
      isMounted = false;
    };
  }, [id, seasonId]);

  const filteredSquad = useMemo(() => {
    if (positionFilter === 'All') return squad;
    return squad.filter((p) => p.position?.toLowerCase() === positionFilter.toLowerCase());
  }, [squad, positionFilter]);

  const squadByPosition = useMemo(() => {
    const groups = { Goalkeeper: [], Defender: [], Midfielder: [], Forward: [] };
    filteredSquad.forEach((p) => {
      const pos = p.position || 'Other';
      if (groups[pos]) groups[pos].push(p);
      else groups.Forward.push(p);
    });
    return groups;
  }, [filteredSquad]);

  if (loading) return <Loader text="Loading club profile & statistics..." />;
  if (error) return <ErrorBanner message={error} />;
  if (!team) return <ErrorBanner message="Club not found" />;

  const isBarca = team.is_barcelona === 1 || team.name?.includes('Barcelona');

  return (
    <div className="page-container py-6">
      {/* Club Banner Header */}
      <div className="p-6 md:p-8 rounded-3xl border border-[#004D98]/40 bg-gradient-to-r from-[#004D98]/25 via-[#030718]/95 to-[#081335]/90 backdrop-blur-2xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.85),0_0_35px_rgba(0,77,152,0.35)] mb-8 transition-all">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-28 h-28 p-2 rounded-2xl bg-[#030718] border border-[#004D98]/30 flex items-center justify-center shadow-inner">
            {team.crest_url ? (
              <img src={team.crest_url} alt={team.name} className="max-h-24 max-w-24 object-contain" />
            ) : (
              <span className="text-3xl font-black text-[#EDBB00]">{team.short_name?.slice(0, 3) || 'FCB'}</span>
            )}
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#EDBB00] font-heading drop-shadow-[0_0_20px_rgba(237,187,0,0.35)]">
                {team.name}
              </h1>
              {isBarca && (
                <span className="px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-[#EDBB00] text-[#030718] shadow-[0_0_12px_#EDBB00]">
                  Primary Focus Club
                </span>
              )}
            </div>

            <p className="text-sm text-slate-300 flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 mb-4">
              <span>🏟️ {team.stadium || 'Home Stadium'}</span>
              {team.stadium_capacity && (
                <span>Cap: {Number(team.stadium_capacity).toLocaleString()}</span>
              )}
              {team.city && <span>📍 {team.city}</span>}
              {team.founded_year && <span>Est. {team.founded_year}</span>}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs">
              {team.website && (
                <a
                  href={team.website}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-[#060F2B] hover:bg-[#004D98]/20 text-slate-200 font-semibold border border-[#004D98]/30 transition-colors"
                >
                  Official Website ↗
                </a>
              )}
              <Link
                to={`/compare?teamA=${id}`}
                className="px-3 py-1.5 rounded-lg bg-[#004D98]/60 hover:bg-[#0055B3] text-[#EDBB00] font-semibold border border-[#004D98]/50 shadow-[0_0_10px_rgba(0,77,152,0.3)] transition-colors"
              >
                Compare Head-to-Head ⚔️
              </Link>
            </div>
          </div>
        </div>

        {/* Season Summary Statistics Pill Grid */}
        {summary && (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mt-8 pt-6 border-t border-[#004D98]/20 text-center">
            <div className="p-3 rounded-xl bg-[#02040E]/80 border border-[#004D98]/30">
              <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider block">Rank</span>
              <span className="text-2xl font-black text-[#EDBB00] drop-shadow-[0_0_8px_rgba(237,187,0,0.4)]">#{summary.standings?.position || '-'}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#02040E]/80 border border-[#004D98]/30">
              <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider block">Points</span>
              <span className="text-2xl font-black text-[#EDBB00] drop-shadow-[0_0_8px_rgba(237,187,0,0.4)]">{summary.standings?.points ?? '-'}</span>
            </div>
            <div className="p-3 rounded-xl bg-black/30 border border-white/5">
              <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider block">Played</span>
              <span className="text-2xl font-black text-slate-200">{summary.standings?.played ?? 0}</span>
            </div>
            <div className="p-3 rounded-xl bg-black/30 border border-white/5">
              <span className="text-[11px] text-emerald-400 uppercase font-bold tracking-wider block">Won</span>
              <span className="text-2xl font-black text-emerald-400">{summary.standings?.won ?? 0}</span>
            </div>
            <div className="p-3 rounded-xl bg-black/30 border border-white/5">
              <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider block">Drawn</span>
              <span className="text-2xl font-black text-slate-300">{summary.standings?.drawn ?? 0}</span>
            </div>
            <div className="p-3 rounded-xl bg-black/30 border border-white/5">
              <span className="text-[11px] text-rose-400 uppercase font-bold tracking-wider block">Lost</span>
              <span className="text-2xl font-black text-rose-400">{summary.standings?.lost ?? 0}</span>
            </div>
            <div className="p-3 rounded-xl bg-black/30 border border-white/5">
              <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider block">GF / GA</span>
              <span className="text-lg font-black text-white">{summary.standings?.gf ?? 0} : {summary.standings?.ga ?? 0}</span>
            </div>
            <div className="p-3 rounded-xl bg-black/30 border border-white/5">
              <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider block">GD</span>
              <span className={`text-2xl font-black ${
                (summary.standings?.gd || 0) > 0 ? 'text-emerald-400' : (summary.standings?.gd || 0) < 0 ? 'text-rose-400' : 'text-slate-300'
              }`}>
                {formatGoalDifference(summary.standings?.gd || 0)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Tabs Switcher: Squad Roster vs Fixtures */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('squad')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'squad'
                ? 'bg-gradient-to-r from-blue-600 to-rose-600 text-white shadow-lg shadow-rose-900/30'
                : darkMode
                  ? 'bg-slate-800 text-slate-400 hover:text-white'
                  : 'bg-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            Squad Roster ({squad.length})
          </button>
          <button
            onClick={() => setActiveTab('fixtures')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'fixtures'
                ? 'bg-gradient-to-r from-blue-600 to-rose-600 text-white shadow-lg shadow-rose-900/30'
                : darkMode
                  ? 'bg-slate-800 text-slate-400 hover:text-white'
                  : 'bg-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            Fixtures & Results ({matches.length})
          </button>
        </div>

        {activeTab === 'squad' && (
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold">
            {['All', 'Goalkeeper', 'Defender', 'Midfielder', 'Forward'].map((pos) => (
              <button
                key={pos}
                onClick={() => setPositionFilter(pos)}
                className={`px-3 py-1.5 rounded-lg border transition-colors ${
                  positionFilter === pos
                    ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold'
                    : darkMode
                      ? 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                      : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900'
                }`}
              >
                {pos}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tab Content: Squad */}
      {activeTab === 'squad' && (
        <div className="space-y-8">
          {Object.entries(squadByPosition).map(([pos, players]) => {
            if (players.length === 0) return null;
            return (
              <div key={pos}>
                <h3 className={`text-base font-extrabold uppercase tracking-wider mb-4 flex items-center gap-2 ${
                  darkMode ? 'text-amber-400' : 'text-blue-900'
                }`}>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  {pos}s ({players.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {players.map((p) => (
                    <Link
                      key={p.player_id || p.id}
                      to={`/players/${p.player_id || p.id}`}
                      className={`p-4 rounded-2xl border transition-all hover:scale-[1.02] flex items-center gap-4 ${
                        darkMode
                          ? 'bg-slate-900/80 border-slate-800 hover:border-amber-400/40'
                          : 'bg-white border-amber-100 shadow-sm hover:border-blue-400/40'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-amber-400 font-black text-lg border border-slate-700">
                        {p.shirt_number || '#'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm truncate text-white">
                          {p.name}
                        </h4>
                        <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>{p.position}</span>
                          <span>•</span>
                          <span>{p.nationality || 'Spain'}</span>
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}

          {squad.length === 0 && (
            <div className={`p-12 text-center rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'}`}>
              No squad registration records found for this club in {selectedSeason?.season_label || 'this season'}.
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Fixtures */}
      {activeTab === 'fixtures' && (
        <div>
          {matches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {matches.map((m) => (
                <MatchCard key={m.match_id || m.id} match={m} />
              ))}
            </div>
          ) : (
            <div className={`p-12 text-center rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'}`}>
              No fixtures found for this club in {selectedSeason?.season_label || 'this season'}.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TeamDetail;
