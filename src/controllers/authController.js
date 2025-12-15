import authService from '../services/authService.js';
import { registerSchema, loginSchema } from '../validators/authValidator.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const register = async (req, res) => {
    try {
        const { error } = registerSchema.validate(req.body);
        if (error) {
            return errorResponse(res, 400, 'Validation Error', error.details[0].message);
        }

        const user = await authService.register(req.body);
        successResponse(res, 201, 'User registered successfully', user);
    } catch (err) {
        if (err.message === 'Email already already exists') {
            return errorResponse(res, 409, err.message);
        }
        errorResponse(res, 500, 'Internal Server Error', err);
    }
};

export const login = async (req, res) => {
    try {
        const { error } = loginSchema.validate(req.body);
        if (error) {
            return errorResponse(res, 400, 'Validation Error', error.details[0].message);
        }

        const { user, token } = await authService.login(req.body.email, req.body.password);
        successResponse(res, 200, 'Login successful', { user, token });
    } catch (err) {
        if (err.message === 'Invalid credentials') {
            return errorResponse(res, 401, err.message);
        }
        errorResponse(res, 500, 'Internal Server Error', err);
    }
};
