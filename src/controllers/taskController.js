import taskService from '../services/taskService.js';
import { createTaskSchema, updateTaskStatusSchema } from '../validators/taskValidator.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const createTask = async (req, res) => {
    try {
        const { error } = createTaskSchema.validate(req.body);
        if (error) {
            return errorResponse(res, 400, 'Validation Error', error.details[0].message);
        }

        const task = await taskService.createTask(req.body);
        successResponse(res, 201, 'Task created successfully', task);
    } catch (err) {
        errorResponse(res, 500, 'Internal Server Error', err);
    }
};

export const getAllTasks = async (req, res) => {
    try {
        const { page, limit, status } = req.query;
        const result = await taskService.getAllTasks(page, limit, status);
        successResponse(res, 200, 'Tasks retrieved successfully', result.tasks, result.pagination);
    } catch (err) {
        errorResponse(res, 500, 'Internal Server Error', err);
    }
};

export const getMyTasks = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const result = await taskService.getUserTasks(req.user.id, page, limit);
        successResponse(res, 200, 'My tasks retrieved successfully', result.tasks, result.pagination);
    } catch (err) {
        errorResponse(res, 500, 'Internal Server Error', err);
    }
};

export const updateTaskStatus = async (req, res) => {
    try {
        const { error } = updateTaskStatusSchema.validate(req.body);
        if (error) {
            return errorResponse(res, 400, 'Validation Error', error.details[0].message);
        }

        const { id } = req.params;
        const { status } = req.body;
        const isAdmin = req.user.role === 'ADMIN';

        const task = await taskService.updateTaskStatus(id, req.user.id, status, isAdmin);
        successResponse(res, 200, 'Task status updated successfully', task);
    } catch (err) {
        if (err.message === 'Task not found') {
            return errorResponse(res, 404, err.message);
        }
        if (err.message === 'You are not authorized to update this task') {
            return errorResponse(res, 403, err.message);
        }
        errorResponse(res, 500, 'Internal Server Error', err);
    }
};
