import sequelize from './database.js';
import Source from './models/Source.js';
import Article from './models/Article.js';

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

export default (async () => {
  try {
    await sequelize.sync({ force: true });

    await createSources();

    console.log('База данных и таблицы успешно созданы!');
  } catch (error) {
    console.error('Ошибка при создании базы данных:', error);
  }
})();
