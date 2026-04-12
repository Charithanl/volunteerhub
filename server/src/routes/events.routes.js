import { requireAuth } from '@clerk/express';
import { Router } from 'express';
import { applyToEvent, getEventById, listEvents } from '../controllers/events.controller.js';

const router = Router();

router.get('/', listEvents);
router.get('/:eventId', getEventById);
router.post('/:eventId/applications', requireAuth(), applyToEvent);

export default router;
