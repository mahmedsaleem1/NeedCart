import { Router } from 'express';
import {
    createOffer,
    getAllOffers,
    acceptOffer,
    rejectOffer
} from '../controllers/offer.controller.js'
import upload from '../middlewares/multer.middleware.js';
import { verifyFirebaseToken } from '../middlewares/verifyIdToken.middleware.js'

const router = Router();

router.route('/create/:postId').post(verifyFirebaseToken, createOffer);
router.route('/all/:postId').get(getAllOffers);
router.route('/accept/:id').post(verifyFirebaseToken, acceptOffer);
router.route('/reject/:id').post(verifyFirebaseToken, rejectOffer);

export default router;