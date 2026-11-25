import api from './api.js';

export const standingsService = {
  getStandings: async (seasonId = 1) => {
    const res = await api.get('/standings', { params: { seasonId } });
    return res.data;
  },
  reconcileStandings: async (seasonId = 2) => {
    const res = await api.get('/standings/reconcile', { params: { seasonId } });
    return res.data;
  },
};
