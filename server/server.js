import 'dotenv/config';
import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';

const app = express();
const port = process.env.PORT || 3000;
const allowedOrigins = ['http://localhost:5173'];

await connectDB();

//middleware configuration
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin : allowedOrigins, credentials : true}))

app.get('/', (req, res) => {
  res.send('API is working');
});

app.use('/api/user', userRouter);
app.use('/api/seller', sellerRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});