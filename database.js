import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  retry: {
    max: 5
  },
  transactionType: 'IMMEDIATE',
  logging: false,
});

export default sequelize;