const request = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs-extra');

(async () => {
    try {
        const url = 'https://www.nature.com/';
        const respond = await request(url);
        const $ = cheerio.load(respond);

        const article = [];
        $('.app-article-list-row__item').each((index, element) => {
            const heading = $(element).find('.c-card__title').text().trim();
            const authors = $(element).find('.c-author-list').text().trim();
            const description = $(element).find('[data-test="article-description"]').text().trim();
            const date = $(element).find('time').text().trim();            
            
            article.push({ heading, authors, description, date });
        });

        await fs.writeJson('./nature.json', article, { spaces: 2 });

    } catch (error) {
        console.error(error);
    }
})();