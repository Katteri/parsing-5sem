import request from 'request-promise';
import * as cheerio from 'cheerio';
import sequelize from '../database.js';
import Article from '../models/Article.js';

function dateToNorm(data) {
    let [month, year] = data.split(' ');
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
    return `${year}-${month}-01`;
}

export default function parseSD (pageNumber = 58, firstPage = 57) { // firstPage = 27
    return new Promise((resolve) => {
      setTimeout(async () => {
        try {
            const sourceId = 4;    
            await sequelize.sync();

            for (let i = firstPage; i <= pageNumber; i++) {
                const options = {
                    method: 'GET',
                    url: `https://www.sciencedirect.com/journal/data-in-brief/vol/${i}/suppl/C`,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36',
                        'Accept-language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',

                    },
                    json: true
                };
                const respond = await request(options);
                const $ = cheerio.load(respond);
                
                let date = $('.js-issue-status').text().replace('In progress (', '').replace(')', '').trim();
                date = dateToNorm(date);

                const article = $('.article-content');
                for (const element of article) {
                    const heading = $(element).find('.article-content-title').text().trim();
                    const authors = $(element).find('.js-article__item__authors').text().trim().replace('... ', '');
                    
                    await Article.findOrCreate({
                        where: { heading }, 
                        defaults: { sourceId, heading, authors, date }
                    });
                }

                if (i % 10 === 0) {
                    console.log(`${i}. Данные успешно добавлены в базу данных`);
                }
            }
            console.log('Парсинг ScienceDirect завершён, все уникальные статьи добавлены в базу данных.');
            resolve();
        } catch (error) {
            console.error(error);
            resolve();
        }
    }, 3000);
});
};

parseSD();