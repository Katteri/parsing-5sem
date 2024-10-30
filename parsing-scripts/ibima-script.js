import request from 'request-promise';
import * as cheerio from 'cheerio';
import sequelize from '../database.js';
import Article from '../models/Article.js';

function monthToNorm(data) {
  switch(data){
    case 'Jan':
      return '01';
    case 'Feb':
      return '02';
    case 'Mar':
      return '03';
    case 'Apr':
      return '04';
    case 'May':
      return '05';
    case 'Jun':
      return '06';
    case 'Jul':
      return '07';
    case 'Aug':
      return '08';
    case 'Sep':
      return '09';
    case 'Oct':
      return '10';
    case 'Nov':
      return '11';
    case 'Dec':
      return '12';
  }
}

export default function parseIbima (pageNumber = 5) {
  return new Promise((resolve) => {
    setTimeout(async () => {
      try {
        const sourceId = 1;
        await sequelize.sync();

        for (let i = 1; i <= pageNumber; i++) {
          const options = {
            method: 'GET',
            url: `https://ibimapublishing.com/articles/page/${i}/`,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36',
              'Accept-language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
            },
            json: true,
          };
          
          const respond = await request(options);
          const $ = cheerio.load(respond);

          const article = $('.post-item');
          for (const element of article) {
            const heading = $(element).find('.post-title').text().trim();
            const publisher = $(element).find('.parent-post-title').text().trim();
            const abstract = $(element).find('.custom-abstract-class').text().trim();
            const day = $(element).find('.blog-date-value').text().trim();
            const month = $(element).find('.blog-month-value').text().trim();
            const year = $(element).find('.blog-year-value').text().trim();
            
            const date = `${year}-${monthToNorm(month)}-${day}`;

            // Используем findOrCreate, чтобы избежать дублирования
            await Article.findOrCreate({
              where: { heading }, // Проверка по заголовку
              defaults: { sourceId, heading, publisher, abstract, date } // Данные для вставки, если запись не найдена
            });
          }

          if (i % 100 === 0) {
            console.log(`${i}. Данные успешно добавлены в базу данных`);
          }
        }

        console.log('Парсинг ibima завершён, все уникальные статьи добавлены в базу данных.');
        resolve();
      } catch (error) {
        console.error('Ошибка при парсинге данных', error);
        resolve();
      }
    }, 1000);
  });
};

parseIbima();