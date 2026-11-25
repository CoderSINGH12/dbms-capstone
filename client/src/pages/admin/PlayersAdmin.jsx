import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { playerService } from '../../services/playerService.js';
import { adminService } from '../../services/adminService.js';
import { showNotification } from '../../redux/uiSlice.js';
import Loader from '../../components/Loader.jsx';
import ErrorBanner from '../../components/ErrorBanner.jsx';
import PlayerForm from '../../components/forms/PlayerForm.jsx';

function PlayersAdmin() {
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state) => state.ui);

  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [positionFilter, setPositionFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);

  const loadPlayers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await playerService.getPlayers({ limit: 100 });
      setPlayers(Array.isArray(data) ? data : data?.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch players');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlayers();
  }, []);

  const filteredPlayers = useMemo(() => {
    return players.filter((p) => {
      const matchesSearch =
        (p.full_name && p.full_name.toLowerCase().includes(search.toLowerCase())) ||
        (p.known_as && p.known_as.toLowerCase().includes(search.toLowerCase())) ||
        (p.nationality && p.nationality.toLowerCase().includes(search.toLowerCase()));

      const matchesPos = positionFilter === 'All' || p.position === positionFilter;
      return matchesSearch && matchesPos;
    });
  }, [players, search, positionFilter]);

  const handleCreate = () => {
    setEditingPlayer(null);
    setIsModalOpen(true);
  };

  const handleEdit = (player) => {
    setEditingPlayer(player);
    setIsModalOpen(true);
  };

  const handleDelete = async (player) => {
    const id = player.player_id || player.id;
    if (!window.confirm(`Are you sure you want to delete "${player.known_as || player.full_name}"?`)) return;

    try {
      await adminService.deletePlayer(id);
      dispatch(showNotification({ type: 'success', message: 'Player removed successfully' }));
      loadPlayers();
    } catch (err) {
      dispatch(showNotification({ type: 'error', message: err.message || 'Failed to delete player' }));
    }
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    loadPlayers();
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white">Squad & Players Management</h2>
          <p className="text-xs text-slate-400">Register new players, adjust positions, and update biographies.</p>
        </div>
        <button
          onClick={handleCreate}
          className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>➕ Register New Player</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by player name, known as, or nationality..."
          className="w-full sm:max-w-md px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:border-amber-400 outline-none"
        />
        <select
          value={positionFilter}
          onChange={(e) => setPositionFilter(e.target.value)}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-amber-400 outline-none"
        >
          <option value="All">All Positions</option>
          <option value="Goalkeeper">Goalkeeper</option>
          <option value="Defender">Defender</option>
          <option value="Midfielder">Midfielder</option>
          <option value="Forward">Forward</option>
        </select>
        <span className="text-xs text-slate-500 font-semibold ml-auto">{filteredPlayers.length} players listed</span>
      </div>

      {error && <ErrorBanner message={error} />}

      {loading ? (
        <Loader text="Loading squad players..." />
      ) : (
        <div className={`rounded-3xl border overflow-hidden ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase font-black tracking-wider">
                <tr>
                  <th className="py-3 px-4">Player</th>
                  <th className="py-3 px-4">Position</th>
                  <th className="py-3 px-4">Nationality</th>
                  <th className="py-3 px-4">Birthdate</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredPlayers.map((p) => {
                  const id = p.player_id || p.id;
                  return (
                    <tr key={id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-bold text-white text-sm block">{p.known_as || p.full_name}</span>
                        {p.known_as && <span className="text-[11px] text-slate-400">{p.full_name}</span>}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-800 text-amber-400 border border-slate-700">
                          {p.position}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-300">{p.nationality || 'Spain'}</td>
                      <td className="py-3 px-4 text-slate-400">
                        {p.birth_date ? new Date(p.birth_date).toLocaleDateString() : '-'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(p)}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-[11px] border border-amber-400/20 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(p)}
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

      {/* Player Form Modal */}
      <PlayerForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingPlayer}
        onSuccess={handleSuccess}
      />
    </div>
  );
}

export default PlayersAdmin;
