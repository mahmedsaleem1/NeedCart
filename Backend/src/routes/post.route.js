import { Router } from 'express';
import {
    createPost,
    getAllPosts
} from '../controllers/post.controller.js'
import upload from '../middlewares/multer.middleware.js';
import { verifyFirebaseToken } from '../middlewares/verifyIdToken.middleware.js'

const router = Router();

router.route('/create').post(verifyFirebaseToken, upload.single('image'), createPost);
router.route('/all').get(getAllPosts);

export default router;