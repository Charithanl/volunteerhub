import { requireAuth } from '@clerk/express';
import { Router } from 'express';
import {
  getMyApplicationById,
  listMyApplications,
  withdrawMyApplication,
} from '../controllers/applications.controller.js';

const router = Router();

router.get('/', requireAuth(), listMyApplications);
router.get('/:applicationId', requireAuth(), getMyApplicationById);
router.delete('/:applicationId', requireAuth(), withdrawMyApplication);

export default router;
