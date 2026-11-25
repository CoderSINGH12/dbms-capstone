import { z } from 'zod';

export const teamCreateSchema = z.object({
  name: z.string().min(2).max(100),
  short_name: z.string().min(2).max(50),
  tla: z.string().max(5).optional().nullable(),
  crest_url: z.string().url().optional().nullable(),
  city: z.string().min(2).max(50),
  stadium: z.string().min(2).max(100),
  founded_year: z.number().int().min(1850).max(2030).optional().nullable(),
});

export const teamUpdateSchema = teamCreateSchema.partial();
