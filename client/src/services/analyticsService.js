import api from './api.js';

export const analyticsService = {
  getTopScorers: async (seasonId = 1, limit = 10) => {
    const res = await api.get('/analytics/top-scorers', { params: { seasonId, limit } });
    return res.data;
  },
  getTopAssists: async (seasonId = 1, limit = 10) => {
    const res = await api.get('/analytics/top-assists', { params: { seasonId, limit } });
    return res.data;
  },
  getCards: async (seasonId = 1, limit = 10) => {
    const res = await api.get('/analytics/cards', { params: { seasonId, limit } });
    return res.data;
  },
  getMinutes: async (seasonId = 1, limit = 10) => {
    const res = await api.get('/analytics/minutes', { params: { seasonId, limit } });
    return res.data;
  },
  getHeadToHead: async (teamA = 1, teamB = 2) => {
    const res = await api.get('/analytics/head-to-head', { params: { teamA, teamB } });
    return res.data;
  },
  compareSeasons: async (seasons = '1,2,6') => {
    const res = await api.get('/analytics/season-compare', { params: { seasons } });
    return res.data;
  },
  comparePlayers: async (playerA = 1, playerB = 50, seasonId = 1) => {
    const res = await api.get('/analytics/compare-players', { params: { playerA, playerB, seasonId } });
    return res.data;
  },
};
