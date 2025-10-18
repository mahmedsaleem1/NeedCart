import { Router } from 'express';
import {
    likePost,
    unlikePost,
    getLikesForPost
} from '../controllers/like.controller.js'

import { verifyFirebaseToken } from '../middlewares/verifyIdToken.middleware.js'

const router = Router();

router.route('/do-like').post(verifyFirebaseToken, likePost);
router.route('/do-unlike').post(verifyFirebaseToken, unlikePost);
router.route('/get-likes/:postId').get(getLikesForPost);

export default router;