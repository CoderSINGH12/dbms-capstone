import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearAuthError } from '../redux/authSlice.js';

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.ui);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    dispatch(loginUser({ email, password }));
  };

  const handleFillDemo = () => {
    setEmail('admin@fcbarcelona.cat');
    setPassword('Admin@123456');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md p-8 rounded-3xl border border-[#004D98]/40 bg-gradient-to-br from-[#060F2B]/95 via-[#030718]/98 to-[#081335]/95 backdrop-blur-2xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.9),0_0_35px_rgba(0,77,152,0.35)] relative overflow-hidden">
        {/* Glow Accent Top */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#004D98] via-[#EDBB00] to-[#0055B3] shadow-[0_0_12px_#EDBB00]" />

        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#004D98] via-[#0055B3] to-[#EDBB00] p-0.5 mx-auto mb-4 shadow-xl flex items-center justify-center">
            <div className="w-full h-full bg-[#030718] rounded-[14px] flex items-center justify-center">
              <span className="text-[#EDBB00] font-black text-xl drop-shadow-[0_0_8px_#EDBB00]">FCB</span>
            </div>
          </div>
          <h1 className="text-2xl font-black text-[#EDBB00] font-heading drop-shadow-[0_0_15px_rgba(237,187,0,0.35)]">
            Admin Control Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Authenticate to manage teams, players, fixtures, and database operations.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              Admin Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@fcbarcelona.cat"
              className="w-full px-4 py-3 rounded-xl bg-[#030718] border border-[#004D98]/40 hover:border-[#EDBB00]/60 text-white text-sm focus:border-[#EDBB00] focus:ring-2 focus:ring-[#EDBB00]/30 outline-none transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-3 rounded-xl bg-[#030718] border border-[#004D98]/40 hover:border-[#EDBB00]/60 text-white text-sm focus:border-[#EDBB00] focus:ring-2 focus:ring-[#EDBB00]/30 outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#004D98] to-[#0055B3] hover:from-[#0055B3] hover:to-[#1E70E0] active:scale-[0.99] text-[#EDBB00] font-black text-sm border border-[#0055B3] shadow-[0_0_25px_rgba(0,77,152,0.6)] transition-all disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In as Administrator'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-[#004D98]/20 text-center">
          <p className="text-xs text-slate-400 mb-2 font-medium">Testing or evaluating the DBMS project?</p>
          <button
            type="button"
            onClick={handleFillDemo}
            className="px-4 py-2 rounded-xl bg-[#060F2B] hover:bg-[#004D98]/20 text-[#EDBB00] font-semibold text-xs border border-[#EDBB00]/40 transition-all active:scale-95 flex items-center justify-center gap-2 mx-auto shadow-[0_0_10px_rgba(237,187,0,0.2)]"
          >
            <span>⚡ Use Demo Admin Credentials</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
