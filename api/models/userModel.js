const { DataTypes } = require('sequelize');
const sequelize = require('../../config/mysqlDBConnection');

const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false }
}, {
    tableName: 'user',
    freezeTableName: true,
    timestamps: false
});

module.exports = User;