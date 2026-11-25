import { seasonService } from '../services/seasonService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';

export const getAllSeasons = asyncHandler(async (req, res) => {
  const seasons = await seasonService.getAllSeasons();
  res.json({ status: 'success', data: seasons });
});

export const getSeasonById = asyncHandler(async (req, res) => {
  const season = await seasonService.getSeasonById(req.params.id);
  if (!season) {
    throw new AppError(`Season with ID ${req.params.id} not found`, 404);
  }
  res.json({ status: 'success', data: season });
});
