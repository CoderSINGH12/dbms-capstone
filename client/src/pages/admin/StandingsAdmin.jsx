import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { standingsService } from '../../services/standingsService.js';
import { useSelectedSeason } from '../../hooks/useSelectedSeason.js';
import { showNotification } from '../../redux/uiSlice.js';
import Loader from '../../components/Loader.jsx';
import ErrorBanner from '../../components/ErrorBanner.jsx';

function StandingsAdmin() {
  const dispatch = useDispatch();
  const { selectedSeason } = useSelectedSeason();
  const { darkMode } = useSelector((state) => state.ui);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reconciling, setReconciling] = useState(false);
  const [error, setError] = useState(null);

  const seasonId = selectedSeason?.season_id || 1;

  const runReconciliation = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await standingsService.reconcileStandings(seasonId);
      setData(res);
    } catch (err) {
      setError(err.message || 'Failed to reconcile standings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runReconciliation();
  }, [seasonId]);

  const handleManualReconcile = async () => {
    setReconciling(true);
    try {
      const res = await standingsService.reconcileStandings(seasonId);
      setData(res);
      dispatch(
        showNotification({
          type: 'success',
          message: `Audit completed! ${res.summary?.exactMatches || 0} exact matches verified.`,
        })
      );
    } catch (err) {
      dispatch(showNotification({ type: 'error', message: err.message || 'Audit failed' }));
    } finally {
      setReconciling(false);
    }
  };

  const summary = data?.summary;
  const records = data?.auditRecords || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-extrabold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30">
              DBMS Audit & Reconciliation
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-white">Standings Integrity & Audit</h2>
          <p className="text-xs text-slate-400">
            Compare live dynamic view (<code>v_standings</code>) against official verified standings (<code>final_standings</code>).
          </p>
        </div>

        <button
          onClick={handleManualReconcile}
          disabled={reconciling}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 text-white font-bold text-xs shadow-md shadow-blue-900/30 active:scale-95 transition-all flex items-center gap-2 self-start sm:self-auto disabled:opacity-50"
        >
          <span>{reconciling ? 'Auditing...' : '🔄 Re-Run Integrity Audit'}</span>
        </button>
      </div>

      {error && <ErrorBanner message={error} />}

      {/* Audit Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">Clubs Audited</span>
            <span className="text-2xl font-black text-white">{summary.totalAudited}</span>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-800/40">
            <span className="text-xs text-emerald-400 block mb-1">Exact Matches</span>
            <span className="text-2xl font-black text-emerald-400">{summary.exactMatches}</span>
          </div>
          <div className={`p-4 rounded-2xl border ${summary.discrepancies > 0 ? 'bg-rose-950/40 border-rose-800/60' : 'bg-slate-900/90 border-slate-800'}`}>
            <span className="text-xs text-rose-400 block mb-1">Discrepancies</span>
            <span className={`text-2xl font-black ${summary.discrepancies > 0 ? 'text-rose-400' : 'text-slate-400'}`}>
              {summary.discrepancies}
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
            <span className="text-xs text-amber-400 block mb-1">Audit Status</span>
            <span className="text-sm font-black uppercase tracking-wider text-amber-400">
              {summary.status}
            </span>
          </div>
        </div>
      )}

      {loading ? (
        <Loader text="Auditing dynamic standings view vs official final tables..." />
      ) : (
        <div className={`rounded-3xl border overflow-hidden ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase font-black tracking-wider">
                <tr>
                  <th className="py-3 px-4">Club</th>
                  <th className="py-3 px-4 text-center">Computed Pos</th>
                  <th className="py-3 px-4 text-center">Official Pos</th>
                  <th className="py-3 px-4 text-center">Computed Pts</th>
                  <th className="py-3 px-4 text-center">Official Pts</th>
                  <th className="py-3 px-4 text-center">Pts Diff</th>
                  <th className="py-3 px-4 text-right">Integrity Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {records.map((r) => {
                  const isMatch = r.reconciliation_status === 'EXACT_MATCH';
                  const isDiscrepancy = r.reconciliation_status === 'DISCREPANCY';
                  return (
                    <tr key={r.team_id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-bold text-white text-sm">
                        {r.team_name}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-amber-400">
                        #{r.computed_position}
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-slate-300">
                        {r.official_position ? `#${r.official_position}` : '-'}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-white">
                        {r.computed_points}
                      </td>
                      <td className="py-3 px-4 text-center text-slate-300">
                        {r.official_points ?? '-'}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold">
                        {r.points_difference === 0 ? (
                          <span className="text-emerald-400">0</span>
                        ) : (
                          <span className="text-rose-400">
                            {r.points_difference > 0 ? `+${r.points_difference}` : r.points_difference}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          isMatch
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : isDiscrepancy
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {r.reconciliation_status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default StandingsAdmin;
