import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { analyticsService } from '../services/analyticsService.js';
import { teamService } from '../services/teamService.js';
import { playerService } from '../services/playerService.js';
import { seasonService } from '../services/seasonService.js';
import { useSelectedSeason } from '../hooks/useSelectedSeason.js';
import Loader from '../components/Loader.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import ChartComponent from '../components/ChartComponent.jsx';
import SeasonCompareChart from '../components/charts/SeasonCompareChart.jsx';

function Compare() {
  const [searchParams] = useSearchParams();
  const { selectedSeason } = useSelectedSeason();
  const { darkMode } = useSelector((state) => state.ui);
  const seasonId = selectedSeason?.id || 1;

  const [activeTab, setActiveTab] = useState('h2h'); // 'h2h' | 'seasons' | 'players'

  // Reference lists
  const [teams, setTeams] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [players, setPlayers] = useState([]);

  // Head-to-Head state
  const [teamA, setTeamA] = useState(Number(searchParams.get('teamA')) || 1); // Default FC Barcelona
  const [teamB, setTeamB] = useState(Number(searchParams.get('teamB')) || 2); // Default Real Madrid
  const [h2hData, setH2hData] = useState(null);
  const [h2hLoading, setH2hLoading] = useState(false);
  const [h2hError, setH2hError] = useState(null);

  // Season comparison state
  const [selectedSeason1, setSelectedSeason1] = useState(1);
  const [selectedSeason2, setSelectedSeason2] = useState(2);
  const [seasonCompareData, setSeasonCompareData] = useState(null);
  const [seasonLoading, setSeasonLoading] = useState(false);
  const [seasonError, setSeasonError] = useState(null);

  // Player comparison state
  const [playerA, setPlayerA] = useState(1); // Lewandowski
  const [playerB, setPlayerB] = useState(2); // Pedri / Yamal
  const [playerCompareData, setPlayerCompareData] = useState(null);
  const [playerLoading, setPlayerLoading] = useState(false);
  const [playerError, setPlayerError] = useState(null);

  // Load baseline dropdown data
  useEffect(() => {
    async function loadDropdowns() {
      try {
        const [teamsRes, seasonsRes, playersRes] = await Promise.all([
          teamService.getTeams(),
          seasonService.getSeasons(),
          playerService.getPlayers({ seasonId, limit: 100 }),
        ]);

        const teamList = Array.isArray(teamsRes) ? teamsRes : teamsRes?.data || [];
        setTeams(teamList);

        const seasonList = Array.isArray(seasonsRes) ? seasonsRes : seasonsRes?.data || [];
        setSeasons(seasonList);

        const playerList = Array.isArray(playersRes) ? playersRes : playersRes?.data || [];
        setPlayers(playerList);
        if (playerList.length >= 2) {
          setPlayerA(playerList[0].player_id || playerList[0].id);
          setPlayerB(playerList[1].player_id || playerList[1].id);
        }
      } catch (err) {
        console.error('Failed to load dropdown items:', err);
      }
    }
    loadDropdowns();
  }, [seasonId]);

  // Fetch Head-to-Head
  useEffect(() => {
    if (activeTab !== 'h2h' || !teamA || !teamB || teamA === teamB) return;
    async function loadH2H() {
      setH2hLoading(true);
      setH2hError(null);
      try {
        const data = await analyticsService.getHeadToHead(teamA, teamB);
        setH2hData(data);
      } catch (err) {
        setH2hError(err.message || 'Failed to load Head-to-Head records');
      } finally {
        setH2hLoading(false);
      }
    }
    loadH2H();
  }, [activeTab, teamA, teamB]);

  // Fetch Season Comparison
  useEffect(() => {
    if (activeTab !== 'seasons' || !selectedSeason1 || !selectedSeason2) return;
    async function loadSeasonCompare() {
      setSeasonLoading(true);
      setSeasonError(null);
      try {
        const listStr = `${selectedSeason1},${selectedSeason2}`;
        const data = await analyticsService.compareSeasons(listStr);
        setSeasonCompareData(data);
      } catch (err) {
        setSeasonError(err.message || 'Failed to compare seasons');
      } finally {
        setSeasonLoading(false);
      }
    }
    loadSeasonCompare();
  }, [activeTab, selectedSeason1, selectedSeason2]);

  // Fetch Player Comparison
  useEffect(() => {
    if (activeTab !== 'players' || !playerA || !playerB || playerA === playerB) return;
    async function loadPlayerCompare() {
      setPlayerLoading(true);
      setPlayerError(null);
      try {
        const data = await analyticsService.comparePlayers(playerA, playerB, seasonId);
        setPlayerCompareData(data);
      } catch (err) {
        setPlayerError(err.message || 'Failed to compare players');
      } finally {
        setPlayerLoading(false);
      }
    }
    loadPlayerCompare();
  }, [activeTab, playerA, playerB, seasonId]);

  const selectedTeamA = teams.find((t) => (t.team_id || t.id) === Number(teamA));
  const selectedTeamB = teams.find((t) => (t.team_id || t.id) === Number(teamB));

  return (
    <div className="page-container py-6">
      {/* Page Title */}
      <div className="mb-8 border-b border-[#004D98]/30 pb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#004D98]/20 text-[#60A5FA] border border-[#004D98]/40 shadow-[0_0_10px_rgba(0,77,152,0.25)]">
            Relational DBMS Comparisons
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[#EDBB00] font-heading drop-shadow-[0_0_20px_rgba(237,187,0,0.35)]">
          Comparison Lab
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Perform multi-entity analytics: Head-to-Head club rivalries, cross-season progression, and squad player radar statistics.
        </p>
      </div>

      {/* Main Tab Switcher */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#004D98]/20 pb-4 mb-8">
        {[
          { id: 'h2h', label: 'Club Head-to-Head ⚔️' },
          { id: 'seasons', label: 'Barça Season vs Season 📊' },
          { id: 'players', label: 'Player vs Player Radar 👥' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === t.id
                ? 'bg-gradient-to-r from-[#004D98] to-[#0055B3] text-[#EDBB00] shadow-[0_0_20px_rgba(0,77,152,0.5),inset_0_1px_0_rgba(237,187,0,0.3)] border border-[#0055B3]/60'
                : 'bg-[#060F2B]/80 text-slate-300 hover:text-[#EDBB00] hover:bg-[#004D98]/15 border border-[#004D98]/20'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: HEAD TO HEAD */}
      {activeTab === 'h2h' && (
        <div className="space-y-6">
          {/* Club Selectors */}
          <div className="p-6 rounded-3xl border border-[#004D98]/30 bg-gradient-to-br from-[#060F2B]/90 via-[#030718]/95 to-[#081335]/90 backdrop-blur-2xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.85)]">
            <h2 className="text-sm font-black uppercase tracking-wider text-[#EDBB00] mb-4 font-heading">
              Select Clubs to Compare
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1.5">First Club (Team A)</label>
                <select
                  value={teamA}
                  onChange={(e) => setTeamA(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-semibold text-sm focus:border-amber-400 outline-none"
                >
                  {teams.map((t) => (
                    <option key={t.team_id || t.id} value={t.team_id || t.id} disabled={(t.team_id || t.id) === Number(teamB)}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1.5">Opponent (Team B)</label>
                <select
                  value={teamB}
                  onChange={(e) => setTeamB(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-semibold text-sm focus:border-amber-400 outline-none"
                >
                  {teams.map((t) => (
                    <option key={t.team_id || t.id} value={t.team_id || t.id} disabled={(t.team_id || t.id) === Number(teamA)}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {h2hError && <ErrorBanner message={h2hError} />}
          {h2hLoading && <Loader text="Calculating head-to-head records..." />}

          {h2hData && !h2hLoading && (
            <div className="space-y-6">
              {/* Scorecard Hero */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-6 rounded-3xl bg-blue-950/40 border border-blue-800/40 flex flex-col items-center justify-center">
                  {h2hData.teamA?.crest_url && (
                    <img src={h2hData.teamA.crest_url} alt={h2hData.teamA.name} className="w-12 h-12 object-contain mb-2" onError={(e) => { e.target.style.display = 'none'; }} />
                  )}
                  <span className="text-base font-bold text-white mb-2">{selectedTeamA?.name || 'Team A'}</span>
                  <span className="text-5xl font-black text-blue-400">{h2hData.teamAWins ?? 0}</span>
                  <span className="text-xs text-slate-400 uppercase font-bold tracking-wider mt-1">Wins</span>
                  <span className="text-xs text-blue-300 mt-2 font-semibold">{h2hData.teamAGoals ?? 0} Goals Scored</span>
                </div>

                <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col items-center justify-center">
                  <span className="text-xs text-slate-400 uppercase font-extrabold tracking-widest mb-1">Total Clashes</span>
                  <span className="text-4xl font-black text-amber-400">{h2hData.totalPlayed ?? 0}</span>
                  <span className="text-sm font-bold text-slate-300 mt-1">{h2hData.draws ?? 0} Drawn Matches</span>
                </div>

                <div className="p-6 rounded-3xl bg-rose-950/40 border border-rose-800/40 flex flex-col items-center justify-center">
                  {h2hData.teamB?.crest_url && (
                    <img src={h2hData.teamB.crest_url} alt={h2hData.teamB.name} className="w-12 h-12 object-contain mb-2" onError={(e) => { e.target.style.display = 'none'; }} />
                  )}
                  <span className="text-base font-bold text-white mb-2">{selectedTeamB?.name || 'Team B'}</span>
                  <span className="text-5xl font-black text-rose-400">{h2hData.teamBWins ?? 0}</span>
                  <span className="text-xs text-slate-400 uppercase font-bold tracking-wider mt-1">Wins</span>
                  <span className="text-xs text-rose-300 mt-2 font-semibold">{h2hData.teamBGoals ?? 0} Goals Scored</span>
                </div>
              </div>

              {/* Match History Breakdown */}
              <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
                <h3 className="text-base font-bold text-white mb-4">Historical Encounter History</h3>
                <div className="divide-y divide-slate-800">
                  {(h2hData.matches || []).map((m) => (
                    <div key={m.match_id || m.id} className="py-3 flex items-center justify-between gap-4 text-sm">
                      <div className="text-slate-400 text-xs w-28">
                        {m.kickoff_utc ? new Date(m.kickoff_utc).toLocaleDateString() : 'MD'}
                      </div>
                      <div className="flex-1 flex items-center justify-center gap-3">
                        <span className={`font-semibold text-right flex-1 ${m.home_team_id === Number(teamA) ? 'text-amber-400' : 'text-slate-300'}`}>
                          {m.home_name}
                        </span>
                        <span className="px-3 py-1 rounded-lg bg-black/40 font-mono font-black text-white border border-white/10 text-base">
                          {m.home_score ?? '-'} : {m.away_score ?? '-'}
                        </span>
                        <span className={`font-semibold text-left flex-1 ${m.away_team_id === Number(teamA) ? 'text-amber-400' : 'text-slate-300'}`}>
                          {m.away_name}
                        </span>
                      </div>
                      <div className="text-right text-xs text-slate-500 w-24">
                        {m.season_label || 'La Liga'}
                      </div>
                    </div>
                  ))}
                  {(!h2hData.matches || h2hData.matches.length === 0) && (
                    <div className="py-8 text-center text-slate-400">
                      No recorded historical fixtures found between these clubs.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SEASON VS SEASON */}
      {activeTab === 'seasons' && (
        <div className="space-y-6">
          <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-amber-200/60 shadow-lg'}`}>
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-amber-400 mb-4">
              Select FC Barcelona Campaigns to Compare
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1.5">First Campaign</label>
                <select
                  value={selectedSeason1}
                  onChange={(e) => setSelectedSeason1(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-semibold text-sm focus:border-amber-400 outline-none"
                >
                  {seasons.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label} ({s.start_year}-{s.end_year})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1.5">Second Campaign</label>
                <select
                  value={selectedSeason2}
                  onChange={(e) => setSelectedSeason2(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-semibold text-sm focus:border-amber-400 outline-none"
                >
                  {seasons.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label} ({s.start_year}-{s.end_year})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {seasonError && <ErrorBanner message={seasonError} />}
          {seasonLoading && <Loader text="Reconciling cross-season statistics..." />}

          {seasonCompareData && !seasonLoading && (
            <div className="space-y-6">
              <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
                <h3 className="text-base font-bold text-white mb-2">Campaign Performance Radar</h3>
                <p className="text-xs text-slate-400 mb-6">Compare points, goals, defense, and win rate across seasons.</p>
                <div className="h-72">
                  <SeasonCompareChart data={Array.isArray(seasonCompareData) ? seasonCompareData : [seasonCompareData]} />
                </div>
              </div>

              {/* Side-by-side Table */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(Array.isArray(seasonCompareData) ? seasonCompareData : [seasonCompareData]).map((s, idx) => (
                  <div
                    key={s.season_id || idx}
                    className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800"
                  >
                    <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                      <h4 className="font-extrabold text-lg text-white">
                        {s.season_label || `Season ${idx + 1}`}
                      </h4>
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-slate-950">
                        Season {s.start_year || idx + 1}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="p-3 rounded-xl bg-black/30 border border-white/5">
                        <span className="text-xs text-slate-400 block">Points</span>
                        <span className="text-2xl font-black text-amber-400">{s.barca_points ?? '-'}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-black/30 border border-white/5">
                        <span className="text-xs text-slate-400 block">Record (W-D-L)</span>
                        <span className="text-base font-black text-white">{s.barca_wins || 0}W - {s.barca_draws || 0}D - {s.barca_losses || 0}L</span>
                      </div>
                      <div className="p-3 rounded-xl bg-black/30 border border-white/5">
                        <span className="text-xs text-slate-400 block">Goals Scored (GF)</span>
                        <span className="text-xl font-black text-emerald-400">{s.barca_gf ?? 0}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-black/30 border border-white/5">
                        <span className="text-xs text-slate-400 block">Goals Conceded (GA)</span>
                        <span className="text-xl font-black text-rose-400">{s.barca_ga ?? 0}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PLAYER VS PLAYER */}
      {activeTab === 'players' && (
        <div className="space-y-6">
          <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-amber-200/60 shadow-lg'}`}>
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-amber-400 mb-4">
              Select 2 Squad Players ({selectedSeason?.label})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1.5">Player 1</label>
                <select
                  value={playerA}
                  onChange={(e) => setPlayerA(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-semibold text-sm focus:border-amber-400 outline-none"
                >
                  {players.map((p) => (
                    <option key={p.player_id || p.id} value={p.player_id || p.id} disabled={(p.player_id || p.id) === Number(playerB)}>
                      {p.known_as || p.full_name || p.name} ({p.position})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1.5">Player 2</label>
                <select
                  value={playerB}
                  onChange={(e) => setPlayerB(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-semibold text-sm focus:border-amber-400 outline-none"
                >
                  {players.map((p) => (
                    <option key={p.player_id || p.id} value={p.player_id || p.id} disabled={(p.player_id || p.id) === Number(playerA)}>
                      {p.known_as || p.full_name || p.name} ({p.position})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {playerError && <ErrorBanner message={playerError} />}
          {playerLoading && <Loader text="Executing player aggregate comparisons..." />}

          {playerCompareData && !playerLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[playerCompareData.playerA, playerCompareData.playerB].map((p, idx) => (
                <div
                  key={p?.player_id || idx}
                  className={`p-6 rounded-3xl border ${
                    idx === 0
                      ? 'bg-blue-950/30 border-blue-800/40'
                      : 'bg-rose-950/30 border-rose-800/40'
                  }`}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-amber-400 font-black text-xl border border-slate-700">
                      {p?.shirt_number || '#'}
                    </div>
                    <div>
                      <h4 className="text-xl font-extrabold text-white">
                        {p?.name || `Player ${idx + 1}`}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {p?.position || 'Forward'} • {p?.nationality || 'Spain'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                      <span className="text-xs text-slate-400 block">Goals</span>
                      <span className="text-2xl font-black text-amber-400">{p?.goals ?? 0}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                      <span className="text-xs text-slate-400 block">Assists</span>
                      <span className="text-2xl font-black text-blue-400">{p?.assists ?? 0}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                      <span className="text-xs text-slate-400 block">Minutes Played</span>
                      <span className="text-xl font-black text-emerald-400">{Number(p?.minutes || 0).toLocaleString()}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                      <span className="text-xs text-slate-400 block">Appearances</span>
                      <span className="text-xl font-black text-white">{p?.appearances || 0}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                      <span className="text-xs text-slate-400 block">Yellow Cards</span>
                      <span className="text-lg font-bold text-amber-300">{p?.yellow ?? 0}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                      <span className="text-xs text-slate-400 block">Red Cards</span>
                      <span className="text-lg font-bold text-rose-500">{p?.red ?? 0}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Compare;
