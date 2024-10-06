const request = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs-extra');

setTimeout(async () => {
    try {
        const pageNumber = 57;
        const firstPage = 27;
        const filePath = './sd.json';

        if (!fs.existsSync(filePath)) {
        await fs.writeFile(filePath, '[\n');
        console.log('Создан файл:', filePath);
        }

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

            const articles = [];
            const date = $('.js-issue-status').text().replace('In progress (', '').replace(')', '').trim();
            $('.article-content').each((index, element) => {
                const heading = $(element).find('.article-content-title').text().trim();
                const authors = $(element).find('.js-article__item__authors').text().trim().replace('... ', '');
                
                articles.push({ heading, authors, date });
            });

            for (let j = 0; j < articles.length; j++) {
                const article = JSON.stringify(articles[j], null, 2);

                const isFirstEntry = i === firstPage && j === 0;
                const comma = isFirstEntry ? '' : ',\n';

                await fs.appendFile(filePath, `${comma}${article}`);
            }

            if (i % 10 === 0) {
                console.log(`${i}. Данные успешно добавлены в файл: ${filePath}`);
            }
        }

        await fs.appendFile(filePath, '\n]');
        console.log('Файл успешно завершён.');
    } catch (error) {
        console.error(error);
    }
}, 3000);