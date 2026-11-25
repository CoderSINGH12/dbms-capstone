import { Router } from 'express';
import * as analyticsController from '../controllers/analyticsController.js';

const router = Router();

router.get('/top-scorers', analyticsController.getTopScorers);
router.get('/top-assists', analyticsController.getTopAssists);
router.get('/cards', analyticsController.getDisciplinary);
router.get('/minutes', analyticsController.getMinutesLeaders);
router.get('/head-to-head', analyticsController.getHeadToHead);
router.get('/season-compare', analyticsController.compareSeasons);
router.get('/compare-players', analyticsController.comparePlayers);

export default router;
