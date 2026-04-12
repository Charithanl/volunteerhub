import { requireAuth } from '@clerk/express';
import { Router } from 'express';
import { getMyProfile, upsertMyProfile } from '../controllers/profile.controller.js';

const router = Router();

router.get('/', requireAuth(), getMyProfile);
router.put('/', requireAuth(), upsertMyProfile);

export default router;
