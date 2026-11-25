import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { seasonService } from '../../services/seasonService.js';
import Loader from '../../components/Loader.jsx';
import ErrorBanner from '../../components/ErrorBanner.jsx';

function SeasonsAdmin() {
  const { darkMode } = useSelector((state) => state.ui);
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadSeasons() {
      setLoading(true);
      setError(null);
      try {
        const data = await seasonService.getSeasons();
        setSeasons(Array.isArray(data) ? data : data?.data || []);
      } catch (err) {
        setError(err.message || 'Failed to load seasons');
      } finally {
        setLoading(false);
      }
    }
    loadSeasons();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-white">Competition Seasons</h2>
        <p className="text-xs text-slate-400">View registered La Liga campaign editions, dates, and active flags.</p>
      </div>

      {error && <ErrorBanner message={error} />}

      {loading ? (
        <Loader text="Loading season records..." />
      ) : (
        <div className={`rounded-3xl border overflow-hidden ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase font-black tracking-wider">
                <tr>
                  <th className="py-3 px-4">Season ID</th>
                  <th className="py-3 px-4">Season Label</th>
                  <th className="py-3 px-4">Start Date</th>
                  <th className="py-3 px-4">End Date</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {seasons.map((s) => (
                  <tr key={s.season_id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-amber-400">#{s.season_id}</td>
                    <td className="py-3 px-4 font-bold text-white text-sm">{s.season_label}</td>
                    <td className="py-3 px-4 text-slate-300">
                      {s.start_date ? new Date(s.start_date).toLocaleDateString() : '-'}
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {s.end_date ? new Date(s.end_date).toLocaleDateString() : '-'}
                    </td>
                    <td className="py-3 px-4">
                      {s.is_current ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Active Season
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-400 border border-slate-700">
                          Concluded
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default SeasonsAdmin;
