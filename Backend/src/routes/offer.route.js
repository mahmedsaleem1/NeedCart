import { Router } from 'express';
import {
    createOffer,
    getAllOffers,
    acceptOffer,
    rejectOffer
} from '../controllers/offer.controller.js'
import { verifyFirebaseToken } from '../middlewares/verifyIdToken.middleware.js'

const router = Router();

router.route('/create/:postId').post(verifyFirebaseToken, createOffer);
router.route('/all/:postId').get(getAllOffers);
router.route('/accept/:offerId').post(verifyFirebaseToken, acceptOffer);
router.route('/reject/:offerId').post(verifyFirebaseToken, rejectOffer);

export default router;