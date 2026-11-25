import React, { useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setSidebarOpen } from '../redux/uiSlice.js';
import { useSelectedSeason } from '../hooks/useSelectedSeason.js';

const baseNavItems = [
  {
    path: '/',
    label: 'Dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1h-4a1 1 0 01-1-1v-5zM4 14a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3z" />
      </svg>
    ),
  },
  {
    path: '/laliga',
    label: 'La Liga Hub',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    path: '/matches',
    label: 'Matches & Scores',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    path: '/players',
    label: 'Squad & Players',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    path: '/analytics',
    label: 'DBMS Analytics',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    path: '/compare',
    label: 'Comparison Tool',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
  },
  {
    path: '/favorites',
    label: 'Saved Favorites',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
];

function Sidebar() {
  const dispatch = useDispatch();
  const { sidebarOpen } = useSelector((state) => state.ui);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { matchIds, playerIds } = useSelector((state) => state.favorites);
  const { selectedSeason } = useSelectedSeason();

  const totalFavorites = (matchIds?.length || 0) + (playerIds?.length || 0);

  const closeSidebar = useCallback(() => dispatch(setSidebarOpen(false)), [dispatch]);

  const navItems = [...baseNavItems];
  if (isAuthenticated) {
    navItems.push({
      path: '/admin',
      label: 'Admin Control Center',
      icon: (
        <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      isAdmin: true,
    });
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden animate-fadeIn"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar Nav */}
      <aside
        className={`fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 border-r border-[#004D98]/30 bg-[#030718]/95 backdrop-blur-2xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full p-4 overflow-y-auto">
          {/* Active Season Info Card */}
          <div className="mb-3 p-3 rounded-xl bg-[#060F2B]/90 border border-[#004D98]/40 shadow-[0_0_20px_rgba(0,77,152,0.15)]">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Active Campaign</span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#EDBB00]/15 text-[#EDBB00] border border-[#EDBB00]/40 shadow-[0_0_8px_rgba(237,187,0,0.3)]">
                {selectedSeason?.label || '2024/25'}
              </span>
            </div>
            <p className="text-[11px] text-[#0055B3] font-bold mt-1">La Liga EA Sports (PD)</p>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                    isActive
                      ? 'bg-gradient-to-r from-[#004D98] to-[#0055B3] text-[#EDBB00] shadow-[0_0_20px_rgba(0,77,152,0.5),inset_0_1px_0_rgba(237,187,0,0.3)] border border-[#0055B3]/60'
                      : item.isAdmin
                      ? 'text-[#EDBB00]/90 hover:bg-[#004D98]/20 hover:text-[#FFD100]'
                      : 'text-slate-300 hover:bg-[#004D98]/15 hover:text-[#EDBB00]'
                  }`
                }
              >
                <span className="shrink-0 transition-transform group-hover:scale-110">{item.icon}</span>
                <span className="truncate">{item.label}</span>

                {item.label === 'Saved Favorites' && totalFavorites > 0 && (
                  <span className="ml-auto px-2 py-0.5 text-xs font-black rounded-full bg-[#004D98] text-[#EDBB00] border border-[#EDBB00]/30 shadow">
                    {totalFavorites}
                  </span>
                )}
                {item.isAdmin && (
                  <span className="ml-auto text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-[#EDBB00] text-[#030718]">
                    Live
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Footer Motto */}
          <div className="pt-3 border-t border-[#004D98]/30 mt-auto">
            <div className="px-3.5 py-2.5 rounded-xl bg-gradient-to-br from-[#004D98]/20 via-[#060F2B]/80 to-[#030718] border border-[#004D98]/40 shadow-inner">
              <p className="text-xs font-black tracking-wide text-[#EDBB00] drop-shadow-[0_0_8px_rgba(237,187,0,0.4)]">
                Més que un club
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Relational DBMS Capstone</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default React.memo(Sidebar);
