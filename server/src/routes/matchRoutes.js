import { Router } from 'express';
import * as matchController from '../controllers/matchController.js';
import { verifyToken, requireAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { batchMatchStatsSchema } from '../validators/statsSchemas.js';

const router = Router();

router.get('/', matchController.getMatches);
router.get('/:id', matchController.getMatchById);

// Admin atomic score + stats update
router.put('/:id/result', verifyToken, requireAdmin, validate(batchMatchStatsSchema), matchController.saveMatchResultAndStats);

export default router;
