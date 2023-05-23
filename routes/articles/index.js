'use strict';
const fs = require('fs');
const path = require('path');

module.exports = async function (fastify, opts) {
    fastify.get('/:id', (request, reply) => {
        const { id } = request.params;
        const articles = JSON.parse(fs.readFileSync(path.join(__dirname, '../../articles.json')));
        const article = articles.find((article) => article.link === `/articles/${id}`);
        const date = new Date(article.timestamp * 1000);

        if (!article) {
            return reply.status(404).send('Article not found');
        }

        const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <title>${article.title}</title>

                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="stylesheet" type="text/css" href="/css/style.css">
                <link rel="icon" type="image/jpg" href="/images/logo.jpg">
                <style>
                    .article-container {
                        display: flex;
                        flex-direction: column;
                        
                        text-align: center;
                    }
                    .article-image {
                        width: 50%; /* Set the desired width for the image */
                        height: auto;
                        margin: 0 auto; /* Add 'margin: 0 auto' to center the image horizontally */
                        display: block; /* Add 'display: block' to remove any additional space below the image */
                        margin-bottom: 5px; /* Add margin-bottom for spacing */
                    }
                    

                    @media screen and (max-width: 768px) {
                        /* For screens smaller than 768px (mobile devices) */
                        .article-image {
                            width: 70%; /* Set the width to 70% for mobile */
                        }
                    }
                    .article-title {
                        font-size: 28px !Important;
                        font-weight: bold;
                        margin: 20px 0;
                        color: #333;
                    }

                    .article-contents {
                        font-size: 18px !important;
                        max-width: 600px;
                        margin: 0 auto;
                        line-height: 1.6;
                        font-family: Arial, sans-serif;
                        color: #333;
                    }
                
                    .article-contents p {
                        margin-bottom: 20px;
                    }
                
                    .article-contents h2 {
                        font-size: 24px;
                        font-weight: bold;
                        margin: 30px 0 10px;
                    }
                
                    .article-container b {
                        display: block;
                        margin-top: 20px;
                        font-weight: bold;
                        color: #777;
                        font-size: 16px;
                    }
                </style>
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
                <h1><a href="/">Everthing Soccer</a></h1>
                </header>
                <div class="article-container">
                <h1 class="article-title">${article.title}</h1>
                    <img class="article-image" src="../${article.image}" alt="${article.image.split('/')[2].split('\.')[0].replace('_',' ')}">
                    <div class="article-contents">${article.content}</div> 
                    <b> Published: ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}</b>
                </div>
                <footer>
                    <ul>
                    <li><a href="/privacy-policy">Privacy Policy</a></li>
                    <li><a href="/about">About Us</a></li>
                    <li><a href="/contact">Contact Us</a></li>
                    <li><a href="/disclaimer">Disclaimer</a></li>
                    <li><a href="/dcma-takedown">Dcma</a></li>
                    </ul>
                    <p>&copy; ${new Date().getFullYear()}, All Rights Reserved | Everything Soccer</p>
                </footer>
                <script src="/js/main.js"></script>
            </body>
            </html>
        `;

        return reply.type('text/html').send(html);
    });
}
