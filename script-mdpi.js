const request = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs-extra');

(async () => {
    try {
        const url = 'https://www.mdpi.com/';
        const respond = await request(url);
        const $ = cheerio.load(respond);

        const article = [];
        $('.article-content').each((index, element) => {
            const heading = $(element).find('.title-link').text().trim();
            const authors = $(element).find('.authors').text().trim().slice(23);
            const abstract = $(element).find('.abstract-full').text().trim().slice(0, -25);
            const year = $(element).find('.color-grey-dark b').text().trim();
            let [pages, size] = $(element).find('.label span').text().trim().split(',');
            size = size.trim();
            const owner = $(element).find('.belongsTo a').text().trim();
            
            article.push({ heading, authors, abstract, year, pages, size, owner });
        });

        await fs.writeJson('./mdpi.json', article, { spaces: 2 });

    } catch (error) {
        console.error(error);
    }
})();
