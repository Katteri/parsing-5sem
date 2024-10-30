import request from 'request-promise';
import * as cheerio from 'cheerio';
import sequelize from '../database.js';
import Article from '../models/Article.js';

function dateToNorm(data) {
  let [day, month, year] = data.split(' ');
  switch(month){
    case 'January':
      month = '01';
      break;
    case 'February':
      month = '02';
      break;
    case 'March':
      month = '03';
      break;
    case 'April':
      month = '04';
      break;
    case 'May':
      month = '05';
      break;
    case 'June':
      month = '06';
      break;
    case 'July':
      month = '07';
      break;
    case 'August':
      month = '08';
      break;
    case 'September':
      month = '09';
      break;
    case 'October':
      month = '10';
      break;
    case 'November':
      month = '11';
      break;
    case 'December':
      month = '12';
      break;
  }
  return `${year}-${month}-${day}`;
}

export default function parseSpringer (pageNumber = 7) {
  return new Promise((resolve) => {
    setTimeout(async () => {
      try {
        const sourceId = 5;    
        await sequelize.sync();
    
        for (let i = 1; i <= pageNumber; i++) {
          const options = {
            method: 'GET',
            url: `https://link.springer.com/journal/42401/articles?filterOpenAccess=false&page=${i}`,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36',
                'Accept-language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
    
            },
            json: true
          };
          const respond = await request(options);
          const $ = cheerio.load(respond);
          
          const article = $('article.app-card-open');
          for (const element of article) {
              const heading = $(element).find('.app-card-open__heading').text().trim();
              const authors = $(element).find('.app-card-open__authors').text().trim();
              let date = $(element).find('.c-meta__item:last-child').text().trim();

              if (date.at(-4) != '2') {
                date = $(element).find('.c-meta__item:nth-child(2)').text().trim();
                if (date.at(-4) != '2') {
                  date = $(element).find('.c-meta__item:nth-child(3)').text().trim();
                }
              }

              date = dateToNorm(date);
              
              await Article.findOrCreate({
                where: { heading }, 
                defaults: { sourceId, heading, authors, date}
              });
          }
    
          console.log(`${i}. Данные успешно добавлены в базу данных`);
        }
    
        console.log('Парсинг Springer завершён, все уникальные статьи добавлены в базу данных.');
        resolve();
      } catch (error) {
        console.error(error);
        resolve();
      }
    }, 1000);
  });
};

parseSpringer(5);