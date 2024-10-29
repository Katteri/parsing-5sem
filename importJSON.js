const fs = require('fs-extra');
const path = require('path');
const sequelize = require('./database.js');
const Article = require('./models/Article');

async function parseAndSave(jsonFile, sourceId) {
  const rawData = fs.readFileSync(path.resolve(__dirname, jsonFile));
  const articles = JSON.parse(rawData);

  for (const articleData of articles) {
    const { heading, authors, abstract, date, day, month, year, publisher, pages, size, owner } = articleData;

    let full_date = '';
    if (!date) {
        if (day && month && year) {
            full_date = `${day} ${month} ${year}`;
        } else if (year) {
            full_date = year;
        } else {
            full_date = null;
        }
    } else {
        full_date = date;
    }

    await Article.create({
      sourceId: sourceId,
      heading,
      authors: authors || null,
      publisher: publisher || null,
      abstract: abstract || null,
      date: full_date,
      pages: pages || null,
      size: size || null,
      owner: owner || null,
    });
  }
}

(async () => {
  try {
    await sequelize.sync();

    await parseAndSave('./json/ibima.json', 1);
    await parseAndSave('./json/mdpi.json', 2);
    await parseAndSave('./json/nature.json', 3);
    await parseAndSave('./json/sd.json', 4);
    await parseAndSave('./json/springer.json', 5);

    console.log('Данные успешно сохранены в базу данных!');
  } catch (error) {
    console.error('Ошибка при сохранении данных:', error);
  } finally {
    await sequelize.close();
  }
})();
