const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'articles.db',
  logging: false,
});

module.exports = sequelize;
