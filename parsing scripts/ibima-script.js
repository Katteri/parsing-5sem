const request = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs-extra');

setTimeout(async () => {
    try {
      const pageNumber = 276;
      const filePath = './ibima.json';
  
      if (!fs.existsSync(filePath)) {
        await fs.writeFile(filePath, '[\n');
        console.log('Создан файл:', filePath);
      }
  
      for (let i = 1; i <= pageNumber; i++) {
        const options = {
          method: 'GET',
          url: `https://ibimapublishing.com/articles/page/${i}/`,
          headers: {
              'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36',
              'Accept-language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
  
          },
          json: true
        };
        const respond = await request(options);
        const $ = cheerio.load(respond);
  
        const articles = [];
        $('.post-item').each((index, element) => {
            const heading = $(element).find('.post-title').text().trim();
            const publisher = $(element).find('.parent-post-title').text().trim();
            const abstract = $(element).find('.custom-abstract-class').text().trim();
            const day = $(element).find('.blog-date-value').text().trim();
            const month = $(element).find('.blog-month-value').text().trim();
            const year = $(element).find('.blog-year-value').text().trim();
            
            articles.push({ heading, publisher, abstract, day, month, year });
        });
  
        for (let j = 0; j < articles.length; j++) {
          const article = JSON.stringify(articles[j], null, 2);
  
          const isFirstEntry = i === 1 && j === 0;
          const comma = isFirstEntry ? '' : ',\n';
  
          await fs.appendFile(filePath, `${comma}${article}`);
        }
  
        if (i % 50 === 0) {
            console.log(`${i}. Данные успешно добавлены в файл: ${filePath}`);
        }
      }
  
      await fs.appendFile(filePath, '\n]');
      console.log('Файл успешно завершён.');
    } catch (error) {
      console.error(error);
    }
  }, 1000);