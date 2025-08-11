import {v2 as cloudinary} from 'cloudinary';
import Product from '../models/product.js';


// Add Product : /api/product/add
export const addProduct = async (req, res) => {
    try {
        let productData = JSON.parse(req.body.productData);
        const images = req.files

        let imagesUrl = await Promise.all(
            images.map(async (image) => {
                const result = await cloudinary.uploader.upload(image.path , {resource_type: "image"});
                return result.secure_url;
            })
        );

        await Product.create({
            ...productData,
            image: imagesUrl
        });
        res.status(201).json({ success: true, message: "Product added successfully" });

    } catch (error) {
        console.error("Error adding product:", error.message);
        return res.status(500).json({ success: false, message: "Server error" });
        
    }

}

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

// Get Single Product : /api/product/id
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



//this is better code : req.params are used for most of the ops, req.body is used for creating/updating resources

// import { v2 as cloudinary } from 'cloudinary';
// import Product from '../models/product.js';

// // Helper: send standardized error response
// const sendError = (res, status, message) => {
//     return res.status(status).json({ success: false, message });
// };

// // Add Product: POST /api/product/add
// export const addProduct = async (req, res) => {
//     try {
//         // Parse product data
//         if (!req.body.productData) {
//             return sendError(res, 400, "Product data is required");
//         }
//         let productData = JSON.parse(req.body.productData);

//         // Validate essential fields
//         if (!productData.name || !productData.price) {
//             return sendError(res, 400, "Product name and price are required");
//         }

//         // Check if files exist
//         const images = req.files;
//         if (!images || images.length === 0) {
//             return sendError(res, 400, "At least one image is required");
//         }

//         // Upload images to Cloudinary
//         let imagesUrl = await Promise.all(
//             images.map(async (image) => {
//                 try {
//                     const result = await cloudinary.uploader.upload(image.path, { resource_type: "image" });
//                     return result.secure_url;
//                 } catch (uploadErr) {
//                     throw new Error(`Image upload failed: ${uploadErr.message}`);
//                 }
//             })
//         );

//         // Save product to DB
//         await Product.create({
//             ...productData,
//             image: imagesUrl
//         });

//         return res.status(201).json({ success: true, message: "Product added successfully" });

//     } catch (error) {
//         console.error("Error adding product:", error);
//         return sendError(res, 500, error.message || "Server error");
//     }
// };

// // Get Product List: GET /api/product/list
// export const productList = async (req, res) => {
//     try {
//         const products = await Product.find({});
//         return res.status(200).json({ success: true, products });
//     } catch (error) {
//         console.error("Error fetching products:", error);
//         return sendError(res, 500, "Unable to fetch products");
//     }
// };

// // Get Single Product: GET /api/product/:id
// export const productById = async (req, res) => {
//     try {
//         const { id } = req.params;

//         if (!id) return sendError(res, 400, "Product ID is required");

//         const product = await Product.findById(id);
//         if (!product) return sendError(res, 404, "Product not found");

//         return res.status(200).json({ success: true, data: product });
//     } catch (error) {
//         console.error("Error fetching product by ID:", error);
//         return sendError(res, 500, "Unable to fetch product");
//     }
// };

// // Change Product Stock: PATCH /api/product/:id/stock
// export const changeStock = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { inStock } = req.body;

//         if (typeof inStock !== 'boolean') {
//             return sendError(res, 400, "inStock must be a boolean");
//         }

//         const updatedProduct = await Product.findByIdAndUpdate(id, { inStock }, { new: true });
//         if (!updatedProduct) return sendError(res, 404, "Product not found");

//         return res.status(200).json({ success: true, message: "Product stock updated successfully", product: updatedProduct });
//     } catch (error) {
//         console.error("Error changing product stock:", error);
//         return sendError(res, 500, "Unable to update stock");
//     }
// };
