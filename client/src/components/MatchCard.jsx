import React, { useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavoriteMatch } from '../redux/favoritesSlice.js';
import { formatMatchDate, formatMatchTime, getMatchResult, getResultBadgeClass } from '../utils/matchUtils.js';

function MatchCard({ match, focusTeamId = 1 }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { darkMode } = useSelector((s) => s.ui);
  const favoriteMatchIds = useSelector((s) => s.favorites.matchIds || []);

  const isFavorite = favoriteMatchIds.includes(match.id);
  const isFinished = match.status?.toLowerCase() === 'finished';

  const homeId = match.home_team_id || match.homeTeam?.id;
  const awayId = match.away_team_id || match.awayTeam?.id;
  const isFocusHome = homeId === focusTeamId;
  const isFocusAway = awayId === focusTeamId;
  const isFocusParticipant = isFocusHome || isFocusAway;

  const result = useMemo(() => {
    return isFocusParticipant ? getMatchResult(match, focusTeamId) : null;
  }, [match, focusTeamId, isFocusParticipant]);

  const homeScore = match.home_score !== undefined ? match.home_score : match.score?.fullTime?.home;
  const awayScore = match.away_score !== undefined ? match.away_score : match.score?.fullTime?.away;

  const homeName = match.home_short_name || match.home_name || match.homeTeam?.shortName || match.homeTeam?.name || 'Home';
  const awayName = match.away_short_name || match.away_name || match.awayTeam?.shortName || match.awayTeam?.name || 'Away';
  const homeCrest = match.home_crest || match.homeTeam?.crest;
  const awayCrest = match.away_crest || match.awayTeam?.crest;

  const handleClick = useCallback(() => {
    navigate(`/matches/${match.id}`);
  }, [navigate, match.id]);

  const handleFavorite = useCallback((e) => {
    e.stopPropagation();
    dispatch(toggleFavoriteMatch(match.id));
  }, [dispatch, match.id]);

  const dateStr = match.kickoff_utc || match.utcDate;

  return (
    <div
      onClick={handleClick}
      className="p-5 rounded-3xl border border-[#004D98]/30 bg-gradient-to-br from-[#060F2B]/90 via-[#030718]/95 to-[#081335]/90 hover:border-[#0055B3]/60 backdrop-blur-2xl transition-all duration-300 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.85),0_0_25px_rgba(0,77,152,0.25)] hover:shadow-[0_25px_60px_-10px_rgba(0,0,0,0.9),0_0_35px_rgba(0,77,152,0.4),0_0_20px_rgba(237,187,0,0.2)] hover:-translate-y-1.5 group relative overflow-hidden cursor-pointer"
    >
      {/* Top Accent Gradient on Hover (Blaugrana Royal Blue to Catalan Gold) */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#004D98] via-[#EDBB00] to-[#0055B3] opacity-60 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_12px_#EDBB00]" />

      {/* Top Row: Matchday & Favorite */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-black tracking-wider uppercase px-3 py-1 rounded-full bg-[#004D98]/20 text-[#60A5FA] border border-[#004D98]/40 shadow-[0_0_12px_rgba(0,77,152,0.3)]">
          Matchday {match.matchday || '—'}
        </span>

        <button
          onClick={handleFavorite}
          className="p-1.5 rounded-xl transition-all hover:bg-white/10 text-slate-400 hover:text-[#EDBB00]"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <svg
            className={`w-4 h-4 transition-transform ${isFavorite ? 'text-[#EDBB00] fill-current scale-110 drop-shadow-[0_0_8px_#EDBB00]' : ''}`}
            fill={isFavorite ? 'currentColor' : 'none'}
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Match Teams and Score */}
      <div className="flex items-center justify-between gap-3 my-2">
        {/* Home Club */}
        <div className={`flex-1 flex flex-col items-center text-center ${isFocusHome ? 'font-bold' : 'opacity-85'}`}>
          <div className="w-13 h-13 mb-2 p-2 rounded-2xl bg-[#030718] border border-[#004D98]/30 flex items-center justify-center shadow-inner group-hover:scale-105 group-hover:border-[#0055B3]/60 transition-all">
            {homeCrest ? (
              <img src={homeCrest} alt={homeName} className="w-9 h-9 object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
            ) : (
              <span className="text-xs font-bold text-slate-300">{(homeName).substring(0, 3).toUpperCase()}</span>
            )}
          </div>
          <p className="text-xs font-bold text-white truncate max-w-[100px]">{homeName}</p>
          {isFocusHome && (
            <span className="text-[9px] font-black tracking-widest text-[#EDBB00] uppercase mt-0.5 drop-shadow-[0_0_8px_rgba(237,187,0,0.5)]">BARÇA</span>
          )}
        </div>

        {/* Score / Status with Catalan Gold Highlights */}
        <div className="flex flex-col items-center px-2 shrink-0">
          {isFinished ? (
            <>
              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-[#02040E]/80 border border-[#004D98]/40 shadow-inner">
                <span className="text-2xl font-black text-[#EDBB00] font-heading drop-shadow-[0_0_10px_rgba(237,187,0,0.4)]">{homeScore ?? 0}</span>
                <span className="text-slate-500 font-bold">:</span>
                <span className="text-2xl font-black text-[#EDBB00] font-heading drop-shadow-[0_0_10px_rgba(237,187,0,0.4)]">{awayScore ?? 0}</span>
              </div>
              {result && (
                <span className={`mt-2 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${getResultBadgeClass(result)}`}>
                  {result}
                </span>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center">
              <span className="text-xs font-semibold text-slate-300">{formatMatchTime(dateStr) || 'TBD'}</span>
              <span className="text-[10px] font-black uppercase tracking-wider mt-1.5 px-2.5 py-0.5 rounded-full bg-[#EDBB00]/15 text-[#EDBB00] border border-[#EDBB00]/40 shadow-[0_0_10px_rgba(237,187,0,0.25)]">
                UPCOMING
              </span>
            </div>
          )}
        </div>

        {/* Away Club */}
        <div className={`flex-1 flex flex-col items-center text-center ${isFocusAway ? 'font-bold' : 'opacity-85'}`}>
          <div className="w-12 h-12 mb-2 p-1.5 rounded-xl bg-[#030718] border border-[#004D98]/30 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            {awayCrest ? (
              <img src={awayCrest} alt={awayName} className="w-full h-full object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
            ) : (
              <span className="text-xs font-bold text-slate-300">{(awayName).substring(0, 3).toUpperCase()}</span>
            )}
          </div>
          <p className="text-xs font-semibold text-slate-200 truncate max-w-[100px]">{awayName}</p>
          {isFocusAway && (
            <span className="text-[9px] font-bold tracking-wider text-[#EDBB00] mt-0.5">BARÇA</span>
          )}
        </div>
      </div>

      {/* Date & Venue Footer */}
      <div className="mt-4 pt-3 border-t border-[#004D98]/20 flex items-center justify-between text-[11px] text-slate-400">
        <span>{formatMatchDate(dateStr)}</span>
        <span className="truncate max-w-[110px] text-right">{match.venue || 'La Liga'}</span>
      </div>
    </div>
  );
}

export default React.memo(MatchCard);
