const sequelize = require('./database');
const Article = require('./models/Article');

(async () => {
  try {
    await sequelize.sync({ force: true }); // Создание таблиц с нуля
    console.log('База данных и таблицы созданы!');
  } catch (error) {
    console.error('Ошибка при создании базы данных:', error);
  } finally {
    await sequelize.close();
  }
})();
