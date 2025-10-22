import { Router } from 'express';
import {
    addToWishlist,
    removeFromWishlist,
    wishlistOfLoggedInBuyer
} from '../controllers/wishlist.controller.js'

import { verifyFirebaseToken } from '../middlewares/verifyIdToken.middleware.js'

const router = Router();

router.route('/add/:prodId').post(verifyFirebaseToken, addToWishlist);
router.route('/delete/:prodId').post(verifyFirebaseToken, removeFromWishlist);
router.route('/get').get(verifyFirebaseToken, wishlistOfLoggedInBuyer);

export default router;