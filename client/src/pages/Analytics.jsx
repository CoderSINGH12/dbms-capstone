import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { analyticsService } from '../services/analyticsService.js';
import { useSelectedSeason } from '../hooks/useSelectedSeason.js';
import Loader from '../components/Loader.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import DataTable from '../components/DataTable.jsx';
import ChartComponent from '../components/ChartComponent.jsx';
import PointsProgressChart from '../components/charts/PointsProgressChart.jsx';
import HomeAwayChart from '../components/charts/HomeAwayChart.jsx';

function Analytics() {
  const { selectedSeason } = useSelectedSeason();
  const { darkMode } = useSelector((state) => state.ui);
  const seasonId = selectedSeason?.id || 1;

  const [tab, setTab] = useState('scorers');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [topScorers, setTopScorers] = useState([]);
  const [topAssists, setTopAssists] = useState([]);
  const [discipline, setDiscipline] = useState([]);
  const [minutes, setMinutes] = useState([]);

  useEffect(() => {
    let isMounted = true;
    async function fetchAnalyticsData() {
      setLoading(true);
      setError(null);
      try {
        const [scorersRes, assistsRes, disciplineRes, minutesRes] = await Promise.all([
          analyticsService.getTopScorers(seasonId, 25).catch(() => []),
          analyticsService.getTopAssists(seasonId, 25).catch(() => []),
          analyticsService.getCards(seasonId, 25).catch(() => []),
          analyticsService.getMinutes(seasonId, 25).catch(() => []),
        ]);

        if (isMounted) {
          setTopScorers(scorersRes);
          setTopAssists(assistsRes);
          setDiscipline(disciplineRes);
          setMinutes(minutesRes);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to fetch advanced analytics data');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchAnalyticsData();

    return () => {
      isMounted = false;
    };
  }, [seasonId]);

  const scorerColumns = [
    {
      key: 'rank',
      label: '#',
      render: (_, __, i) => <span className="font-bold text-amber-400">#{i + 1}</span>,
    },
    {
      key: 'player_name',
      label: 'Player',
      render: (val, row) => (
        <div>
          <span className="font-bold text-white block">{val}</span>
          <span className="text-xs text-slate-400">{row.team_name || row.team_short_name || 'FC Barcelona'}</span>
        </div>
      ),
    },
    { key: 'goals', label: 'Goals ⚽', render: (v) => <span className="font-extrabold text-amber-400 text-base">{v}</span> },
    { key: 'penalty_goals', label: 'Penalties', render: (v) => v || 0 },
    { key: 'appearances', label: 'Matches', render: (v) => v || 0 },
    {
      key: 'goals_per_game',
      label: 'Goals / Game',
      render: (v) => v ? Number(v).toFixed(2) : '-',
    },
  ];

  const assistColumns = [
    {
      key: 'rank',
      label: '#',
      render: (_, __, i) => <span className="font-bold text-amber-400">#{i + 1}</span>,
    },
    {
      key: 'player_name',
      label: 'Player',
      render: (val, row) => (
        <div>
          <span className="font-bold text-white block">{val}</span>
          <span className="text-xs text-slate-400">{row.team_name || row.team_short_name || 'FC Barcelona'}</span>
        </div>
      ),
    },
    { key: 'assists', label: 'Assists 👟', render: (v) => <span className="font-extrabold text-blue-400 text-base">{v}</span> },
    { key: 'goals', label: 'Goals', render: (v) => v || 0 },
    { key: 'appearances', label: 'Matches', render: (v) => v || 0 },
  ];

  const disciplineColumns = [
    {
      key: 'rank',
      label: '#',
      render: (_, __, i) => <span className="font-bold text-amber-400">#{i + 1}</span>,
    },
    {
      key: 'player_name',
      label: 'Player',
      render: (val, row) => (
        <div>
          <span className="font-bold text-white block">{val}</span>
          <span className="text-xs text-slate-400">{row.team_name || row.team_short_name || 'FC Barcelona'}</span>
        </div>
      ),
    },
    { key: 'yellow', label: 'Yellow 🟨', render: (v) => <span className="font-bold text-amber-300">{v || 0}</span> },
    { key: 'red', label: 'Red 🟥', render: (v) => <span className="font-bold text-rose-500">{v || 0}</span> },
    { key: 'disciplinary_points', label: 'Total Cards', render: (v, r) => (r.yellow || 0) + (r.red || 0) * 2 },
  ];

  const minutesColumns = [
    {
      key: 'rank',
      label: '#',
      render: (_, __, i) => <span className="font-bold text-amber-400">#{i + 1}</span>,
    },
    {
      key: 'player_name',
      label: 'Player',
      render: (val, row) => (
        <div>
          <span className="font-bold text-white block">{val}</span>
          <span className="text-xs text-slate-400">{row.position || 'Player'}</span>
        </div>
      ),
    },
    { key: 'minutes', label: 'Minutes Played ⏱️', render: (v) => <span className="font-bold text-emerald-400">{Number(v).toLocaleString()} min</span> },
    { key: 'appearances', label: 'Appearances', render: (v) => v || 0 },
    { key: 'starts', label: 'Starts', render: (v) => v || 0 },
  ];

  // Chart data for top 8 scorers
  const scorersChartData = {
    labels: topScorers.slice(0, 8).map((p) => p.player_name || 'Player'),
    datasets: [
      {
        label: 'Goals',
        data: topScorers.slice(0, 8).map((p) => p.goals || 0),
        backgroundColor: 'rgba(237, 187, 0, 0.85)',
        borderColor: '#EDBB00',
        borderRadius: 8,
      },
      {
        label: 'Assists',
        data: topScorers.slice(0, 8).map((p) => p.assists || 0),
        backgroundColor: 'rgba(0, 77, 152, 0.75)',
        borderColor: '#004D98',
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="page-container py-6">
      {/* Header */}
      <div className="mb-8 border-b border-[#004D98]/30 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#004D98]/20 text-[#60A5FA] border border-[#004D98]/40 shadow-[0_0_10px_rgba(0,77,152,0.25)]">
                SQL Window Functions & Aggregations
              </span>
              <span className="text-xs text-[#EDBB00] font-bold">
                Season: {selectedSeason?.season_label || '2023-24'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[#EDBB00] font-heading drop-shadow-[0_0_20px_rgba(237,187,0,0.35)]">
              DBMS La Liga Analytics
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Deep player and club metrics powered by relational queries, composite indexes, and aggregated views.
            </p>
          </div>
        </div>
      </div>

      {error && <ErrorBanner message={error} />}

      {loading ? (
        <Loader text="Executing SQL analytics queries..." />
      ) : (
        <div className="space-y-8">
          {/* Top Visual Chart: Top 8 Goal & Assist Contributors */}
          {topScorers.length > 0 && (
            <div className="p-6 rounded-3xl border border-[#004D98]/30 bg-gradient-to-br from-[#060F2B]/90 via-[#030718]/95 to-[#081335]/90 backdrop-blur-2xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.85)]">
              <h2 className="text-lg font-black text-[#EDBB00] mb-1 flex items-center gap-2 font-heading drop-shadow-[0_0_10px_rgba(237,187,0,0.3)]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#004D98]" />
                Goal & Assist Contribution Leaders ({selectedSeason?.season_label})
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                Comparative attacking output evaluated across all tracked appearances.
              </p>
              <div className="h-72">
                <ChartComponent type="bar" data={scorersChartData} />
              </div>
            </div>
          )}

          {/* Sub Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-[#004D98]/20 pb-3">
            {[
              { id: 'scorers', label: 'Top Scorers ⚽', count: topScorers.length },
              { id: 'assists', label: 'Top Assists 👟', count: topAssists.length },
              { id: 'discipline', label: 'Discipline 🟨🟥', count: discipline.length },
              { id: 'minutes', label: 'Minutes & Endurance ⏱️', count: minutes.length },
              { id: 'trends', label: 'Team Progress Trends 📈' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  tab === t.id
                    ? 'bg-gradient-to-r from-[#004D98] to-[#0055B3] text-[#EDBB00] shadow-[0_0_20px_rgba(0,77,152,0.5),inset_0_1px_0_rgba(237,187,0,0.3)] border border-[#0055B3]/60'
                    : 'bg-[#060F2B]/80 text-slate-300 hover:text-[#EDBB00] hover:bg-[#004D98]/15 border border-[#004D98]/20'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab Views */}
          {tab === 'scorers' && (
            <div className="p-6 rounded-3xl border border-[#004D98]/30 bg-gradient-to-br from-[#060F2B]/90 via-[#030718]/95 to-[#081335]/90 backdrop-blur-2xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.85)]">
              <div className="mb-4">
                <h3 className="text-base font-black text-[#EDBB00] font-heading">Pichichi Trophy Race</h3>
                <p className="text-xs text-slate-400">Total league goals scored, penalties converted, and scoring efficiency.</p>
              </div>
              <DataTable columns={scorerColumns} data={topScorers} />
            </div>
          )}

          {tab === 'assists' && (
            <div className="p-6 rounded-3xl border border-[#004D98]/30 bg-gradient-to-br from-[#060F2B]/90 via-[#030718]/95 to-[#081335]/90 backdrop-blur-2xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.85)]">
              <div className="mb-4">
                <h3 className="text-base font-black text-[#EDBB00] font-heading">Playmaker Leaderboard</h3>
                <p className="text-xs text-slate-400">Top assist providers creating scoring chances for their teammates.</p>
              </div>
              <DataTable columns={assistColumns} data={topAssists} />
            </div>
          )}

          {tab === 'discipline' && (
            <div className="p-6 rounded-3xl border border-[#004D98]/30 bg-gradient-to-br from-[#060F2B]/90 via-[#030718]/95 to-[#081335]/90 backdrop-blur-2xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.85)]">
              <div className="mb-4">
                <h3 className="text-base font-black text-[#EDBB00] font-heading">Fair Play & Disciplinary Records</h3>
                <p className="text-xs text-slate-400">Yellow and red card counts recorded by match officials.</p>
              </div>
              <DataTable columns={disciplineColumns} data={discipline} />
            </div>
          )}

          {tab === 'minutes' && (
            <div className="p-6 rounded-3xl border border-[#004D98]/30 bg-gradient-to-br from-[#060F2B]/90 via-[#030718]/95 to-[#081335]/90 backdrop-blur-2xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.85)]">
              <div className="mb-4">
                <h3 className="text-base font-black text-[#EDBB00] font-heading">Squad Workhorses</h3>
                <p className="text-xs text-slate-400">Total playing time registered on the pitch throughout the campaign.</p>
              </div>
              <DataTable columns={minutesColumns} data={minutes} />
            </div>
          )}

          {tab === 'trends' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl border border-[#004D98]/30 bg-gradient-to-br from-[#060F2B]/90 via-[#030718]/95 to-[#081335]/90 backdrop-blur-2xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.85)]">
                <h3 className="text-base font-black text-[#EDBB00] mb-2 font-heading">Points Progression Over Matchdays</h3>
                <p className="text-xs text-slate-400 mb-6">Cumulative league points curve across all completed fixtures.</p>
                <div className="h-64">
                  <PointsProgressChart seasonId={seasonId} />
                </div>
              </div>
              <div className="p-6 rounded-3xl border border-[#004D98]/30 bg-gradient-to-br from-[#060F2B]/90 via-[#030718]/95 to-[#081335]/90 backdrop-blur-2xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.85)]">
                <h3 className="text-base font-black text-[#EDBB00] mb-2 font-heading">Home vs Away Venue Splits</h3>
                <p className="text-xs text-slate-400 mb-6">Points, goal output, and defensive stability segmented by stadium.</p>
                <div className="h-64">
                  <HomeAwayChart seasonId={seasonId} />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Analytics;
