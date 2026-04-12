import { Router } from 'express';
import applicationsRoutes from './applications.routes.js';
import eventsRoutes from './events.routes.js';
import healthRoutes from './health.routes.js';
import profileRoutes from './profile.routes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/me/profile', profileRoutes);
router.use('/events', eventsRoutes);
router.use('/me/applications', applicationsRoutes);

export default router;
