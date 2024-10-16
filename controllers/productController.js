import productModel from '../models/productModel.js';
import multer from 'multer';
import path from 'path';

// Multer configuration for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');  // Folder to store the uploaded images
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);  // Append unique timestamp to avoid overwrites
  },
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

// Multer instance
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },  // 2MB max file size
});

// Create Product with Image Upload
export const createProduct = async (req, res) => {
  try {
    const { title, short_des, price, discount, stock, star, remark } = req.body;

    // Validate required fields
    if (!title || !price || !stock) {
      return res.status(400).json({
        success: false,
        message: 'Title, price, and stock are required fields',
      });
    }

    // Construct product data
    const productData = {
      title,
      short_des,
      price,
      discount,
      stock,
      star,
      remark,
      image: req.file ? req.file.path : null,  // Save image path if provided
    };

    const newProduct = new productModel(productData);
    const savedProduct = await newProduct.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: savedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message,
    });
  }
};

// Get All Products
export const getAllProducts = async (req, res) => {
  try {
    const products = await productModel.find();
    res.status(200).json({
      success: true,
      message: 'Products retrieved successfully',
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve products',
      error: error.message,
    });
  }
};

// Get Single Product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with ID ${req.params.id} not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product retrieved successfully',
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to retrieve product with ID ${req.params.id}`,
      error: error.message,
    });
  }
};

// Update Product with Image Upload
export const updateProduct = async (req, res) => {
  try {
    const { title, short_des, price, discount, stock, star, remark } = req.body;

    // Find the product by ID
    const product = await productModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with ID ${req.params.id} not found`,
      });
    }

    // Update fields if they exist, otherwise retain original data
    const productData = {
      title: title || product.title,
      short_des: short_des || product.short_des,
      price: price || product.price,
      discount: discount || product.discount,
      stock: stock || product.stock,
      star: star || product.star,
      remark: remark || product.remark,
      image: req.file ? req.file.path : product.image,  // Keep the old image if no new one is uploaded
    };

    const updatedProduct = await productModel.findByIdAndUpdate(req.params.id, productData, { new: true });

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to update product with ID ${req.params.id}`,
      error: error.message,
    });
  }
};

// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const product = await productModel.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with ID ${req.params.id} not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to delete product with ID ${req.params.id}`,
      error: error.message,
    });
  }
};
