import { playerService } from '../services/playerService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import { getPaginationParams, formatPaginatedResponse } from '../utils/pagination.js';

export const getPlayers = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPaginationParams(req.query, 12, 100);
  const { seasonId, teamId, position, nationality, q, sort } = req.query;

  const result = await playerService.getPlayers({
    seasonId: seasonId ? Number(seasonId) : null,
    teamId: teamId ? Number(teamId) : null,
    position,
    nationality,
    q,
    sort,
    limit,
    offset,
  });

  const response = formatPaginatedResponse(result.players, result.total, page, limit);
  res.json({ status: 'success', ...response });
});

export const getPlayerById = asyncHandler(async (req, res) => {
  const data = await playerService.getPlayerById(req.params.id);
  if (!data) {
    throw new AppError(`Player with ID ${req.params.id} not found`, 404);
  }
  res.json({ status: 'success', data });
});

export const getNationalities = asyncHandler(async (req, res) => {
  const { seasonId, teamId } = req.query;
  const nationalities = await playerService.getDistinctNationalities(
    seasonId ? Number(seasonId) : null,
    teamId ? Number(teamId) : null
  );
  res.json({ status: 'success', data: nationalities });
});
