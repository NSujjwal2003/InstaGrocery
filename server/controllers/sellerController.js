import jwt from 'jsonwebtoken';


// Seller Login : api/seller/login

export const sellerLogin = async (req, res) => {
   try {
     const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (password == process.env.SELLER_PASSWORD && email == process.env.SELLER_EMAIL) {
     const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('sellerToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return res.status(200).json({ success: true, message: "Login successful" });    
         
    } else {
        return res.status(400).json({ success: false, message: "Invalid credentials" });
    }
    
   } catch (error) {
       console.error("Error logging in seller:", error.message);
       return res.status(500).json({ success: false, message: error.message });
    
   }


}


// Check Seller Authentication : /api/seller/auth

// export const isSellerAuth = async (req, res) => {
//     try {
//          return res.status(200).json({ success: true });

//     } catch (error) {
//         console.error("Error checking authentication:", error.message);
//         return res.status(500).json({ success: false, message: error.message });
//     }
// }


export const isSellerAuth = async (req, res) => {
  try {
    const { sellerToken } = req.cookies;
    if (!sellerToken) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const decoded = jwt.verify(sellerToken, process.env.JWT_SECRET);

    if (decoded.email === process.env.SELLER_EMAIL) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(401).json({ success: false, message: "Invalid seller" });
    }

  } catch (error) {
    console.error("Error checking authentication:", error.message);
    return res.status(500).json({ success: false, message: "Invalid token" });
  }
};






// Logout seller
export const sellerLogout = (req, res) => {   
    try {
        res.clearCookie('sellerToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
        });
        return res.status(200).json({ success: true, message: "Seller logged out successfully" });
    } catch (error) {
        console.error("Error logging out user:", error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
}