// server/routes/productRoute.js
import express from 'express';
import { upload } from '../configs/multer.js';
import authSeller from '../middlewares/authSeller.js';
import { addProduct, changeStock, productById, productList } from '../controllers/productController.js';

const productRouter = express.Router();

// Ensure auth runs first, then multer parses the files
productRouter.post('/add', authSeller, upload.array('images', 6), addProduct);   // allow up to 6 files
productRouter.get('/list', productList);
productRouter.get('/id', productById);
productRouter.post('/stock', authSeller, changeStock);

export default productRouter;
