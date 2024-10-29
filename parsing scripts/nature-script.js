import request from 'request-promise';
import * as cheerio from 'cheerio';
import sequelize from '../database.js';
import Article from '../models/Article.js';

function dateToNorm(data) {
  let [day, month, year] = data.split(' ');
  switch(month){
    case 'Jan':
      month = '01';
      break;
    case 'Feb':
      month = '02';
      break;
    case 'Mar':
      month = '03';
      break;
    case 'Apr':
      month = '04';
      break;
    case 'May':
      month = '05';
      break;
    case 'Jun':
      month = '06';
      break;
    case 'Jul':
      month = '07';
      break;
    case 'Aug':
      month = '08';
      break;
    case 'Sept':
      month = '09';
      break;
    case 'Oct':
      month = '10';
      break;
    case 'Nov':
      month = '11';
      break;
    case 'Dec':
      month = '12';
      break;
  }
  return `${year}-${month}-${day}`;
}

export default function parseNature (pageNumber = 10) {
  return new Promise((resolve) => {
    setTimeout(async () => {
      try {
        const sourceId = 3;    
        await sequelize.sync();
    
        for (let i = 1; i <= pageNumber; i++) {
          const options = {
            method: 'GET',
            url: `https://www.nature.com/nature/research-articles?searchType=journalSearch&sort=PubDate&page=${i}`,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
            },
            json: true
          };
          const respond = await request(options);
          const $ = cheerio.load(respond);

          const article = $('.app-article-list-row__item');
          for (const element of article) {
              const heading = $(element).find('.c-card__title').text().trim();
              const authors = $(element).find('.c-author-list').text().trim();
              const abstract = $(element).find('[data-test="article-description"]').text().trim();
              let date = $(element).find('time').text().trim();
              date = dateToNorm(date);     

              await Article.findOrCreate({
                where: { heading }, 
                defaults: { sourceId, heading, authors, abstract, date}
              });
          }
    
          if (i % 100 === 0) {
            console.log(`${i}. Данные успешно добавлены в базу данных`);
          }
        }
    
        console.log('Парсинг nature завершён, все уникальные статьи добавлены в базу данных.');
        resolve();
      } catch (error) {
        console.error(error);
        resolve();
      }
    }, 1000);
  });
};

parseNature();