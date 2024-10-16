import express from 'express';
import { 
  createProduct, 
  getAllProducts, 
  getProductById, 
  updateProduct, 
  deleteProduct, 
  upload 
} from '../controllers/productController.js';

const router = express.Router();

// Route to create a new product (with image upload)
router.post('/create', upload.single('image'), createProduct);

// Route to get all products
router.get('/', getAllProducts);

// Route to get a single product by ID
router.get('/:id', getProductById);

// Route to update a product by ID (with optional image upload)
router.put('/:id', upload.single('image'), updateProduct);

// Route to delete a product by ID
router.delete('/:id', deleteProduct);

export default router;

