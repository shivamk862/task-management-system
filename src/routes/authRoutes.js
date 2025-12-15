import express from 'express';
import * as authController from '../controllers/authController.js';
import { authenticateUser, authorizeRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', authenticateUser, authorizeRole('ADMIN'), authController.register);
router.post('/login', authController.login);

export default router;
