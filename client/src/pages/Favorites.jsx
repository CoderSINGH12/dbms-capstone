import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchMatches } from '../redux/matchesSlice.js';
import { fetchPlayers } from '../redux/playersSlice.js';
import { clearAllFavorites } from '../redux/favoritesSlice.js';
import MatchCard from '../components/MatchCard.jsx';
import PlayerCard from '../components/PlayerCard.jsx';
import Loader from '../components/Loader.jsx';
import EmptyState from '../components/EmptyState.jsx';

function Favorites() {
  const dispatch = useDispatch();
  const { items: matches, loading: mLoading } = useSelector((s) => s.matches);
  const { items: players, loading: pLoading } = useSelector((s) => s.players);
  const { matchIds = [], playerIds = [] } = useSelector((s) => s.favorites);
  const { darkMode } = useSelector((s) => s.ui);
  const [tab, setTab] = useState('matches');

  useEffect(() => {
    if (matches.length === 0) {
      dispatch(fetchMatches({ limit: 100 }));
    }
    if (players.length === 0) {
      dispatch(fetchPlayers({ limit: 100 }));
    }
  }, [dispatch, matches.length, players.length]);

  const handleClear = useCallback(() => {
    if (window.confirm('Remove all saved favorite matches and players?')) {
      dispatch(clearAllFavorites());
    }
  }, [dispatch]);

  const favMatches = useMemo(() => {
    return matches.filter((m) => matchIds.includes(m.match_id || m.id));
  }, [matches, matchIds]);

  const favPlayers = useMemo(() => {
    return players.filter((p) => playerIds.includes(p.player_id || p.id));
  }, [players, playerIds]);

  const total = matchIds.length + playerIds.length;

  if (mLoading && pLoading && total > 0 && matches.length === 0 && players.length === 0) {
    return <Loader text="Retrieving your saved favorites..." />;
  }

  return (
    <div className="page-container py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-[#004D98]/30 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#004D98]/20 text-[#60A5FA] border border-[#004D98]/40 shadow-[0_0_10px_rgba(0,77,152,0.25)]">
              Personalized Shortlist
            </span>
          </div>
          <h1 className="text-3xl font-black text-[#EDBB00] font-heading drop-shadow-[0_0_20px_rgba(237,187,0,0.35)]">Saved Favorites</h1>
          <p className="text-sm text-slate-400 mt-1">
            {total} item{total !== 1 ? 's' : ''} bookmarked in local storage
          </p>
        </div>

        {total > 0 && (
          <button
            onClick={handleClear}
            className="text-xs font-semibold px-4 py-2 rounded-xl transition-all duration-200 active:scale-95 border text-rose-400 border-rose-500/30 hover:bg-rose-500/10"
          >
            Clear All Favorites
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { id: 'matches', label: `Matches (${matchIds.length})` },
          { id: 'players', label: `Players (${playerIds.length})` },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              tab === t.id
                ? 'bg-gradient-to-r from-[#004D98] to-[#0055B3] text-[#EDBB00] shadow-[0_0_20px_rgba(0,77,152,0.5),inset_0_1px_0_rgba(237,187,0,0.3)] border border-[#0055B3]/60'
                : 'bg-[#060F2B]/80 text-slate-300 hover:text-[#EDBB00] hover:bg-[#004D98]/15 border border-[#004D98]/20'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div>
        {tab === 'matches' ? (
          favMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {favMatches.map((m) => (
                <MatchCard key={m.match_id || m.id} match={m} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl border border-[#004D98]/30 bg-gradient-to-br from-[#060F2B]/90 via-[#030718]/95 to-[#081335]/90 backdrop-blur-2xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.85)]">
              <div className="w-16 h-16 rounded-2xl bg-[#030718] mx-auto mb-4 flex items-center justify-center text-[#EDBB00] text-2xl border border-[#004D98]/30">
                ❤️
              </div>
              <h3 className="text-lg font-bold text-white mb-1">No favorite matches bookmarked</h3>
              <p className="text-sm text-slate-400 max-w-sm mx-auto mb-6">
                Click the heart icon on any fixture card or detail view to quickly access it from this tab.
              </p>
              <Link
                to="/matches"
                className="btn-catalan-gold inline-flex"
              >
                Browse All Matches ⚽
              </Link>
            </div>
          )
        ) : (
          favPlayers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {favPlayers.map((p) => (
                <PlayerCard key={p.player_id || p.id} player={p} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl border border-[#004D98]/30 bg-gradient-to-br from-[#060F2B]/90 via-[#030718]/95 to-[#081335]/90 backdrop-blur-2xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.85)]">
              <div className="w-16 h-16 rounded-2xl bg-[#030718] mx-auto mb-4 flex items-center justify-center text-[#EDBB00] text-2xl border border-[#004D98]/30">
                ⭐
              </div>
              <h3 className="text-lg font-bold text-white mb-1">No favorite players bookmarked</h3>
              <p className="text-sm text-slate-400 max-w-sm mx-auto mb-6">
                Save players from the squad roster or profile views to quickly follow their career numbers.
              </p>
              <Link
                to="/players"
                className="btn-catalan-gold inline-flex"
              >
                View Squad Roster 👥
              </Link>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default Favorites;
