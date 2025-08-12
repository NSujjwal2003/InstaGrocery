// import 'dotenv/config';
// import cookieParser from 'cookie-parser';
// import express from 'express';
// import cors from 'cors';
// import connectDB from './configs/db.js';
// import userRouter from './routes/userRoute.js';
// import sellerRouter from './routes/sellerRoute.js';
// import connectCloudinary from './configs/cloudinary.js';
// import productRouter from './routes/productRoute.js';
// import cartRouter from './routes/cartRoute.js';
// import addressRouter from './routes/addressRoute.js';
// import orderRouter from './routes/orderRoute.js';

// const app = express();
// const port = process.env.PORT || 3000;

// connectCloudinary();
// await connectDB();


// //allow multiple origin
// const allowedOrigins = ['http://localhost:5173'];



// //middleware configuration
// app.use(express.json());
// app.use(cookieParser());
// app.use(cors({origin : allowedOrigins, credentials : true}))

// app.get('/', (req, res) => res.send('API is working'));

// app.use('/api/user', userRouter);
// app.use('/api/seller', sellerRouter);
// app.use('/api/product', productRouter);
// app.use('/api/cart', cartRouter);
// app.use('/api/address', addressRouter);
// app.use('/api/order', orderRouter);


// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });


import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './configs/db.js';
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import ConnectCloudinary from './configs/cloudinary.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';

dotenv.config(); // ✅ Load environment variables

const app = express();
const PORT = process.env.PORT || 4000;

// ✅ Connect DB & Cloudinary

ConnectCloudinary();
await connectDB();

// ✅ CORS setup FIRST before any middleware
const allowedOrigins = [
  'http://localhost:5173',
 
  //'https://go-cart-lac.vercel.app'  // ✅ NEW frontend domain added
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));


// ✅ Main middleware AFTER webhook
app.use(express.json());
app.use(cookieParser());

// ✅ Health check
app.get('/', (req, res) => {
  res.send('API is running');
});

// ✅ Route handlers
app.use('/api/user', userRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});