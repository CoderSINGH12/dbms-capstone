import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const adminTabs = [
  { path: '/admin', label: 'System Overview', end: true },
  { path: '/admin/teams', label: 'Clubs & Teams' },
  { path: '/admin/players', label: 'Squad & Players' },
  { path: '/admin/seasons', label: 'Seasons' },
  { path: '/admin/matches', label: 'Fixtures & Scores' },
  { path: '/admin/stats', label: 'Atomic Stats Entry' },
  { path: '/admin/standings', label: 'Standings Audit' },
  { path: '/admin/import', label: 'Data Importer' },
];

function AdminLayout() {
  const { user } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.ui);

  return (
    <div className="page-container py-6">
      {/* Admin Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400">
              Admin Session Active
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Database Control Center</h1>
          <p className="text-xs text-slate-400 mt-1">
            Logged in as <strong className="text-slate-200">{user?.email || 'admin@fcbarcelona.cat'}</strong> ({user?.role || 'Admin'})
          </p>
        </div>
      </div>

      {/* Admin Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-slate-800 scrollbar-thin">
        {adminTabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            end={tab.end}
            className={({ isActive }) =>
              `px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                  : darkMode
                    ? 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    : 'bg-slate-200 text-slate-600 hover:text-slate-900'
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>

      {/* Render Active Sub-Page */}
      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
