import { Router } from 'express';
import authRoutes from './auth';

const router = Router();

router.use('/game', authRoutes);

export default router;
