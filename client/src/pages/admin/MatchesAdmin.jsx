import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { matchService } from '../../services/matchService.js';
import { adminService } from '../../services/adminService.js';
import { useSelectedSeason } from '../../hooks/useSelectedSeason.js';
import { showNotification } from '../../redux/uiSlice.js';
import Loader from '../../components/Loader.jsx';
import ErrorBanner from '../../components/ErrorBanner.jsx';
import MatchForm from '../../components/forms/MatchForm.jsx';

function MatchesAdmin() {
  const dispatch = useDispatch();
  const { selectedSeason } = useSelectedSeason();
  const { darkMode } = useSelector((state) => state.ui);

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);

  const seasonId = selectedSeason?.season_id || 1;

  const loadMatches = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await matchService.getMatches({ seasonId, limit: 100 });
      setMatches(res?.data || res || []);
    } catch (err) {
      setError(err.message || 'Failed to load fixtures');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMatches();
  }, [seasonId]);

  const filteredMatches = matches.filter((m) => {
    if (statusFilter === 'All') return true;
    return m.status === statusFilter;
  });

  const handleCreate = () => {
    setEditingMatch(null);
    setIsModalOpen(true);
  };

  const handleEdit = (m) => {
    setEditingMatch(m);
    setIsModalOpen(true);
  };

  const handleDelete = async (m) => {
    const id = m.match_id || m.id;
    if (!window.confirm(`Delete Matchday ${m.matchday} fixture between ${m.home_team_name} and ${m.away_team_name}?`)) return;

    try {
      await adminService.deleteMatch(id);
      dispatch(showNotification({ type: 'success', message: 'Match deleted successfully' }));
      loadMatches();
    } catch (err) {
      dispatch(showNotification({ type: 'error', message: err.message || 'Failed to delete match' }));
    }
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    loadMatches();
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white">Fixtures & Matches Management</h2>
          <p className="text-xs text-slate-400">
            Create schedule entries, update final scores, and launch player match stats entry.
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>➕ Schedule New Match</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="flex items-center gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-amber-400 outline-none"
        >
          <option value="All">All Match Statuses</option>
          <option value="FINISHED">FINISHED</option>
          <option value="SCHEDULED">SCHEDULED</option>
          <option value="POSTPONED">POSTPONED</option>
        </select>
        <span className="text-xs text-slate-500 font-semibold">{filteredMatches.length} matches found</span>
      </div>

      {error && <ErrorBanner message={error} />}

      {loading ? (
        <Loader text="Loading fixtures..." />
      ) : (
        <div className={`rounded-3xl border overflow-hidden ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase font-black tracking-wider">
                <tr>
                  <th className="py-3 px-4">MD</th>
                  <th className="py-3 px-4">Home Team</th>
                  <th className="py-3 px-4 text-center">Score</th>
                  <th className="py-3 px-4">Away Team</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredMatches.map((m) => {
                  const id = m.match_id || m.id;
                  const isFinished = m.status === 'FINISHED';
                  return (
                    <tr key={id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-amber-400">MD{m.matchday}</td>
                      <td className="py-3 px-4 font-bold text-white text-sm">{m.home_team_name}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2.5 py-1 rounded-lg font-mono font-black text-xs ${
                          isFinished ? 'bg-black/40 text-amber-400 border border-amber-400/20' : 'bg-slate-800 text-slate-500'
                        }`}>
                          {m.home_score !== null && m.home_score !== undefined ? `${m.home_score} - ${m.away_score}` : 'vs'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-white text-sm">{m.away_team_name}</td>
                      <td className="py-3 px-4 text-slate-300">
                        {m.match_date ? new Date(m.match_date).toLocaleDateString() : '-'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isFinished
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {m.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/stats?matchId=${id}`}
                            className="px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 font-semibold text-[11px] border border-blue-500/30 transition-colors"
                          >
                            Atomic Stats ⚡
                          </Link>
                          <button
                            onClick={() => handleEdit(m)}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-[11px] border border-amber-400/20 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(m)}
                            className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-semibold text-[11px] border border-rose-500/20 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Match Form Modal */}
      <MatchForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingMatch}
        onSuccess={handleSuccess}
      />
    </div>
  );
}

export default MatchesAdmin;
