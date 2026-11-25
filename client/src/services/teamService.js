import api from './api.js';

export const teamService = {
  getTeams: async (seasonId = null) => {
    const params = seasonId ? { seasonId } : {};
    const res = await api.get('/teams', { params });
    return res.data;
  },
  getTeamById: async (id) => {
    const res = await api.get(`/teams/${id}`);
    return res.data;
  },
  getTeamSeasonSummary: async (teamId, seasonId) => {
    const res = await api.get(`/teams/${teamId}/season-summary`, { params: { seasonId } });
    return res.data;
  },
  getTeamSquad: async (teamId, seasonId) => {
    const res = await api.get(`/teams/${teamId}/squad`, { params: { seasonId } });
    return res.data;
  },
};
