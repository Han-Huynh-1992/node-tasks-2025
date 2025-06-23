const { DataTypes } = require('sequelize');
const sequelize = require('../../config/mysqlDBConnection');
const User = require('./userModel');

const Project = sequelize.define('project', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING },
    description: { type: DataTypes.STRING },
    created_date: { type: DataTypes.DATE }
}, {
    tableName: 'project',
    freezeTableName: true,
    timestamps: false
});

// Owner relationship
Project.belongsTo(User, { foreignKey: 'owner_id' });
User.hasMany(Project, { foreignKey: 'owner_id' });

module.exports = Project;
