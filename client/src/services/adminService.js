import api from './api.js';

export const adminService = {
  getStats: async () => {
    const res = await api.get('/admin/stats');
    return res.data;
  },
  getImportBatches: async () => {
    const res = await api.get('/admin/import-batches');
    return res.data;
  },
  // Teams
  createTeam: async (data) => {
    const res = await api.post('/admin/teams', data);
    return res.data;
  },
  updateTeam: async (id, data) => {
    const res = await api.put(`/admin/teams/${id}`, data);
    return res.data;
  },
  deleteTeam: async (id) => {
    const res = await api.delete(`/admin/teams/${id}`);
    return res.data;
  },
  // Players
  createPlayer: async (data) => {
    const res = await api.post('/admin/players', data);
    return res.data;
  },
  updatePlayer: async (id, data) => {
    const res = await api.put(`/admin/players/${id}`, data);
    return res.data;
  },
  deletePlayer: async (id) => {
    const res = await api.delete(`/admin/players/${id}`);
    return res.data;
  },
  // Registrations
  createRegistration: async (data) => {
    const res = await api.post('/admin/registrations', data);
    return res.data;
  },
  deleteRegistration: async (id) => {
    const res = await api.delete(`/admin/registrations/${id}`);
    return res.data;
  },
  // Matches
  createMatch: async (data) => {
    const res = await api.post('/admin/matches', data);
    return res.data;
  },
  updateMatch: async (id, data) => {
    const res = await api.put(`/admin/matches/${id}`, data);
    return res.data;
  },
  deleteMatch: async (id) => {
    const res = await api.delete(`/admin/matches/${id}`);
    return res.data;
  },
};
