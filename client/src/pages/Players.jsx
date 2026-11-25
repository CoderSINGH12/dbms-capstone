import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPlayers, fetchNationalities, setPlayerFilters } from '../redux/playersSlice.js';
import { useDebounce } from '../hooks/useDebounce.js';
import { useSelectedSeason } from '../hooks/useSelectedSeason.js';
import PlayerCard from '../components/PlayerCard.jsx';
import Pagination from '../components/Pagination.jsx';
import SeasonSelector from '../components/SeasonSelector.jsx';
import Loader from '../components/Loader.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import EmptyState from '../components/EmptyState.jsx';

const POSITIONS = ['All', 'Goalkeeper', 'Defender', 'Midfielder', 'Forward'];
const SORT_OPTIONS = [
  { value: 'goals_desc', label: 'Top Scorers (Goals ↓)' },
  { value: 'assists_desc', label: 'Playmakers (Assists ↓)' },
  { value: 'minutes_desc', label: 'Minutes Played (Most ↓)' },
  { value: 'appearances_desc', label: 'Appearances (Most ↓)' },
  { value: 'name_asc', label: 'Name (A–Z)' },
  { value: 'number_asc', label: 'Squad Number (1–99)' },
];

function Players() {
  const dispatch = useDispatch();
  const { items: players, pagination, nationalities, loading, error } = useSelector((s) => s.players);
  const { selectedSeasonId } = useSelectedSeason();

  const [search, setSearch] = useState('');
  const [position, setPosition] = useState('All');
  const [nationality, setNationality] = useState('All');
  const [sort, setSort] = useState('goals_desc');
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 300);

  // Load distinct nationalities on mount or season change
  useEffect(() => {
    dispatch(fetchNationalities({ seasonId: selectedSeasonId }));
  }, [dispatch, selectedSeasonId]);

  // Fetch players with server-side query parameters
  const loadPlayers = useCallback(() => {
    dispatch(
      fetchPlayers({
        seasonId: selectedSeasonId,
        position,
        nationality,
        q: debouncedSearch,
        sort,
        page,
        limit: 12,
      })
    );
  }, [dispatch, selectedSeasonId, position, nationality, debouncedSearch, sort, page]);

  useEffect(() => {
    loadPlayers();
  }, [loadPlayers]);

  // Reset to page 1 when filters change
  const handleFilterChange = (setter, value) => {
    setter(value);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch('');
    setPosition('All');
    setNationality('All');
    setSort('goals_desc');
    setPage(1);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#004D98]/30">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#EDBB00] tracking-tight font-heading drop-shadow-[0_0_20px_rgba(237,187,0,0.35)]">
            Player Directory & Squad Roster
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Server-side filtered squad database across active and historical campaigns.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <SeasonSelector />
        </div>
      </div>

      {error && <ErrorBanner error={error} onRetry={loadPlayers} />}

      {/* Filter and Search Bar */}
      <div className="p-5 rounded-3xl border border-[#004D98]/30 bg-gradient-to-br from-[#060F2B]/90 via-[#030718]/95 to-[#081335]/90 backdrop-blur-2xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.85)] space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search player or club..."
              className="w-full pl-9 pr-4 py-2.5 bg-[#030718] border border-[#004D98]/40 hover:border-[#EDBB00]/60 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#EDBB00]/40 transition-colors"
            />
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
          </div>

          {/* Position Filter */}
          <div>
            <select
              value={position}
              onChange={(e) => handleFilterChange(setPosition, e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#030718] border border-[#004D98]/40 hover:border-[#EDBB00]/60 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#EDBB00]/40 transition-colors cursor-pointer"
            >
              {POSITIONS.map((pos) => (
                <option key={pos} value={pos}>
                  Position: {pos}
                </option>
              ))}
            </select>
          </div>

          {/* Nationality Filter */}
          <div>
            <select
              value={nationality}
              onChange={(e) => handleFilterChange(setNationality, e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#030718] border border-[#004D98]/40 hover:border-[#EDBB00]/60 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#EDBB00]/40 transition-colors cursor-pointer"
            >
              <option value="All">Nationality: All</option>
              {nationalities.map((nat) => (
                <option key={nat} value={nat}>
                  {nat}
                </option>
              ))}
            </select>
          </div>

          {/* Sorting */}
          <div>
            <select
              value={sort}
              onChange={(e) => handleFilterChange(setSort, e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#030718] border border-[#004D98]/40 hover:border-[#EDBB00]/60 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#EDBB00]/40 transition-colors cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results summary & reset */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-[#004D98]/20">
          <span>
            Showing <strong className="text-white">{players.length}</strong> of{' '}
            <strong className="text-[#EDBB00]">{pagination.total}</strong> registered players
          </span>
          {(search || position !== 'All' || nationality !== 'All' || sort !== 'goals_desc') && (
            <button
              onClick={handleResetFilters}
              className="text-[#EDBB00] hover:text-[#FFD100] font-semibold transition-colors"
            >
              Reset Filters ↺
            </button>
          )}
        </div>
      </div>

      {/* Players Grid */}
      {loading ? (
        <Loader message="Querying player registry from MySQL..." size="default" />
      ) : players.length === 0 ? (
        <EmptyState
          title="No players matched your criteria"
          message="Try searching for another name or reset your position/nationality filters."
          action={
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-lg bg-amber-400 text-slate-950 font-bold text-xs"
            >
              Clear All Filters
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {players.map((player) => (
            <PlayerCard key={player.registration_id || player.player_id} player={player} />
          ))}
        </div>
      )}

      {/* Server-Side Pagination */}
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

export default Players;
