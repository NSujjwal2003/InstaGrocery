import express from 'express';
import { isAuth, logoutUser, loginUser, registerUser } from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js';


const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login' , loginUser);
userRouter.get('/auth' , authUser, isAuth);
userRouter.get('/logout' , logoutUser);


export default userRouter;