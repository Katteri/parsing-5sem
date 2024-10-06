const request = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs-extra');

setTimeout(async () => {
  try {
    const pageNumber = 500;
    const filePath = './mdpi.json';

    if (!fs.existsSync(filePath)) {
      await fs.writeFile(filePath, '[\n');
      console.log('Создан файл:', filePath);
    }

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

      const articles = [];
      $('.article-content').each((index, element) => {
        const heading = $(element).find('.title-link').text().trim();
        const authors = $(element).find('.authors').text().slice(23).trim();
        const abstract = $(element).find('.abstract-full').text().trim().slice(0, -25);
        const year = $(element).find('.color-grey-dark b').text().trim();
        let [pages, size] = $(element).find('.label span').text().trim().split(',');
        size = size.trim();
        const owner = $(element).find('.belongsTo a').text().trim();

        articles.push({ heading, authors, abstract, year, pages, size, owner });
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