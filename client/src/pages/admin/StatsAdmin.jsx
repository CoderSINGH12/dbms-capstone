import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { matchService } from '../../services/matchService.js';
import { teamService } from '../../services/teamService.js';
import { useSelectedSeason } from '../../hooks/useSelectedSeason.js';
import { showNotification } from '../../redux/uiSlice.js';
import Loader from '../../components/Loader.jsx';
import ErrorBanner from '../../components/ErrorBanner.jsx';
import MatchStatsForm from '../../components/forms/MatchStatsForm.jsx';

function StatsAdmin() {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { selectedSeason } = useSelectedSeason();
  const { darkMode } = useSelector((state) => state.ui);

  const initialMatchId = Number(searchParams.get('matchId')) || '';
  const [selectedMatchId, setSelectedMatchId] = useState(initialMatchId);
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [squad, setSquad] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const seasonId = selectedSeason?.season_id || 1;

  // Load matches list for dropdown
  useEffect(() => {
    async function loadMatchesList() {
      setLoading(true);
      setError(null);
      try {
        const res = await matchService.getMatches({ seasonId, limit: 100 });
        const list = res?.data || res || [];
        setMatches(list);
        if (!selectedMatchId && list.length > 0) {
          setSelectedMatchId(list[0].match_id || list[0].id);
        }
      } catch (err) {
        setError(err.message || 'Failed to load matches list');
      } finally {
        setLoading(false);
      }
    }
    loadMatchesList();
  }, [seasonId]);

  // Load selected match detail and squad
  useEffect(() => {
    if (!selectedMatchId) return;
    async function loadMatchAndSquad() {
      try {
        const matchData = await matchService.getMatchById(selectedMatchId);
        setSelectedMatch(matchData);

        // Fetch squad for home or away team that is tracked (Barcelona)
        const teamIdToFetch = matchData.home_team_id || 1;
        const squadData = await teamService.getTeamSquad(teamIdToFetch, matchData.season_id || seasonId);
        setSquad(Array.isArray(squadData) ? squadData : squadData?.data || []);
      } catch (err) {
        setError(err.message || 'Failed to load match detail or squad');
      }
    }
    loadMatchAndSquad();
  }, [selectedMatchId, seasonId]);

  const handleMatchSelect = (e) => {
    const id = Number(e.target.value);
    setSelectedMatchId(id);
    setSearchParams({ matchId: id });
  };

  const handleSaveStats = async (formData) => {
    setSubmitting(true);
    try {
      await matchService.saveMatchResult(selectedMatchId, formData);
      dispatch(
        showNotification({
          type: 'success',
          message: 'Match result and player stats updated atomically in database transaction!',
        })
      );
      // Reload match data
      const updated = await matchService.getMatchById(selectedMatchId);
      setSelectedMatch(updated);
    } catch (err) {
      dispatch(showNotification({ type: 'error', message: err.message || 'Transaction failed. Rolled back.' }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-extrabold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
            ACID Transaction & Trigger Validation
          </span>
        </div>
        <h2 className="text-xl font-extrabold text-white">Atomic Match Score & Player Stats Entry</h2>
        <p className="text-xs text-slate-400">
          Modifications run in an atomic database transaction. Eligibility triggers verify that players belong to participating clubs.
        </p>
      </div>

      {/* Match Selector Dropdown */}
      <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
          Select Fixture to Record Results & Stats
        </label>
        <select
          value={selectedMatchId}
          onChange={handleMatchSelect}
          className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-semibold text-sm focus:border-amber-400 outline-none"
        >
          {matches.map((m) => {
            const id = m.match_id || m.id;
            return (
              <option key={id} value={id}>
                MD{m.matchday} • {m.home_team_name} vs {m.away_team_name} ({m.status}) [
                {m.home_score !== null && m.home_score !== undefined ? `${m.home_score}-${m.away_score}` : 'vs'}]
              </option>
            );
          })}
        </select>
      </div>

      {error && <ErrorBanner message={error} />}

      {loading ? (
        <Loader text="Loading match data..." />
      ) : selectedMatch ? (
        <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="mb-6 pb-4 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">
                Matchday {selectedMatch.matchday}: {selectedMatch.home_team_name} vs {selectedMatch.away_team_name}
              </h3>
              <p className="text-xs text-slate-400">
                Venue: {selectedMatch.stadium_name || 'Camp Nou'} • Date: {selectedMatch.match_date ? new Date(selectedMatch.match_date).toLocaleDateString() : 'TBD'}
              </p>
            </div>
          </div>

          <MatchStatsForm
            match={selectedMatch}
            squad={squad}
            initialStats={selectedMatch.stats || []}
            onSubmit={handleSaveStats}
            onCancel={() => {}}
            isSubmitting={submitting}
          />
        </div>
      ) : null}
    </div>
  );
}

export default StatsAdmin;
