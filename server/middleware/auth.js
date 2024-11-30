const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const logger = require("../services/logger");

const authenticateJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        try {
            const decodedToken = jwt.verify(token, process.env.JWT_KEY);

            const user = await UserModel.findById(decodedToken.userId);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            req.user = {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
                employeeID: user.employeeID,
                profileImage: user.profileImage
            };

            next();
        } catch (error) {
            logger.error('Invalid token:', error);
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
    } else {
        return res.status(401).json({ message: 'Authorization header missing' });
    }
};

module.exports = authenticateJWT;
