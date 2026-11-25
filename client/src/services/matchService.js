import api from './api.js';

export const matchService = {
  getMatches: async (params = {}) => {
    return await api.get('/matches', { params });
  },
  getMatchById: async (id) => {
    const res = await api.get(`/matches/${id}`);
    return res.data;
  },
  saveMatchResult: async (id, data) => {
    const res = await api.put(`/matches/${id}/result`, data);
    return res.data;
  },
};
