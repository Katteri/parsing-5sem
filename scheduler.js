import cron from 'node-cron';
import TaskStatus from './models/TaskStatus.js';
import runTask from './index.js';

const tasks = [
  { name: 'IbimaPublishing', schedule: '0 6 * * 1', sourceId: 1 },     // каждый понедельник в 6:00
  { name: 'MDPI', schedule: '0 18 * * *', sourceId: 2 },   // ежедневно в 6 вечера
  { name: 'Nature', schedule: '0 12 * * 2', sourceId: 3 },     // каждый вторник в 12:00
  { name: 'ScienceDirect', schedule: '0 0 1 * *', sourceId: 4 },   // первого числа каждого месяца в 00:00
  { name: 'Springer', schedule: '0 0 1 * *', sourceId: 5 },   // первого числа каждого месяца в 00:00
];

tasks.forEach(({ name, schedule, sourceId }) => {
  cron.schedule(schedule, async () => {
    console.log(`Начало выполнения задачи ${name}: ${new Date().toISOString()}`);
    const taskStatus = await TaskStatus.findOne({ where: { sourceId, taskName: name } });

    if (taskStatus && taskStatus.status === 'Running') {
      console.log(`Задача ${name} уже выполняется. Пропуск запуска.`);
      return;
    }

    if (!taskStatus) {
      await TaskStatus.create({ sourceId, taskName: name, status: 'Running', lastRun: new Date() });
    } else {
      await TaskStatus.update({ status: 'Running', lastRun: new Date() }, { where: { sourceId, taskName: name } });
    }    

    try {
      await runTask(name);

      await TaskStatus.update(
        { status: 'Success', errorMessage: null },
        { where: { sourceId, taskName: name } }
      );
      console.log(`Задача ${name} выполнена успешно`);
    } catch (error) {
      await TaskStatus.update(
        { status: 'Failed', errorMessage: error.message },
        { where: { sourceId, taskName: name } }
      );
      console.error(`Ошибка при выполнении задачи ${name}:`, error);
    }
  });
});
