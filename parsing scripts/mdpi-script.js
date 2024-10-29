import request from 'request-promise';
import * as cheerio from 'cheerio';
import sequelize from '../database.js';
import Article from '../models/Article.js';

export default function parseMdpi (pageNumber = 10) {
  return new Promise((resolve) => {
    setTimeout(async () => {
      try {
        const sourceId = 2;    
        await sequelize.sync();

        for (let i = 1; i <= pageNumber; i++) {
          const options = {
            method: 'GET',
            url: `https://www.mdpi.com/search?sort=pubdate&page_no=${i}&page_count=50&year_from=1996&year_to=2024&view=default`,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36',
                'Accept-language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',

            },
            json: true
          };
          const respond = await request(options);
          const $ = cheerio.load(respond);

          const article = $('.article-content');
          for (const element of article) {
            const heading = $(element).find('.title-link').text().trim();
            const authors = $(element).find('.authors').text().slice(23).trim();
            const abstract = $(element).find('.abstract-full').text().trim().slice(0, -25);
            let date = $(element).find('.color-grey-dark b').text().trim();
            date = `${date}-01-01`;
            let [pages, size] = $(element).find('.label span').text().trim().split(',');
            size = size.trim();
            const owner = $(element).find('.belongsTo a').text().trim();

            await Article.findOrCreate({
              where: { heading }, 
              defaults: { sourceId, heading, authors, abstract, date, pages, size, owner}
            });
          }

          if (i % 100 === 0) {
            console.log(`${i}. Данные успешно добавлены в базу данных`);
          }
        }

        console.log('Парсинг mdpi завершён, все уникальные статьи добавлены в базу данных.');
        resolve();
      } catch (error) {
        console.error('Ошибка при парсинге данных', error);
        resolve();
      }
    }, 1000);
  });
};

parseMdpi();
