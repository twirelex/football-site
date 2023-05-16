const path = require('path');
const fs = require('fs');
const articlesPerPage = 5; // Number of articles per page

module.exports = async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    const articles = JSON.parse(fs.readFileSync(path.join(__dirname, '../articles.json')));
    const page = parseInt(request.query.page) || 1; // Get the current page number from the query parameter

    const startIndex = (page - 1) * articlesPerPage;
    const endIndex = startIndex + articlesPerPage;
    const paginatedArticles = articles.slice(startIndex, endIndex);

    const articlePreviews = paginatedArticles.map((article) => {
      const date = new Date(article.timestamp * 1000);
      const preview = article.content.split(' ').slice(0, 20).join(' ');
      return `
            <div class="article-preview">
                <img class="article-image" src="${article.image}" alt="Article Image">
                <div class="article-content">
                <h2>${article.title}</h2>
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
        <html>
        <head>
            <title>Everything Soccer</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" type="text/css" href="css/style.css">
            <nav>
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/about">About Us</a></li>
                <li><a href="/contact">Contact Us</a></li>
            </ul>
        </nav>
        </head>
        <body>
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
                    <li><a href="/about">About Us</a></li>
                    <li><a href="/contact">Contact Us</a></li>
                </ul>

                <p>&copy; 2023, All Rights Reserved | Everything Soccer</p>
            </footer>
            <script src="/js/main.js"></script>
        </body>
        </html>
    `;

    return reply.type('text/html').send(html);
  });
};
