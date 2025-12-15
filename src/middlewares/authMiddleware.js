import jwt from 'jsonwebtoken';
import { errorResponse } from '../utils/response.js';
import { User } from '../models/index.js';

export const authenticateUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return errorResponse(res, 401, 'Unauthorized access. No token provided.');
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findByPk(decoded.id);

        if (!user) {
            return errorResponse(res, 401, 'Unauthorized access. User not found.');
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return errorResponse(res, 401, 'Unauthorized access. Token expired.');
        }
        return errorResponse(res, 401, 'Unauthorized access. Invalid token.');
    }
};

export const authorizeRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return errorResponse(res, 403, 'Forbidden access. Insufficient permissions.');
        }
        next();
    };
};
