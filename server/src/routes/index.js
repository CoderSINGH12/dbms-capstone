import { Router } from 'express';
import seasonRoutes from './seasonRoutes.js';
import teamRoutes from './teamRoutes.js';
import playerRoutes from './playerRoutes.js';
import matchRoutes from './matchRoutes.js';
import standingsRoutes from './standingsRoutes.js';
import analyticsRoutes from './analyticsRoutes.js';
import authRoutes from './authRoutes.js';
import adminRoutes from './adminRoutes.js';

const router = Router();

router.use('/seasons', seasonRoutes);
router.use('/teams', teamRoutes);
router.use('/players', playerRoutes);
router.use('/matches', matchRoutes);
router.use('/standings', standingsRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'success',
    timestamp: new Date().toISOString(),
    service: 'FC Barcelona La Liga DBMS API',
  });
});

export default router;
