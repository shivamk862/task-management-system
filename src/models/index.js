import User from './user.js';
import Task from './task.js';

User.hasMany(Task, { foreignKey: 'assigned_to', as: 'tasks' });
Task.belongsTo(User, { foreignKey: 'assigned_to', as: 'assignee' });

export {
    User,
    Task,
};
