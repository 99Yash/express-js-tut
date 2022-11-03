const Sequelize = require('sequelize');
const sequelize = require('../util/database');

//Cart is a model that holds the carts of all the users
const Cart = sequelize.define('cart', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
});

module.exports = Cart;
