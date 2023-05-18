const path = require('path');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
let cachedArticles = null;
const articlesPerPage = 10; // Number of articles per page

module.exports = async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    if (!cachedArticles) {
      const articlesData = await readFile(path.join(__dirname, '../articles.json'));
      cachedArticles = JSON.parse(articlesData);
    }

    const articles = cachedArticles.slice().sort((a, b) => b.timestamp - a.timestamp);
    const page = parseInt(request.query.page) || 1; // Get the current page number from the query parameter

    const startIndex = (page - 1) * articlesPerPage;
    const endIndex = startIndex + articlesPerPage;
    const paginatedArticles = articles.slice(startIndex, endIndex);

    const articlePreviews = paginatedArticles.map((article) => {
      const date = new Date(article.timestamp * 1000);
      const preview = article.content.split(' ').slice(0, 20).join(' ');
      return `
            <div class="article-preview">
                <img class="article-image" src="${article.image}" alt="${article.image.split('/')[2].split('\.')[0].replaceAll('_',' ')}">
                <div class="article-content">
                    <h2><a class="article-title" href="${article.link}">${article.title}</a></h2>
                    <p>${preview}...</p>
                    <a href="${article.link}">Read more</a> <b> Published</b>: 
                    ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}
                </div>
            </div>
        `;
    });

    const totalPages = Math.ceil(articles.length / articlesPerPage);
    const prevPage = page > 1 ? page - 1 : null;
    const nextPage = page < totalPages ? page + 1 : null;

    const paginationLinks = [];
    if (prevPage) {
      paginationLinks.push(`<a href="/?page=${prevPage}">Previous</a>`);
    }
    if (nextPage) {
      paginationLinks.push(`<a href="/?page=${nextPage}">Next</a>`);
    }

    const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <title>Everything Soccer</title>

            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta charset="UTF-8">
            <meta name="description" content="Stay updated with the latest soccer news, match highlights, player interviews, and more. Everything Soccer brings you comprehensive coverage of the world of soccer.">
            <link rel="stylesheet" type="text/css" href="css/style.css">
            <link rel="icon" type="image/jpg" href="/images/logo.jpg">
            

           
        </head>
        <body>
        <nav>
        <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/contact">Contact Us</a></li>
        </ul>
    </nav>
            <header>
            <h1><a href="/">Everything Soccer</a></h1>
            </header>
            <div id="article-previews">
                <div class="article-column">
                    <div class="recent-posts">Recent Posts</div>
                    ${articlePreviews.join('')}
                </div>
            </div>
            <div class="pagination">
                ${paginationLinks.join('')}
            </div>
            <footer>
                <ul>
                <li><a href="/privacy-policy">Privacy Policy</a></li>
                    <li><a href="/about">About Us</a></li>
                    <li><a href="/contact">Contact Us</a></li>
                </ul>

                <p>&copy; 2023, All Rights Reserved | Everything Soccer</p>
            </footer>
        </body>
        </html>
    `;

    return reply.type('text/html').send(html);
  });
};
