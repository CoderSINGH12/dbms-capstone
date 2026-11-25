import api from './api.js';

export const playerService = {
  getPlayers: async (params = {}) => {
    return await api.get('/players', { params });
  },
  getPlayerById: async (id) => {
    const res = await api.get(`/players/${id}`);
    return res.data;
  },
  getNationalities: async (params = {}) => {
    const res = await api.get('/players/nationalities', { params });
    return res.data;
  },
};
