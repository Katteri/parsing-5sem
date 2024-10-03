const request = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs-extra');

(async () => {
    try {
        const url = 'https://link.springer.com/journal/42401/articles';
        const respond = await request(url);
        const $ = cheerio.load(respond);

        const article = [];
        $('article.app-card-open').each((index, element) => {
            const heading = $(element).find('.app-card-open__heading').text().trim();
            const authors = $(element).find('.app-card-open__authors').text().trim();
            let date = $(element).find('.c-meta__item:last-child').text().trim();
            date = (date.at(-4) === '2')? date : $(element).find('.c-meta__item:nth-child(2)').text().trim();
            
            article.push({ heading, authors, date });
        });

        await fs.writeJson('./spinger.json', article, { spaces: 2 });

    } catch (error) {
        console.error(error);
    }
})();