import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { adminService } from '../../services/adminService.js';
import Loader from '../../components/Loader.jsx';
import ErrorBanner from '../../components/ErrorBanner.jsx';

function ImportAdmin() {
  const { darkMode } = useSelector((state) => state.ui);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadBatches() {
      setLoading(true);
      setError(null);
      try {
        const data = await adminService.getImportBatches();
        setBatches(Array.isArray(data) ? data : data?.data || []);
      } catch (err) {
        setError(err.message || 'Failed to load import batches');
      } finally {
        setLoading(false);
      }
    }
    loadBatches();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-extrabold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30">
            ETL Ingestion Pipeline
          </span>
        </div>
        <h2 className="text-xl font-extrabold text-white">Data Ingestion & Import Batches</h2>
        <p className="text-xs text-slate-400">
          History of batch imports loaded into MySQL from football-data.org, StatsBomb open data, and verified CSV archives.
        </p>
      </div>

      {error && <ErrorBanner message={error} />}

      {/* Sources Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-amber-400 font-black text-sm block mb-1">football-data.org API</span>
          <p className="text-xs text-slate-400">
            Provides team metadata, match fixtures, scores, venues, and official table standings.
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-blue-400 font-black text-sm block mb-1">StatsBomb Open Data</span>
          <p className="text-xs text-slate-400">
            High-granularity event-level match data: shots, xG estimates, line-ups, and passes.
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-emerald-400 font-black text-sm block mb-1">Curated CSV Historical Results</span>
          <p className="text-xs text-slate-400">
            Verified baseline results for prior La Liga campaigns ensuring complete season tables.
          </p>
        </div>
      </div>

      {/* Batch History Table */}
      {loading ? (
        <Loader text="Loading import batch history..." />
      ) : (
        <div className={`rounded-3xl border overflow-hidden ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="p-5 border-b border-slate-800 bg-slate-950/40">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
              Recorded Import Batches ({batches.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase font-black tracking-wider">
                <tr>
                  <th className="py-3 px-4">Batch ID</th>
                  <th className="py-3 px-4">Source System</th>
                  <th className="py-3 px-4">Target Season</th>
                  <th className="py-3 px-4">Records Loaded</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {batches.map((b) => (
                  <tr key={b.batch_id || b.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-amber-400">#{b.batch_id || b.id}</td>
                    <td className="py-3 px-4 font-bold text-white text-sm">{b.source_name || b.source}</td>
                    <td className="py-3 px-4 text-slate-300">{b.season_label || `Season ${b.season_id}`}</td>
                    <td className="py-3 px-4 text-slate-300 font-mono">{b.records_loaded || b.records_count || '-'}</td>
                    <td className="py-3 px-4 text-slate-400">
                      {b.created_at ? new Date(b.created_at).toLocaleString() : '-'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {b.status || 'COMPLETED'}
                      </span>
                    </td>
                  </tr>
                ))}
                {batches.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No automated batch import records logged yet. Initial seed scripts loaded baseline database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default ImportAdmin;
