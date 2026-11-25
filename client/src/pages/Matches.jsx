import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMatches, setMatchFilters } from '../redux/matchesSlice.js';
import { fetchTeams } from '../redux/teamsSlice.js';
import { useSelectedSeason } from '../hooks/useSelectedSeason.js';
import MatchCard from '../components/MatchCard.jsx';
import SeasonSelector from '../components/SeasonSelector.jsx';
import Pagination from '../components/Pagination.jsx';
import Loader from '../components/Loader.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import EmptyState from '../components/EmptyState.jsx';

const STATUS_FILTERS = [
  { value: 'All', label: 'All Statuses' },
  { value: 'finished', label: 'Finished (Results)' },
  { value: 'scheduled', label: 'Scheduled (Upcoming)' },
];

function Matches() {
  const dispatch = useDispatch();
  const { items: matches, pagination, loading, error } = useSelector((s) => s.matches);
  const { items: teams } = useSelector((s) => s.teams);
  const { selectedSeasonId } = useSelectedSeason();

  const [status, setStatus] = useState('All');
  const [teamId, setTeamId] = useState('');
  const [matchday, setMatchday] = useState('');
  const [page, setPage] = useState(1);

  // Load clubs for this season's dropdown
  useEffect(() => {
    dispatch(fetchTeams(selectedSeasonId));
  }, [dispatch, selectedSeasonId]);

  const loadMatches = useCallback(() => {
    dispatch(
      fetchMatches({
        seasonId: selectedSeasonId,
        status: status !== 'All' ? status : undefined,
        teamId: teamId ? Number(teamId) : undefined,
        matchday: matchday ? Number(matchday) : undefined,
        page,
        limit: 12,
      })
    );
  }, [dispatch, selectedSeasonId, status, teamId, matchday, page]);

  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  const handleResetFilters = () => {
    setStatus('All');
    setTeamId('');
    setMatchday('');
    setPage(1);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#004D98]/30">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#EDBB00] tracking-tight font-heading drop-shadow-[0_0_20px_rgba(237,187,0,0.35)]">
            La Liga Fixtures & Results
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Verified match scores, upcoming schedules, and stadium details.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <SeasonSelector />
        </div>
      </div>

      {error && <ErrorBanner error={error} onRetry={loadMatches} />}

      {/* Filter Bar */}
      <div className="p-5 rounded-3xl border border-[#004D98]/30 bg-gradient-to-br from-[#060F2B]/90 via-[#030718]/95 to-[#081335]/90 backdrop-blur-2xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.85)] space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Match Status</label>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="w-full px-3.5 py-2.5 bg-[#030718] border border-[#004D98]/40 hover:border-[#EDBB00]/60 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#EDBB00]/40 cursor-pointer transition-colors"
            >
              {STATUS_FILTERS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          {/* Team Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Filter by Club</label>
            <select
              value={teamId}
              onChange={(e) => {
                setTeamId(e.target.value);
                setPage(1);
              }}
              className="w-full px-3.5 py-2.5 bg-[#030718] border border-[#004D98]/40 hover:border-[#EDBB00]/60 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#EDBB00]/40 cursor-pointer transition-colors"
            >
              <option value="">All La Liga Clubs</option>
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Matchday Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Matchday (1–38)</label>
            <select
              value={matchday}
              onChange={(e) => {
                setMatchday(e.target.value);
                setPage(1);
              }}
              className="w-full px-3.5 py-2.5 bg-[#030718] border border-[#004D98]/40 hover:border-[#EDBB00]/60 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#EDBB00]/40 cursor-pointer transition-colors"
            >
              <option value="">All Matchdays</option>
              {Array.from({ length: 38 }, (_, i) => i + 1).map((md) => (
                <option key={md} value={md}>
                  Matchday {md}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Summary */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-[#004D98]/20">
          <span>
            Displaying <strong className="text-white">{matches.length}</strong> of{' '}
            <strong className="text-[#EDBB00]">{pagination.total}</strong> matches
          </span>
          {(status !== 'All' || teamId || matchday) && (
            <button
              onClick={handleResetFilters}
              className="text-[#EDBB00] hover:text-[#FFD100] font-semibold transition-colors"
            >
              Reset Filters ↺
            </button>
          )}
        </div>
      </div>

      {/* Matches Grid */}
      {loading ? (
        <Loader message="Loading matches from MySQL database..." size="default" />
      ) : matches.length === 0 ? (
        <EmptyState
          title="No fixtures found"
          message="No matches matched your selected status or club filters for this season."
          action={
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-lg bg-amber-400 text-slate-950 font-bold text-xs"
            >
              Reset All Filters
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} focusTeamId={1} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.total > 12 && (
        <Pagination
          currentPage={page}
          totalItems={pagination.total}
          itemsPerPage={12}
          onPageChange={(newPage) => setPage(newPage)}
        />
      )}
    </div>
  );
}

export default Matches;