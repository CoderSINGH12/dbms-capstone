import { matchService } from '../services/matchService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import { getPaginationParams, formatPaginatedResponse } from '../utils/pagination.js';

export const getMatches = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPaginationParams(req.query, 15, 100);
  const { seasonId, teamId, status, matchday } = req.query;

  const result = await matchService.getMatches({
    seasonId: seasonId ? Number(seasonId) : null,
    teamId: teamId ? Number(teamId) : null,
    status,
    matchday: matchday ? Number(matchday) : null,
    limit,
    offset,
  });

  const response = formatPaginatedResponse(result.matches, result.total, page, limit);
  res.json({ status: 'success', ...response });
});

export const getMatchById = asyncHandler(async (req, res) => {
  const data = await matchService.getMatchById(req.params.id);
  if (!data) {
    throw new AppError(`Match with ID ${req.params.id} not found`, 404);
  }
  res.json({ status: 'success', data });
});

export const saveMatchResultAndStats = asyncHandler(async (req, res) => {
  const matchId = Number(req.params.id);
  const { home_score, away_score, status, stats } = req.body;

  const result = await matchService.saveMatchResultWithStats(matchId, {
    home_score,
    away_score,
    status: status || 'finished',
    stats: stats || [],
  });

  res.status(200).json({
    status: 'success',
    message: 'Match result and player statistics saved atomically.',
    data: result,
  });
});
