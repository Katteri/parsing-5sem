const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Source = require('./Source');

const Article = sequelize.define('Article', {
  sourceId: {
    type: DataTypes.INTEGER,
    references: {
      model: Source,
      key: 'id',
    },
    allowNull: false
  },
  heading: {
    type: DataTypes.STRING,
    allowNull: false
  },
  authors: {
    type: DataTypes.STRING,
    allowNull: true
  },
  abstract: {
    type: DataTypes.TEXT, // Введение/Описание
    allowNull: true
  },
  date: {
    type: DataTypes.STRING,
    allowNull: true
  }, 
  publisher: {
    type: DataTypes.STRING, // ibima
    allowNull: true
  },
  pages: {
    type: DataTypes.STRING, // mdpi
    allowNull: true
  },
  size: {
    type: DataTypes.STRING, // mdpi
    allowNull: true
  },
  owner: {
    type: DataTypes.STRING, // mdpi
    allowNull: true
  },
});

Article.belongsTo(Source, { foreignKey: 'sourceId' });

module.exports = Article;
