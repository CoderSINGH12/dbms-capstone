import { Router } from 'express';
import * as adminController from '../controllers/adminController.js';
import { verifyToken, requireAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { teamCreateSchema, teamUpdateSchema } from '../validators/teamSchemas.js';
import { playerCreateSchema, playerUpdateSchema, registrationCreateSchema } from '../validators/playerSchemas.js';
import { matchCreateSchema, matchUpdateSchema } from '../validators/matchSchemas.js';

const router = Router();

// Protect all admin routes
router.use(verifyToken, requireAdmin);

router.get('/stats', adminController.getStats);
router.get('/import-batches', adminController.getImportBatches);

// Teams
router.post('/teams', validate(teamCreateSchema), adminController.createTeam);
router.put('/teams/:id', validate(teamUpdateSchema), adminController.updateTeam);
router.delete('/teams/:id', adminController.deleteTeam);

// Players
router.post('/players', validate(playerCreateSchema), adminController.createPlayer);
router.put('/players/:id', validate(playerUpdateSchema), adminController.updatePlayer);
router.delete('/players/:id', adminController.deletePlayer);

// Registrations
router.post('/registrations', validate(registrationCreateSchema), adminController.createRegistration);
router.delete('/registrations/:id', adminController.deleteRegistration);

// Matches
router.post('/matches', validate(matchCreateSchema), adminController.createMatch);
router.put('/matches/:id', validate(matchUpdateSchema), adminController.updateMatch);
router.delete('/matches/:id', adminController.deleteMatch);

export default router;
