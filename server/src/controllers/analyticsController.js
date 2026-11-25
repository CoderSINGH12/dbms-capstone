import { analyticsService } from '../services/analyticsService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';

export const getTopScorers = asyncHandler(async (req, res) => {
  const seasonId = Number(req.query.seasonId || 1);
  const limit = Math.min(50, Number(req.query.limit || 10));
  const data = await analyticsService.getTopScorers(seasonId, limit);
  res.json({ status: 'success', data });
});

export const getTopAssists = asyncHandler(async (req, res) => {
  const seasonId = Number(req.query.seasonId || 1);
  const limit = Math.min(50, Number(req.query.limit || 10));
  const data = await analyticsService.getTopAssists(seasonId, limit);
  res.json({ status: 'success', data });
});

export const getDisciplinary = asyncHandler(async (req, res) => {
  const seasonId = Number(req.query.seasonId || 1);
  const limit = Math.min(50, Number(req.query.limit || 10));
  const data = await analyticsService.getDisciplinary(seasonId, limit);
  res.json({ status: 'success', data });
});

export const getMinutesLeaders = asyncHandler(async (req, res) => {
  const seasonId = Number(req.query.seasonId || 1);
  const limit = Math.min(50, Number(req.query.limit || 10));
  const data = await analyticsService.getMinutesLeaders(seasonId, limit);
  res.json({ status: 'success', data });
});

export const getHeadToHead = asyncHandler(async (req, res) => {
  const teamA = Number(req.query.teamA || 1); // FC Barcelona default
  const teamB = Number(req.query.teamB || 2); // Real Madrid default
  const data = await analyticsService.getHeadToHead(teamA, teamB);
  if (!data) {
    throw new AppError('One or both specified teams could not be found.', 404);
  }
  res.json({ status: 'success', data });
});

export const compareSeasons = asyncHandler(async (req, res) => {
  let seasonIds = [1, 2, 6]; // 2024/25, 2023/24, 2014/15
  if (req.query.seasons) {
    seasonIds = req.query.seasons.split(',').map(s => Number(s.trim())).filter(n => !isNaN(n));
  }
  const data = await analyticsService.compareSeasons(seasonIds);
  res.json({ status: 'success', data });
});

export const comparePlayers = asyncHandler(async (req, res) => {
  const playerA = Number(req.query.playerA || 1); // Lamine Yamal
  const playerB = Number(req.query.playerB || 50); // Vinícius Jr
  const seasonId = Number(req.query.seasonId || 1);
  const data = await analyticsService.comparePlayers(playerA, playerB, seasonId);
  res.json({ status: 'success', data });
});
