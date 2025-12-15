import express from 'express';
import * as taskController from '../controllers/taskController.js';
import { authenticateUser, authorizeRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateUser, authorizeRole('ADMIN'), taskController.createTask);
router.get('/', authenticateUser, authorizeRole('ADMIN'), taskController.getAllTasks);
router.get('/my', authenticateUser, taskController.getMyTasks);
router.patch('/:id/status', authenticateUser, taskController.updateTaskStatus);

export default router;
