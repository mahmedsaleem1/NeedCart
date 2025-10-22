import { Router } from 'express';
import {
    addProduct,
    removeProduct,
    getAllProducts,
    getProductById
} from '../controllers/product.controller.js'
import upload from '../middlewares/multer.middleware.js';
import { verifyFirebaseToken } from '../middlewares/verifyIdToken.middleware.js'

const router = Router();

router.route('/add').post(verifyFirebaseToken,  upload.single('image'), addProduct);
router.route('/remove/:prodId').post(verifyFirebaseToken, removeProduct);
router.route('/all').get(getAllProducts);
router.route('/getOne/:prodId').get(getProductById);

export default router;