// server/controllers/productController.js
import { cloudinary } from '../configs/cloudinary.js'; // use configured instance
import Product from '../models/product.js';
import fs from 'fs';

export const addProduct = async (req, res) => {
  try {
    console.log('--- addProduct called ---');
    console.log('Body keys:', Object.keys(req.body));
    console.log('Files count:', req.files?.length || 0);
    console.log('Files:', req.files);

    let productData = JSON.parse(req.body.productData);
    console.log('Parsed productData:', productData);
    const images = req.files;
    console.log('Uploaded images:', images);

    if (!images || images.length === 0) {
      return res.status(400).json({ success: false, message: 'No images uploaded' });
    }

    const imagesUrl = await Promise.all(
      images.map(async (image) => {
        try {
          const result = await cloudinary.uploader.upload(image.path, { resource_type: 'image' });
          return result.secure_url;
        } 
        catch (error) {
          return "failed"
        }
      })
    );

    const newProduct = await Product.create({
      ...productData,
      image: imagesUrl,
    });

    res.status(201).json({ success: true, message: 'Product added successfully', product: newProduct });

  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};


// Get Product : /api/product/list
export const productList = async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json({ success: true,  products });
    } catch (error) {
        console.error("Error fetching products:", error.message);
        return res.status(500).json({ success: false, message: "Server error" });
        
    }

}

// Get Singlr Product : /api/product/id
export const productById = async (req, res) => {

    try {
        const { id } = req.body;
        const product = await Product.findById(id);
         res.status(200).json({ success: true, data: product });
        
    } catch (error) {
        console.error("Error fetching product by ID:", error.message);
        return res.status(500).json({ success: false, message: "Server error" });
        
    }
}

// Change Product inStock : /api/product/stock
export const changeStock = async (req, res) => {
    try {
        const { id, inStock } = req.body;
          await Product.findByIdAndUpdate(id ,{inStock});
      
        res.status(200).json({ success: true, message: "Product stock updated successfully" });

    } catch (error) {
        console.error("Error changing product stock:", error.message);
        return res.status(500).json({ success: false, message: "Server error" });
        
    }

}