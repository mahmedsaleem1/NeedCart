import { Router } from 'express';
import {
    createTransaction,
    getTransactionById,
    getTransactionsByBuyer,
    getTransactionsBySeller,
    updateTransactionStatus
} from '../controllers/transaction.controller.js'

import { verifyFirebaseToken } from '../middlewares/verifyIdToken.middleware.js'

const router = Router();

// router.route('/create/:itemId').post(verifyFirebaseToken, createTransaction); // can be product or offer(for post)
router.route('/getById/:Tid').get(getTransactionById);
router.route('/getByBuyer').get(verifyFirebaseToken, getTransactionsByBuyer);
router.route('/getBySeller').get(verifyFirebaseToken, getTransactionsBySeller);
// router.route('/update/:Tid').put(verifyFirebaseToken, updateTransactionStatus);

export default router;