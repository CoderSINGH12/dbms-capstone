import { Router } from 'express';
import * as seasonController from '../controllers/seasonController.js';

const router = Router();

router.get('/', seasonController.getAllSeasons);
router.get('/:id', seasonController.getSeasonById);

export default router;
