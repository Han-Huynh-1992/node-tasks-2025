const { DataTypes } = require('sequelize');
const sequelize = require('../../config/mysqlDBConnection');
const Project = require('./projectModel');
const User = require('./userModel');

const Task = sequelize.define('task', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING },
    description: { type: DataTypes.STRING },
    status: {
        type: DataTypes.ENUM('To Do', 'In Progress', 'Testing', 'Complete'),
        defaultValue: 'To Do'
    },
    priority: {
        type: DataTypes.ENUM('Low', 'Medium', 'High'),
        defaultValue: 'Medium'
    },
    due_date: { type: DataTypes.DATE },
    project_id: { type: DataTypes.INTEGER },
    assignee_id: { type: DataTypes.INTEGER }
}, {
    tableName: 'task',
    freezeTableName: true,
    timestamps: false
});

// Task belongs to a project
Task.belongsTo(Project, { foreignKey: 'project_id' });
Project.hasMany(Task, { foreignKey: 'project_id' });

// Task assigned to user
Task.belongsTo(User, { foreignKey: 'assignee_id' });
User.hasMany(Task, { foreignKey: 'assignee_id' });

module.exports = Task;
