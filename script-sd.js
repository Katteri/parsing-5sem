const request = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs-extra');

(async () => {
    try {
        const options = {
            method: 'GET',
            url: 'https://www.sciencedirect.com/journal/data-in-brief',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36',
                'Accept-language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',

            },
            json: true
        };
        const respond = await request(options);
        const $ = cheerio.load(respond);

        const article = [];
        $('.article-list-item').each((index, element) => {
            const heading = $(element).find('.anchor-text').text().trim();
            const authors = $(element).find('.js-article__item__authors').text().trim().replace('... ', '');
            const date = $(element).find('.js-article-item-date').text().trim();
            article.push({ heading, authors, date });
        });

        await fs.writeJson('./sd.json', article, { spaces: 2 });

    } catch (error) {
        console.error(error);
    }
})();

