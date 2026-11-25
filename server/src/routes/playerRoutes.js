import { Router } from 'express';
import * as playerController from '../controllers/playerController.js';

const router = Router();

router.get('/', playerController.getPlayers);
router.get('/nationalities', playerController.getNationalities);
router.get('/:id', playerController.getPlayerById);

export default router;
