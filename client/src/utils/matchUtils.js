/**
 * Match utility functions for display formatting and badge styling.
 * Supports arbitrary focus teams (default: 1 for FC Barcelona).
 */

// ─── Match Result ───────────────────────────────────────────────────────────

export function getMatchResult(match, focusTeamId = 1) {
  if (!match || match.status?.toLowerCase() !== 'finished') return null;

  const homeScore = match.home_score !== undefined ? match.home_score : match.score?.fullTime?.home;
  const awayScore = match.away_score !== undefined ? match.away_score : match.score?.fullTime?.away;

  if (homeScore === null || awayScore === null || homeScore === undefined || awayScore === undefined) {
    return null;
  }

  const homeId = match.home_team_id || match.homeTeam?.id;
  const isFocusHome = homeId === focusTeamId;

  const focusScore = isFocusHome ? homeScore : awayScore;
  const oppScore = isFocusHome ? awayScore : homeScore;

  if (focusScore > oppScore) return 'WIN';
  if (focusScore < oppScore) return 'LOSS';
  return 'DRAW';
}

// ─── Result Badge Classes ───────────────────────────────────────────────────

export function getResultBadgeClass(result) {
  switch (result) {
    case 'WIN':
    case 'W':
      return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
    case 'LOSS':
    case 'L':
      return 'bg-rose-500/20 text-rose-400 border border-rose-500/30';
    case 'DRAW':
    case 'D':
      return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
    default:
      return 'bg-slate-500/20 text-slate-400 border border-slate-500/30';
  }
}

// ─── Date & Time Formatting ─────────────────────────────────────────────────

export function formatMatchDate(dateStr) {
  if (!dateStr) return 'TBD';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatMatchTime(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ─── Position Helpers ───────────────────────────────────────────────────────

export function formatPosition(position) {
  switch (position) {
    case 'Goalkeeper': return 'GK';
    case 'Defender':
    case 'Defence': return 'DEF';
    case 'Midfielder':
    case 'Midfield': return 'MID';
    case 'Forward':
    case 'Offence': return 'FWD';
    default: return position || 'N/A';
  }
}

export function getPositionColor(position) {
  switch (position) {
    case 'Goalkeeper':
      return 'bg-amber-500/15 text-amber-400 border border-amber-500/30';
    case 'Defender':
    case 'Defence':
      return 'bg-blue-500/15 text-blue-400 border border-blue-500/30';
    case 'Midfielder':
    case 'Midfield':
      return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30';
    case 'Forward':
    case 'Offence':
      return 'bg-rose-500/15 text-rose-400 border border-rose-500/30';
    default:
      return 'bg-slate-500/15 text-slate-400 border border-slate-500/30';
  }
}