import Joi from 'joi';

export const createTaskSchema = Joi.object({
    title: Joi.string().required().min(3),
    description: Joi.string().optional(),
    assigned_to: Joi.string().uuid().required(),
    status: Joi.string().valid('pending', 'in_progress', 'completed').optional(),
});

export const updateTaskStatusSchema = Joi.object({
    status: Joi.string().valid('pending', 'in_progress', 'completed').required(),
});
