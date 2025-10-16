import { Router } from 'express';
import {
    registerWithEmail,
    resetPassword,
    loginWithIdToken,
    getUserByEmail,
    googleLogin
} from '../controllers/auth.controller.js'

import { verifyFirebaseToken } from '../middlewares/verifyIdToken.middleware.js'

const router = Router();

router.route('/signup').post(registerWithEmail);
router.route('/login').post(verifyFirebaseToken, loginWithIdToken);
router.post('/google-login', verifyFirebaseToken, googleLogin);
router.route('/reset-password').post(resetPassword);
router.route('/user').get(verifyFirebaseToken, getUserByEmail);

export default router;