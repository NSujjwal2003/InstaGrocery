import jwt from 'jsonwebtoken';

const authSeller = (req, res, next) => {
    const { sellerToken } = req.cookies;
    if (!sellerToken) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

     try {
            const tokenDecoded = jwt.verify(sellerToken, process.env.JWT_SECRET);
            if (tokenDecoded.email === process.env.SELLER_EMAIL) {
                 next();   
            }
            else {
                return res.status(401).json({ success: false, message: "Unauthorized" });
            } 
          ; // Proceed to the next middleware or route handler
        } catch (error) {
            console.error("Authentication error:", error.message);
            return res.status(401).json({ success: false, message: "Invalid token" });
        } 
}
export default authSeller;
