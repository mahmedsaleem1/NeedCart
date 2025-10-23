import { Router } from 'express';
import {
    listItemForRent,
    removeItemFromRent,
    viewAllRentalItems,
    requestToRentItem
} from '../controllers/rent.controller.js'
import upload from '../middlewares/multer.middleware.js';
import { verifyFirebaseToken } from '../middlewares/verifyIdToken.middleware.js'

const router = Router();

router.route('/add').post(verifyFirebaseToken, upload.single('image'), listItemForRent);
router.route('/remove/:rentId').post(verifyFirebaseToken, removeItemFromRent);
router.route('/all').get(viewAllRentalItems);
router.route('/rent-item/:rentId').post(verifyFirebaseToken, requestToRentItem);

export default router;