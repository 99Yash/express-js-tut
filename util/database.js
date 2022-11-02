const Sequelize = require('sequelize');

const sequelize = new Sequelize('express-tut', 'root', 'txjcv8805', {
  dialect: 'mysql',
  host: 'localhost',
});

module.exports = sequelize;
