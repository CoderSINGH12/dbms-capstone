import { standingsService } from '../services/standingsService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getStandings = asyncHandler(async (req, res) => {
  const seasonId = Number(req.query.seasonId || 1);
  const standings = await standingsService.getStandings(seasonId);
  res.json({ status: 'success', data: standings });
});

export const reconcileStandings = asyncHandler(async (req, res) => {
  const seasonId = Number(req.query.seasonId || 2);
  const audit = await standingsService.reconcileStandings(seasonId);
  res.json({ status: 'success', data: audit });
});
