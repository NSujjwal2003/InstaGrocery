import bcrypt from 'bcryptjs';
import User from '../models/user.js'; 
import jwt from 'jsonwebtoken';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// ✅ REGISTER USER : /api/user/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const normalizedEmail = email.toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email: normalizedEmail, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, COOKIE_OPTIONS);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: { name: newUser.name, email: newUser.email }
    });

  } catch (error) {
    console.error("Error registering user:", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


// ✅ LOGIN USER : /api/user/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const normalizedEmail = email.toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid password"});
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, COOKIE_OPTIONS);

    return res.status(200).json({
      success: true,
      user: { name: user.name, email: user.email }
    });

  } catch (error) {
    console.error("Error logging in user:", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


// ✅ CHECK AUTH : /api/user/auth
export const isAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error checking authentication:", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


// ✅ LOGOUT USER : /api/user/logout
export const logoutUser = (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    return res.status(200).json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    console.error("Error logging out user:", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};