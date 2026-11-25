import React, { useEffect, useState } from 'react';
import { useSelectedSeason } from '../hooks/useSelectedSeason.js';
import { standingsService } from '../services/standingsService.js';
import { teamService } from '../services/teamService.js';
import StandingsTable from '../components/StandingsTable.jsx';
import TeamCard from '../components/TeamCard.jsx';
import SeasonSelector from '../components/SeasonSelector.jsx';
import Loader from '../components/Loader.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import CoverageBadge from '../components/CoverageBadge.jsx';

function LaLigaHub() {
  const { selectedSeasonId, selectedSeason } = useSelectedSeason();
  const [standings, setStandings] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadHubData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [standingsData, teamsData] = await Promise.all([
        standingsService.getStandings(selectedSeasonId),
        teamService.getTeams(selectedSeasonId),
      ]);
      setStandings(standingsData || []);
      setTeams(teamsData || []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHubData();
  }, [selectedSeasonId]);

  const leader = standings[0];
  const totalGoals = standings.reduce((acc, s) => acc + Number(s.gf || 0), 0);
  const totalPlayed = standings.reduce((acc, s) => acc + Number(s.played || 0), 0) / 2;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#004D98]/30">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-[#EDBB00] tracking-tight font-heading drop-shadow-[0_0_20px_rgba(237,187,0,0.35)]">
              La Liga EA Sports Hub
            </h1>
            {selectedSeason && <CoverageBadge coverage={selectedSeason.coverage} />}
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Complete championship standings, competing clubs, and official table reconciliation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <SeasonSelector />
        </div>
      </div>

      {error && <ErrorBanner error={error} onRetry={loadHubData} />}

      {/* League Highlights Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-3xl border border-[#004D98]/30 bg-gradient-to-br from-[#060F2B]/90 via-[#030718]/95 to-[#081335]/90 backdrop-blur-2xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.85)]">
          <span className="text-xs uppercase font-extrabold text-slate-400 block mb-1">League Leader</span>
          <p className="text-xl font-black text-[#EDBB00] truncate font-heading drop-shadow-[0_0_12px_rgba(237,187,0,0.4)]">
            {leader?.team_name || 'Leader TBD'}
          </p>
          <span className="text-xs text-slate-400 font-medium">
            {leader?.points || 0} pts • {leader?.won || 0} wins
          </span>
        </div>

        <div className="p-6 rounded-3xl border border-[#004D98]/30 bg-gradient-to-br from-[#060F2B]/90 via-[#030718]/95 to-[#081335]/90 backdrop-blur-2xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.85)]">
          <span className="text-xs uppercase font-extrabold text-slate-400 block mb-1">Matches Completed</span>
          <p className="text-xl font-black text-white font-heading">
            {Math.round(totalPlayed)} <span className="text-xs text-slate-400 font-normal">/ 380 fixtures</span>
          </p>
          <span className="text-xs text-[#0055B3] font-bold">Season {selectedSeason?.label}</span>
        </div>

        <div className="p-6 rounded-3xl border border-[#004D98]/30 bg-gradient-to-br from-[#060F2B]/90 via-[#030718]/95 to-[#081335]/90 backdrop-blur-2xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.85)]">
          <span className="text-xs uppercase font-extrabold text-slate-400 block mb-1">Total Goals Scored</span>
          <p className="text-xl font-black text-emerald-400 font-heading">{totalGoals} Goals</p>
          <span className="text-xs text-slate-400 font-medium">
            Avg {totalPlayed > 0 ? (totalGoals / totalPlayed).toFixed(2) : '0'} goals / match
          </span>
        </div>
      </div>

      {loading ? (
        <Loader message="Calculating live standings table from database views..." size="large" />
      ) : (
        <>
          {/* Standings Table Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                Live Standings Table (SQL View: v_standings)
              </h2>
              <span className="text-xs text-slate-400">
                Sorted by Points, Goal Difference, Goals For
              </span>
            </div>

            <StandingsTable standings={standings} focusTeamId={1} showFullTable={true} />
          </div>

          {/* Clubs Grid Section */}
          <div className="space-y-4 pt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#A50044]" />
                Competing Clubs ({teams.length} Teams)
              </h2>
              <span className="text-xs text-slate-400">Season {selectedSeason?.label}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {teams.map((team) => (
                <TeamCard key={team.id} team={team} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default LaLigaHub;
