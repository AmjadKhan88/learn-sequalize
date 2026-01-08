import Auth from "../models/auth.model.js";
import jwt from "jsonwebtoken";

export const isAuth = async (req, res, next) => {
    try {
        // 1. Get token from cookies
        const token = req.cookies.token;
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not Authorized. Please login."
            });
        }

        // 2. Verify the token and get decoded data
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 3. Extract user ID from decoded token
        // Assuming your token payload contains userId
        const userId = decoded.id;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Invalid token structure"
            });
        }

        // 4. Find user by ID
        const user = await Auth.findByPk(userId);
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        // 5. Attach user to request object
        req.auth = user; // Better to use req.user instead of req.auth
        next();

    } catch (error) {
        // Handle different JWT errors
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: "Token expired. Please login again."
            });
        }
        
        return res.status(500).json({
            success: false,
            message: "Authentication failed",
            error: error.message
        });
    }
};