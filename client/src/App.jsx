import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setDarkMode } from './redux/uiSlice.js';
import { checkCurrentUser } from './redux/authSlice.js';
import './App.css';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import Loader from './components/Loader.jsx';
import Notification from './components/Notification.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Public and General Pages
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const LaLigaHub = lazy(() => import('./pages/LaLigaHub.jsx'));
const TeamDetail = lazy(() => import('./pages/TeamDetail.jsx'));
const Matches = lazy(() => import('./pages/Matches.jsx'));
const MatchDetail = lazy(() => import('./pages/MatchDetail.jsx'));
const Players = lazy(() => import('./pages/Players.jsx'));
const PlayerProfile = lazy(() => import('./pages/PlayerProfile.jsx'));
const Analytics = lazy(() => import('./pages/Analytics.jsx'));
const Compare = lazy(() => import('./pages/Compare.jsx'));
const Favorites = lazy(() => import('./pages/Favorites.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

// Admin Control Pages
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout.jsx'));
const AdminHome = lazy(() => import('./pages/admin/AdminHome.jsx'));
const TeamsAdmin = lazy(() => import('./pages/admin/TeamsAdmin.jsx'));
const PlayersAdmin = lazy(() => import('./pages/admin/PlayersAdmin.jsx'));
const SeasonsAdmin = lazy(() => import('./pages/admin/SeasonsAdmin.jsx'));
const MatchesAdmin = lazy(() => import('./pages/admin/MatchesAdmin.jsx'));
const StatsAdmin = lazy(() => import('./pages/admin/StatsAdmin.jsx'));
const StandingsAdmin = lazy(() => import('./pages/admin/StandingsAdmin.jsx'));
const ImportAdmin = lazy(() => import('./pages/admin/ImportAdmin.jsx'));

function App() {
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state) => state.ui);

  // Apply dark/light class to HTML element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Load dark mode preference from localStorage on init
  useEffect(() => {
    const saved = localStorage.getItem('barca_darkMode');
    if (saved !== null) {
      dispatch(setDarkMode(JSON.parse(saved)));
    }
    // Verify token validity on boot
    dispatch(checkCurrentUser());
  }, [dispatch]);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div
          className="min-h-screen flex flex-col relative overflow-hidden bg-[#030718] text-slate-100 selection:bg-[#EDBB00] selection:text-[#030718]"
        >
          {/* Animated Blaugrana background orbs */}
          <div className="bg-orb bg-orb-1" />
          <div className="bg-orb bg-orb-2" />
          <div className="bg-orb bg-orb-3" />

          {/* Persistent Navbar */}
          <Navbar />

          <div className="flex flex-1 pt-16">
            {/* Desktop & Mobile Responsive Sidebar */}
            <Sidebar />

            {/* Main Application Area */}
            <main className="flex-1 ml-0 lg:ml-64 min-h-screen relative z-10 px-4 md:px-8 py-6">
              <Suspense fallback={<Loader text="Loading interface..." />}>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/laliga" element={<LaLigaHub />} />
                  <Route path="/laliga/teams/:id" element={<TeamDetail />} />
                  <Route path="/teams/:id" element={<TeamDetail />} />
                  <Route path="/matches" element={<Matches />} />
                  <Route path="/matches/:id" element={<MatchDetail />} />
                  <Route path="/match/:id" element={<MatchDetail />} />
                  <Route path="/players" element={<Players />} />
                  <Route path="/players/:id" element={<PlayerProfile />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/compare" element={<Compare />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/login" element={<Login />} />

                  {/* Protected Admin routes */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute>
                        <AdminLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<AdminHome />} />
                    <Route path="teams" element={<TeamsAdmin />} />
                    <Route path="players" element={<PlayersAdmin />} />
                    <Route path="seasons" element={<SeasonsAdmin />} />
                    <Route path="matches" element={<MatchesAdmin />} />
                    <Route path="stats" element={<StatsAdmin />} />
                    <Route path="standings" element={<StandingsAdmin />} />
                    <Route path="import" element={<ImportAdmin />} />
                  </Route>

                  {/* 404 Fallback */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>
          </div>

          {/* Toast Notification Container */}
          <Notification />
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;