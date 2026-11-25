import { z } from 'zod';

export const matchPlayerStatSchema = z.object({
  registration_id: z.number().int().positive(),
  started: z.union([z.boolean(), z.number().int().min(0).max(1)]).transform(v => (v ? 1 : 0)),
  minutes: z.number().int().min(0).max(130),
  goals: z.number().int().min(0).default(0),
  assists: z.number().int().min(0).default(0),
  yellow: z.number().int().min(0).max(2).default(0),
  red: z.number().int().min(0).max(1).default(0),
});

export const batchMatchStatsSchema = z.object({
  home_score: z.number().int().min(0),
  away_score: z.number().int().min(0),
  status: z.enum(['finished']).default('finished'),
  stats: z.array(matchPlayerStatSchema),
});
