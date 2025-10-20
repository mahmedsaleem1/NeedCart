import { Router } from 'express';
import {
    addCommentOnAPost,
    deleteComment,
    getAllCommentsForPost
} from '../controllers/comment.controller.js'

import { verifyFirebaseToken } from '../middlewares/verifyIdToken.middleware.js'

const router = Router();

router.route('/do-comment/:postId').post(verifyFirebaseToken, addCommentOnAPost);
router.route('/delete-comment').post(verifyFirebaseToken, deleteComment);
router.route('/get-comments/:postId').get(getAllCommentsForPost);

export default router;