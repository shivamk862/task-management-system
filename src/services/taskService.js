import { Task, User } from '../models/index.js';

const createTask = async (taskData) => {
    const task = await Task.create(taskData);
    return task;
};

const getAllTasks = async (page = 1, limit = 10, status) => {
    const offset = (page - 1) * limit;
    const whereClause = {};

    if (status) {
        whereClause.status = status;
    }

    const { count, rows } = await Task.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        include: [{ model: User, as: 'assignee', attributes: ['id', 'name', 'email'] }],
    });

    return {
        tasks: rows,
        pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / limit),
            totalRecords: count,
        },
    };
};

const getUserTasks = async (userId, page = 1, limit = 10) => {
    const offset = (page - 1) * limit;

    const { count, rows } = await Task.findAndCountAll({
        where: { assigned_to: userId },
        limit: parseInt(limit),
        offset: parseInt(offset),
    });

    return {
        tasks: rows,
        pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / limit),
            totalRecords: count,
        },
    };
};

const updateTaskStatus = async (taskId, userId, status, isAdmin) => {
    const task = await Task.findByPk(taskId);

    if (!task) {
        throw new Error('Task not found');
    }

    // Regular users can only update their own tasks
    if (!isAdmin && task.assigned_to !== userId) {
        throw new Error('You are not authorized to update this task');
    }

    task.status = status;
    await task.save();
    return task;
};

export default {
    createTask,
    getAllTasks,
    getUserTasks,
    updateTaskStatus,
};
