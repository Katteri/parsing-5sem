const request = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs-extra');

setTimeout(async () => {
    try {
      const pageNumber = 450;
      const filePath = './nature.json';
  
      if (!fs.existsSync(filePath)) {
        await fs.writeFile(filePath, '[\n');
        console.log('Создан файл:', filePath);
      }
  
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

        const articles = [];
        $('.app-article-list-row__item').each((index, element) => {
            const heading = $(element).find('.c-card__title').text().trim();
            const authors = $(element).find('.c-author-list').text().trim();
            const description = $(element).find('[data-test="article-description"]').text().trim();
            const date = $(element).find('time').text().trim();            
            
            articles.push({ heading, authors, description, date });
        });
  
        for (let j = 0; j < articles.length; j++) {
          const article = JSON.stringify(articles[j], null, 2);
  
          const isFirstEntry = i === 1 && j === 0;
          const comma = isFirstEntry ? '' : ',\n';
  
          await fs.appendFile(filePath, `${comma}${article}`);
        }
  
        if (i % 100 === 0) {
            console.log(`${i}. Данные успешно добавлены в файл: ${filePath}`);
        }
      }
  
      await fs.appendFile(filePath, '\n]');
      console.log('Файл успешно завершён.');


    } catch (error) {
      console.error(error);
    }
  }, 1000);