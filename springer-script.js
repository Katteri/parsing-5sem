const request = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs-extra');

setTimeout(async () => {
    try {
      const pageNumber = 7;
      const filePath = './springer.json';
  
      if (!fs.existsSync(filePath)) {
        await fs.writeFile(filePath, '[\n');
        console.log('Создан файл:', filePath);
      }
  
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
  
        const articles = [];
        $('article.app-card-open').each((index, element) => {
            const heading = $(element).find('.app-card-open__heading').text().trim();
            const authors = $(element).find('.app-card-open__authors').text().trim();
            let date = $(element).find('.c-meta__item:last-child').text().trim();
            date = (date.at(-4) === '2')? date : $(element).find('.c-meta__item:nth-child(2)').text().trim();
            
            articles.push({ heading, authors, date });
        });
  
        for (let j = 0; j < articles.length; j++) {
          const article = JSON.stringify(articles[j], null, 2);
  
          const isFirstEntry = i === 1 && j === 0;
          const comma = isFirstEntry ? '' : ',\n';
  
          await fs.appendFile(filePath, `${comma}${article}`);
        }
  
        console.log(`${i}. Данные успешно добавлены в файл: ${filePath}`);
      }
  
      await fs.appendFile(filePath, '\n]');
      console.log('Файл успешно завершён.');
    } catch (error) {
      console.error(error);
    }
  }, 1000);