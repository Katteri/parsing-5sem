const request = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs-extra');

(async () => {
    try {
        const url = 'https://www.intechopen.com/books/1003597';
        const respond = await request(url);
        const $ = cheerio.load(respond);

        const article = [];
        $('.chapter').each((index, element) => {
            const heading = $(element).find('.chapter__title').text().trim().slice(3);
            const authors = $(element).find('.chapter__contributors').text().trim().slice(3).replace(' and', ',');
            const downloads = $(element).find('.download-stat-container').text().trim();
            
            article.push({ heading, authors, downloads });
        });

        await fs.writeJson('./intechopen.json', article, { spaces: 2 });

    } catch (error) {
        console.error(error);
    }
})();