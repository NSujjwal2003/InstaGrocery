import jwt from 'jsonwebtoken';


const authUser = (req, res, next) => {
     const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
    try {
        const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET); 
        if (tokenDecoded.id ) {
            req.userId = tokenDecoded.id; // Attach user ID to request body
            
        }
        else {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        } 
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error("Authentication error:", error.message);
        return res.status(401).json({ success: false, message: "Invalid token" });
    }   
}
export default authUser;