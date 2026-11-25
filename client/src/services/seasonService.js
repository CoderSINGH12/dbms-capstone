import api from './api.js';

export const seasonService = {
  getSeasons: async () => {
    const res = await api.get('/seasons');
    return res.data;
  },
  getSeasonById: async (id) => {
    const res = await api.get(`/seasons/${id}`);
    return res.data;
  },
};
