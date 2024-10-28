const sequelize = require('./database');
const Source = require('./models/Source');
const Article = require('./models/Article');


async function createSources() {
  const sources = [
    { name: 'IbimaPublishing', url: 'https://ibimapublishing.com/articles/'},
    { name: 'MDPI', url: 'https://www.mdpi.com/search?sort=pubdate' },
    { name: 'Nature', url: 'https://www.nature.com/nature/research-articles?searchType=journalSearch&sort=PubDate' },
    { name: 'ScienceDirect', url: 'https://www.sciencedirect.com/journal/data-in-brief/issues' },
    { name: 'Spinger', url: 'https://link.springer.com/journal/42401/articles?filterOpenAccess=false' }
  ];

  for (const sourceData of sources) {
    await Source.create(sourceData);
  }
}

(async () => {
  try {
    await sequelize.sync({ force: true });

    await createSources();

    console.log('База данных и таблицы созданы!');
  } catch (error) {
    console.error('Ошибка при создании базы данных:', error);
  } finally {
    await sequelize.close();
  }
})();
