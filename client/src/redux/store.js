import { configureStore } from '@reduxjs/toolkit';
import matchesReducer from './matchesSlice.js';
import playersReducer from './playersSlice.js';
import standingsReducer from './standingsSlice.js';
import seasonReducer from './seasonSlice.js';
import teamsReducer from './teamsSlice.js';
import analyticsReducer from './analyticsSlice.js';
import authReducer from './authSlice.js';
import uiReducer from './uiSlice.js';
import favoritesReducer from './favoritesSlice.js';

export const store = configureStore({
  reducer: {
    matches: matchesReducer,
    players: playersReducer,
    standings: standingsReducer,
    season: seasonReducer,
    teams: teamsReducer,
    analytics: analyticsReducer,
    auth: authReducer,
    ui: uiReducer,
    favorites: favoritesReducer,
  },
});

export default store;