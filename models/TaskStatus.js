import { DataTypes } from 'sequelize';
import sequelize from '../database.js';
import Source from './Source.js';

const TaskStatus = sequelize.define('TaskStatus', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  sourceId: {
    type: DataTypes.INTEGER,
    references: {
      model: Source,
      key: 'id',
    },
    allowNull: false,
  },
  taskName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Running', 'Success', 'Failed'),
    allowNull: false,
  },
  lastRun: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  errorMessage: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

Source.hasMany(TaskStatus, { foreignKey: 'sourceId' });
TaskStatus.belongsTo(Source, { foreignKey: 'sourceId' });

export default TaskStatus;
