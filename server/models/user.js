import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
  password:{
        type: String,
        required: true
    },
   cartItems:{type:Object , default:{} },

},{minimize: false}); // then after that you can use minimize: false to prevent mongoose from removing empty objects

const User =  mongoose.models.user || mongoose.model('user', userSchema);
export default User;