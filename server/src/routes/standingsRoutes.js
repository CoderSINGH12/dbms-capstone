import { Router } from 'express';
import * as standingsController from '../controllers/standingsController.js';

const router = Router();

router.get('/', standingsController.getStandings);
router.get('/reconcile', standingsController.reconcileStandings);

export default router;
