import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useSelectedSeason } from '../hooks/useSelectedSeason.js';
import { teamService } from '../services/teamService.js';
import { matchService } from '../services/matchService.js';
import { formatGoalDifference, formatPercentage } from '../utils/formatters.js';
import SeasonSelector from '../components/SeasonSelector.jsx';
import MatchCard from '../components/MatchCard.jsx';
import ChartComponent from '../components/ChartComponent.jsx';
import HomeAwayChart from '../components/charts/HomeAwayChart.jsx';
import PointsProgressChart from '../components/charts/PointsProgressChart.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import Loader from '../components/Loader.jsx';
import CoverageBadge from '../components/CoverageBadge.jsx';

function Dashboard() {
  const { selectedSeasonId, selectedSeason } = useSelectedSeason();
  const [seasonSummary, setSeasonSummary] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch Barça (team ID 1) season summary
      const summaryData = await teamService.getTeamSeasonSummary(1, selectedSeasonId);
      setSeasonSummary(summaryData);

      // 2. Fetch matches for season
      const matchesData = await matchService.getMatches({
        seasonId: selectedSeasonId,
        teamId: 1,
        limit: 38,
      });
      setMatches(matchesData.data || []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [selectedSeasonId]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  if (loading && !seasonSummary) {
    return <Loader message={`Loading FC Barcelona season ${selectedSeason?.label || ''}...`} size="large" />;
  }

  const standings = seasonSummary?.standings;
  const summary = seasonSummary?.summary;
  const recentForm = seasonSummary?.recentForm || [];
  const nextMatch = seasonSummary?.nextMatch;
  const topPerformers = seasonSummary?.topScorers || [];

  const finishedMatches = matches.filter((m) => m.status?.toLowerCase() === 'finished');
  const recentFinishedMatches = [...finishedMatches].slice(0, 4);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#004D98]/30">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-[#EDBB00] tracking-tight font-heading drop-shadow-[0_0_20px_rgba(237,187,0,0.35)]">
              Camp Nou Dashboard
            </h1>
            {selectedSeason && <CoverageBadge coverage={selectedSeason.coverage} />}
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time match metrics, relational SQL analytics, and official records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <SeasonSelector />
          <button
            onClick={loadDashboardData}
            className="p-2 rounded-xl bg-[#004D98] hover:bg-[#0055B3] text-[#EDBB00] border border-[#0055B3] shadow-[0_0_15px_rgba(0,77,152,0.4)] transition-all"
            title="Refresh from MySQL database"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {error && <ErrorBanner error={error} onRetry={loadDashboardData} />}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* League Standing */}
        <div className="p-6 rounded-3xl border border-[#004D98]/30 bg-gradient-to-br from-[#060F2B]/90 via-[#030718]/95 to-[#081335]/90 backdrop-blur-2xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.85),0_0_25px_rgba(0,77,152,0.25)] hover:border-[#0055B3]/60 hover:shadow-[0_25px_60px_-10px_rgba(0,0,0,0.9),0_0_35px_rgba(0,77,152,0.4),0_0_20px_rgba(237,187,0,0.2)] hover:-translate-y-1 transition-all relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400">La Liga Standing</span>
            <span className="px-3 py-1 rounded-full bg-[#EDBB00] text-[#030718] font-black text-xs shadow-[0_0_12px_#EDBB00]">
              #{standings?.position || '—'}
            </span>
          </div>
          <p className="text-3xl sm:text-4xl font-black text-[#EDBB00] font-heading drop-shadow-[0_0_16px_rgba(237,187,0,0.45)]">
            {standings?.points ?? 0} <span className="text-xs font-bold text-slate-400">PTS</span>
          </p>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
            <span>{standings?.played ?? 0} played</span>
            <span>•</span>
            <span className="text-[#EDBB00] font-bold">{standings?.won ?? 0} wins</span>
          </div>
        </div>

        {/* Win Rate */}
        <div className="p-6 rounded-3xl border border-[#004D98]/30 bg-gradient-to-br from-[#060F2B]/90 via-[#030718]/95 to-[#081335]/90 backdrop-blur-2xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.85),0_0_25px_rgba(0,77,152,0.25)] hover:border-[#0055B3]/60 hover:shadow-[0_25px_60px_-10px_rgba(0,0,0,0.9),0_0_35px_rgba(0,77,152,0.4),0_0_20px_rgba(237,187,0,0.2)] hover:-translate-y-1 transition-all relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400">Win Rate</span>
            <span className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-black text-xs shadow-[0_0_10px_rgba(16,185,129,0.3)]">
              %
            </span>
          </div>
          <p className="text-3xl sm:text-4xl font-black text-emerald-400 font-heading">
            {formatPercentage(standings?.won, standings?.played)}
          </p>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
            <span className="text-emerald-400 font-bold">{standings?.won ?? 0}W</span>
            <span>{standings?.drawn ?? 0}D</span>
            <span className="text-[#0055B3] font-bold">{standings?.lost ?? 0}L</span>
          </div>
        </div>

        {/* Goals Scored & Conceded */}
        <div className="p-6 rounded-3xl border border-[#004D98]/30 bg-gradient-to-br from-[#060F2B]/90 via-[#030718]/95 to-[#081335]/90 backdrop-blur-2xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.85),0_0_25px_rgba(0,77,152,0.25)] hover:border-[#0055B3]/60 hover:shadow-[0_25px_60px_-10px_rgba(0,0,0,0.9),0_0_35px_rgba(0,77,152,0.4),0_0_20px_rgba(237,187,0,0.2)] hover:-translate-y-1 transition-all relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400">Goals (GF / GA)</span>
            <span className="w-8 h-8 rounded-xl bg-[#004D98]/20 text-[#60A5FA] border border-[#004D98]/40 flex items-center justify-center font-bold text-xs shadow-[0_0_10px_rgba(0,77,152,0.3)]">
              ⚽
            </span>
          </div>
          <p className="text-3xl sm:text-4xl font-black text-white font-heading">
            {standings?.gf ?? 0} <span className="text-slate-600 font-light">/</span> {standings?.ga ?? 0}
          </p>
          <p className="text-xs text-slate-400 mt-2 font-medium">
            Avg {(Number(standings?.gf || 0) / Math.max(Number(standings?.played || 1), 1)).toFixed(2)} goals / match
          </p>
        </div>

        {/* Goal Difference */}
        <div className="p-6 rounded-3xl border border-[#004D98]/30 bg-gradient-to-br from-[#060F2B]/90 via-[#030718]/95 to-[#081335]/90 backdrop-blur-2xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.85),0_0_25px_rgba(0,77,152,0.25)] hover:border-[#0055B3]/60 hover:shadow-[0_25px_60px_-10px_rgba(0,0,0,0.9),0_0_35px_rgba(0,77,152,0.4),0_0_20px_rgba(237,187,0,0.2)] hover:-translate-y-1 transition-all relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400">Goal Difference</span>
            <span className="w-8 h-8 rounded-xl bg-[#004D98]/20 text-[#60A5FA] border border-[#004D98]/40 flex items-center justify-center font-black text-xs shadow-[0_0_10px_rgba(0,77,152,0.3)]">
              GD
            </span>
          </div>
          <p
            className={`text-3xl sm:text-4xl font-black font-heading ${
              Number(standings?.gd || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {formatGoalDifference(standings?.gd)}
          </p>
          <p className="text-xs text-slate-400 mt-2 font-medium">
            Clean Sheets: <span className="text-[#EDBB00] font-black">{summary?.clean_sheets || 0}</span>
          </p>
        </div>
      </div>

      {/* Next Match & Form Guide Banner */}
      {/* Next Match & Form Guide Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Next Scheduled Fixture with Glowing Border */}
        <div className="lg:col-span-2 p-7 rounded-3xl border border-[#004D98]/40 bg-gradient-to-br from-[#004D98]/25 via-[#030718]/95 to-[#060F2B]/90 backdrop-blur-2xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.85),0_0_35px_rgba(0,77,152,0.35)] relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-wider font-extrabold text-[#EDBB00] flex items-center gap-1.5 drop-shadow-[0_0_8px_rgba(237,187,0,0.4)]">
                <span className="w-2 h-2 rounded-full bg-[#EDBB00] animate-ping" />
                Next Official Fixture
              </span>
              <span className="text-xs text-slate-400 font-mono">Matchday {nextMatch?.matchday || '—'}</span>
            </div>

            {nextMatch ? (
              <div className="flex items-center justify-around py-4">
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 p-2 bg-[#02040E] border border-[#004D98]/30 rounded-2xl flex items-center justify-center shadow-md mb-2">
                    {nextMatch.home_crest ? (
                      <img src={nextMatch.home_crest} alt={nextMatch.home_name} className="w-full h-full object-contain" />
                    ) : (
                      <span className="font-bold text-sm text-slate-200">{nextMatch.home_name?.substring(0, 3)}</span>
                    )}
                  </div>
                  <span className="font-bold text-sm text-white">{nextMatch.home_name}</span>
                </div>

                <div className="flex flex-col items-center">
                  <span className="text-xl font-black text-[#0055B3]">VS</span>
                  <span className="text-xs text-[#EDBB00] font-semibold mt-1">{nextMatch.venue || 'Estadi Olímpic'}</span>
                  <span className="text-[11px] text-slate-400 mt-0.5">{nextMatch.kickoff_utc || 'Upcoming'}</span>
                </div>

                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 p-2 bg-[#02040E] border border-[#004D98]/30 rounded-2xl flex items-center justify-center shadow-md mb-2">
                    {nextMatch.away_crest ? (
                      <img src={nextMatch.away_crest} alt={nextMatch.away_name} className="w-full h-full object-contain" />
                    ) : (
                      <span className="font-bold text-sm text-slate-200">{nextMatch.away_name?.substring(0, 3)}</span>
                    )}
                  </div>
                  <span className="font-bold text-sm text-white">{nextMatch.away_name}</span>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400 text-sm">
                No further scheduled fixtures for this campaign period.
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#004D98]/20 flex items-center justify-between text-xs text-slate-400">
            <span>Official La Liga EA Sports Calendar</span>
            <Link to="/matches" className="text-[#EDBB00] hover:underline font-semibold flex items-center gap-1">
              Full Schedule & Fixtures →
            </Link>
          </div>
        </div>

        {/* Recent Form Tracker */}
        <div className="p-6 rounded-3xl border border-[#004D98]/30 bg-gradient-to-br from-[#060F2B]/90 via-[#030718]/95 to-[#081335]/90 backdrop-blur-2xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.85)] flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Recent League Form
            </h3>

            <div className="flex items-center justify-between gap-2 my-4">
              {recentForm.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1.5 flex-1">
                  <span
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black shadow-lg ${
                      item.result === 'W'
                        ? 'bg-emerald-500 text-white'
                        : item.result === 'D'
                        ? 'bg-[#EDBB00] text-[#030718]'
                        : 'bg-rose-500 text-white'
                    }`}
                  >
                    {item.result}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate max-w-[48px]">
                    {item.home_name === 'Barcelona' ? `@${item.away_name}` : `vs ${item.home_name}`}
                  </span>
                  <span className="text-[10px] font-mono text-slate-300">
                    {item.home_score}-{item.away_score}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#004D98]/20 flex items-center justify-between text-xs text-slate-400">
            <span>Last 5 Matches Played</span>
            <Link to="/analytics" className="text-[#60A5FA] hover:text-[#EDBB00] hover:underline font-semibold">
              Deep Analytics →
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Match Cards Row */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 font-heading">
            <span className="w-2.5 h-2.5 rounded-full bg-[#004D98]" />
            Recent Match Outings
          </h2>
          <Link to="/matches" className="text-xs font-semibold text-[#EDBB00] hover:underline">
            View All ({matches.length}) →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentFinishedMatches.map((m) => (
            <MatchCard key={m.id} match={m} focusTeamId={1} />
          ))}
        </div>
      </div>

      {/* Interactive Charts Component */}
      <ChartComponent
        stats={{
          wins: standings?.won,
          draws: standings?.drawn,
          losses: standings?.lost,
        }}
        players={topPerformers}
        matches={finishedMatches}
        focusTeamId={1}
      />

      {/* Additional Historical and Venue Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl border border-[#004D98]/30 bg-gradient-to-br from-[#060F2B]/90 via-[#030718]/95 to-[#081335]/90 backdrop-blur-2xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.85)]">
          <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2 font-heading">
            <span className="w-2.5 h-2.5 rounded-full bg-[#004D98]" />
            Home vs Away Performance Split
          </h3>
          <HomeAwayChart summary={summary} />
        </div>

        <div className="p-6 rounded-3xl border border-[#004D98]/30 bg-gradient-to-br from-[#060F2B]/90 via-[#030718]/95 to-[#081335]/90 backdrop-blur-2xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.85)]">
          <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2 font-heading">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EDBB00]" />
            Points Progression Across Matchdays
          </h3>
          <PointsProgressChart matches={finishedMatches} focusTeamId={1} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
