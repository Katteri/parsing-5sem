const fs = require('fs');
const path = require('path');
const sequelize = require('./database');
const Article = require('./models/Article');

async function parseAndSave(jsonFile, source) {
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

    await parseAndSave('./json/ibima.json', 'ibima');
    await parseAndSave('./json/mdpi.json', 'mdpi');
    await parseAndSave('./json/nature.json', 'nature');
    await parseAndSave('./json/sd.json', 'sd');
    await parseAndSave('./json/springer.json', 'springer');

    console.log('Данные успешно сохранены в базу данных!');
  } catch (error) {
    console.error('Ошибка при сохранении данных:', error);
  } finally {
    await sequelize.close();
  }
})();
