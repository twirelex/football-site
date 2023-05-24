const { SitemapStream, streamToPromise } = require( 'sitemap' )
const {Readable} = require('stream')
const fs = require('fs')
const path = require('path')

module.exports = async function (fastify, opts) {
    fastify.get('/', async function (request, reply) {
        let links = [];
        let articles = JSON.parse(fs.readFileSync(path.join(__dirname, '../../articles.json')));
        articles = articles.slice().sort((a, b) => b.timestamp - a.timestamp);
        //const links2 = [{ url: '/page-1/',  changefreq: 'daily', priority: 0.3  }]
        for(let i=0; i<articles.length; i++) {
            links.push({"url": articles[i].link, changefreq: "daily"})
        }
        
        const stream = new SitemapStream( { hostname: 'https://rstream.online' } )
        return streamToPromise(Readable.from(links).pipe(stream)).then((data) =>
    data.toString()
  )
    })
  }
  