import { Router } from 'express';
import { verifyFirebaseToken } from '../middlewares/verifyIdToken.middleware.js';
import {
  performCOD
} from '../services/COD.service.js';

const router = Router();

// Buy route (initiates the transaction)
router.post('/buy/:itemId', verifyFirebaseToken, performCOD);

export default router;
