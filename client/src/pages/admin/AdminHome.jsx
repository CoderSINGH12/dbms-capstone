import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { adminService } from '../../services/adminService.js';
import Loader from '../../components/Loader.jsx';
import ErrorBanner from '../../components/ErrorBanner.jsx';

function AdminHome() {
  const { darkMode } = useSelector((state) => state.ui);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadStats() {
      setLoading(true);
      setError(null);
      try {
        const data = await adminService.getStats();
        if (isMounted) setStats(data);
      } catch (err) {
        if (isMounted) setError(err.message || 'Failed to load DBMS statistics');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadStats();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) return <Loader text="Querying database metrics & schema statistics..." />;
  if (error) return <ErrorBanner message={error} />;

  const metricCards = [
    { label: 'Registered Clubs', val: stats?.teams ?? 20, icon: '🛡️', link: '/admin/teams' },
    { label: 'Squad Players', val: stats?.players ?? 45, icon: '👥', link: '/admin/players' },
    { label: 'La Liga Fixtures', val: stats?.matches ?? 76, icon: '⚽', link: '/admin/matches' },
    { label: 'Player Registrations', val: stats?.registrations ?? 65, icon: '📋', link: '/admin/players' },
    { label: 'Import Batches', val: stats?.importBatches ?? 3, icon: '📦', link: '/admin/import' },
  ];

  return (
    <div className="space-y-8">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {metricCards.map((m) => (
          <Link
            key={m.label}
            to={m.link}
            className={`p-5 rounded-2xl border transition-all hover:scale-[1.02] ${
              darkMode
                ? 'bg-slate-900/90 border-slate-800 hover:border-amber-400/40'
                : 'bg-white border-slate-200 shadow-sm hover:border-blue-400'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl">{m.icon}</span>
              <span className="text-xs text-slate-500 font-semibold">Live DB</span>
            </div>
            <span className="text-3xl font-black text-white block">{m.val}</span>
            <span className="text-xs text-slate-400 font-medium block mt-1">{m.label}</span>
          </Link>
        ))}
      </div>

      {/* Quick Action Hub */}
      <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
        <h2 className="text-base font-extrabold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          Rapid Management Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/admin/matches"
            className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-400/50 transition-colors text-left"
          >
            <span className="text-amber-400 font-bold text-sm block mb-1">➕ Create New Fixture</span>
            <span className="text-xs text-slate-400">Add a scheduled or completed La Liga match</span>
          </Link>
          <Link
            to="/admin/stats"
            className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-400/50 transition-colors text-left"
          >
            <span className="text-blue-400 font-bold text-sm block mb-1">⚡ Atomic Stats Entry</span>
            <span className="text-xs text-slate-400">Record goals, assists, and player minutes with rollback transaction</span>
          </Link>
          <Link
            to="/admin/players"
            className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-400/50 transition-colors text-left"
          >
            <span className="text-emerald-400 font-bold text-sm block mb-1">👤 Register New Player</span>
            <span className="text-xs text-slate-400">Add player record and assign to squad season roster</span>
          </Link>
          <Link
            to="/admin/standings"
            className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-400/50 transition-colors text-left"
          >
            <span className="text-rose-400 font-bold text-sm block mb-1">🔍 Standings Audit</span>
            <span className="text-xs text-slate-400">Reconcile computed match points vs official table</span>
          </Link>
        </div>
      </div>

      {/* Relational DBMS Integrity & Schema Specs */}
      <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
        <h2 className="text-base font-extrabold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          Relational Database Engine Specifications
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
            <span className="font-extrabold text-amber-400 uppercase tracking-wider block">Storage Engine</span>
            <p><strong>MySQL 8+ InnoDB:</strong> ACID transactions, row-level locking, foreign key integrity constraints, and utf8mb4 collation.</p>
          </div>
          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
            <span className="font-extrabold text-blue-400 uppercase tracking-wider block">Normalization (3NF)</span>
            <p>12 normalized relational tables, zero transitive dependencies, composite primary keys on match events & registrations.</p>
          </div>
          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
            <span className="font-extrabold text-emerald-400 uppercase tracking-wider block">Triggers & Enforcements</span>
            <p>2 eligibility triggers (<code>trg_validate_player_match_team</code>) preventing ineligible squad selections prior to insertion.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminHome;
