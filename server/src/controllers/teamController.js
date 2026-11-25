import { teamService } from '../services/teamService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';

export const getAllTeams = asyncHandler(async (req, res) => {
  const { seasonId } = req.query;
  const teams = await teamService.getAllTeams(seasonId ? Number(seasonId) : null);
  res.json({ status: 'success', data: teams });
});

export const getTeamById = asyncHandler(async (req, res) => {
  const team = await teamService.getTeamById(req.params.id);
  if (!team) {
    throw new AppError(`Team with ID ${req.params.id} not found`, 404);
  }
  res.json({ status: 'success', data: team });
});

export const getTeamSeasonSummary = asyncHandler(async (req, res) => {
  const teamId = Number(req.params.id);
  const seasonId = Number(req.query.seasonId || 1);
  const summary = await teamService.getTeamSeasonSummary(teamId, seasonId);
  res.json({ status: 'success', data: summary });
});

export const getTeamSquad = asyncHandler(async (req, res) => {
  const teamId = Number(req.params.id);
  const seasonId = Number(req.query.seasonId || 1);
  const squad = await teamService.getTeamSquad(teamId, seasonId);
  res.json({ status: 'success', data: squad });
});
