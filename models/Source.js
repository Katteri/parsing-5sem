const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Source = sequelize.define('Source', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isUrl: true,
    }
  }
}, {
  timestamps: false
});

module.exports = Source;