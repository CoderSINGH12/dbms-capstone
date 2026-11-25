import { z } from 'zod';

export const matchCreateSchema = z.object({
  season_id: z.number().int().positive(),
  matchday: z.number().int().min(1).max(38),
  home_team_id: z.number().int().positive(),
  away_team_id: z.number().int().positive(),
  kickoff_utc: z.string().optional().nullable(),
  status: z.enum(['scheduled', 'postponed', 'finished', 'abandoned']).default('scheduled'),
  home_score: z.number().int().min(0).optional().nullable(),
  away_score: z.number().int().min(0).optional().nullable(),
  venue: z.string().max(100).optional().nullable(),
  referee: z.string().max(100).optional().nullable(),
}).refine(data => data.home_team_id !== data.away_team_id, {
  message: 'Home team and away team cannot be the same',
  path: ['away_team_id'],
}).refine(data => {
  if (data.status === 'finished') {
    return data.home_score !== null && data.home_score !== undefined &&
           data.away_score !== null && data.away_score !== undefined;
  }
  return true;
}, {
  message: 'Finished matches must have both home and away scores specified',
  path: ['status'],
});

export const matchUpdateSchema = z.object({
  status: z.enum(['scheduled', 'postponed', 'finished', 'abandoned']).optional(),
  home_score: z.number().int().min(0).optional().nullable(),
  away_score: z.number().int().min(0).optional().nullable(),
  venue: z.string().max(100).optional().nullable(),
  referee: z.string().max(100).optional().nullable(),
  kickoff_utc: z.string().optional().nullable(),
});
