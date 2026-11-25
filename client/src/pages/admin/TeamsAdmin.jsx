import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { teamService } from '../../services/teamService.js';
import { adminService } from '../../services/adminService.js';
import { showNotification } from '../../redux/uiSlice.js';
import Loader from '../../components/Loader.jsx';
import ErrorBanner from '../../components/ErrorBanner.jsx';
import TeamForm from '../../components/forms/TeamForm.jsx';

function TeamsAdmin() {
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state) => state.ui);

  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);

  const loadTeams = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await teamService.getTeams();
      setTeams(Array.isArray(data) ? data : data?.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch teams');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeams();
  }, []);

  const filteredTeams = useMemo(() => {
    return teams.filter((t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      (t.city && t.city.toLowerCase().includes(search.toLowerCase())) ||
      (t.short_name && t.short_name.toLowerCase().includes(search.toLowerCase()))
    );
  }, [teams, search]);

  const handleCreate = () => {
    setEditingTeam(null);
    setIsModalOpen(true);
  };

  const handleEdit = (team) => {
    setEditingTeam(team);
    setIsModalOpen(true);
  };

  const handleDelete = async (team) => {
    const teamId = team.team_id || team.id;
    if (!window.confirm(`Are you sure you want to delete "${team.name}"? Note: This will fail if foreign keys exist.`)) return;

    try {
      await adminService.deleteTeam(teamId);
      dispatch(showNotification({ type: 'success', message: `Team "${team.name}" removed successfully.` }));
      loadTeams();
    } catch (err) {
      dispatch(showNotification({ type: 'error', message: err.message || 'Failed to delete team' }));
    }
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    loadTeams();
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white">Clubs & Teams Management</h2>
          <p className="text-xs text-slate-400">Manage registered clubs, home venues, and metadata.</p>
        </div>
        <button
          onClick={handleCreate}
          className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>➕ Add New Club</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter clubs by name, short code, or city..."
          className="w-full max-w-md px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:border-amber-400 outline-none"
        />
        <span className="text-xs text-slate-500 font-semibold">{filteredTeams.length} clubs</span>
      </div>

      {error && <ErrorBanner message={error} />}

      {loading ? (
        <Loader text="Loading clubs catalog..." />
      ) : (
        <div className={`rounded-3xl border overflow-hidden ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase font-black tracking-wider">
                <tr>
                  <th className="py-3 px-4">Club</th>
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Stadium & City</th>
                  <th className="py-3 px-4">Founded</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredTeams.map((t) => {
                  const id = t.team_id || t.id;
                  return (
                    <tr key={id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center p-1 border border-slate-700">
                          {t.crest_url ? (
                            <img src={t.crest_url} alt="" className="max-h-full max-w-full object-contain" />
                          ) : (
                            <span className="font-bold text-amber-400">{t.short_name?.slice(0, 2) || 'FC'}</span>
                          )}
                        </div>
                        <div>
                          <span className="font-bold text-white text-sm block">{t.name}</span>
                          <span className="text-[11px] text-slate-400">{t.website || 'No website'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-amber-400">{t.short_name || '-'}</td>
                      <td className="py-3 px-4 text-slate-300">
                        <div>{t.stadium_name || 'Stadium'}</div>
                        <div className="text-[11px] text-slate-500">{t.city || 'Spain'}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-400">{t.founded_year || '-'}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(t)}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-[11px] border border-amber-400/20 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(t)}
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

      {/* Team Form Modal */}
      <TeamForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingTeam}
        onSuccess={handleSuccess}
      />
    </div>
  );
}

export default TeamsAdmin;
