import { Router } from 'express';
import {
    createReview,
    deleteReview,
    getReviewsForProduct
} from '../controllers/review.controller.js'

import { verifyFirebaseToken } from '../middlewares/verifyIdToken.middleware.js'

const router = Router();

router.route('/add/:prodId').post(verifyFirebaseToken, createReview);
router.route('/delete/:revId').post(verifyFirebaseToken, deleteReview);
router.route('/get/:prodId').get(getReviewsForProduct);

export default router;