import { Router } from 'express';
import * as teamController from '../controllers/teamController.js';

const router = Router();

router.get('/', teamController.getAllTeams);
router.get('/:id', teamController.getTeamById);
router.get('/:id/season-summary', teamController.getTeamSeasonSummary);
router.get('/:id/squad', teamController.getTeamSquad);

export default router;
