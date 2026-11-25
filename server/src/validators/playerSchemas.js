import { z } from 'zod';

export const playerCreateSchema = z.object({
  name: z.string().min(2).max(100),
  date_of_birth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD').optional().nullable(),
  nationality: z.string().min(2).max(50).optional().nullable(),
  image_url: z.string().url().optional().nullable(),
});

export const playerUpdateSchema = playerCreateSchema.partial();

export const registrationCreateSchema = z.object({
  player_id: z.number().int().positive(),
  team_id: z.number().int().positive(),
  season_id: z.number().int().positive(),
  shirt_number: z.number().int().min(1).max(99).optional().nullable(),
  position: z.enum(['Goalkeeper', 'Defender', 'Midfielder', 'Forward']),
  joined_on: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  left_on: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
});
