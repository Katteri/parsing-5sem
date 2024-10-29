import { DataTypes } from 'sequelize';
import sequelize from '../database.js';

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

export default Source;