import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Assuming the token is sent as "Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    jwt.verify(token,  process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }

        req.user = decoded;
        next();
    });
};