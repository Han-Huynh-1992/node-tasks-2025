let config = require('./mysqlDBConfig.json');
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('test', config.userName, config.password, {
    host: process.env.MYSQL_HOST || 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;
