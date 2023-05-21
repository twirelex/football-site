'use strict'
const fs = require('fs')
const path = require('path')

// Read the .env file.
require('dotenv').config()

// Require the framework
const Fastify = require('fastify')

// Require library to exit fastify process, gracefully (if possible)
const closeWithGrace = require('close-with-grace')

// Instantiate Fastify with some config
const app = Fastify({
  logger: true,
  http2: true,
  https: {
    allowHTTP1: true,
    key : fs.readFileSync('./private.key'),
    cert: fs.readFileSync('./certificate.crt'),
    ca: fs.readFileSync('./ca_bundle.crt')
  }
})

// Register your application as a normal plugin.
const appService = require('./app.js')
app.register(appService)
app.register(require('fastify-https-redirect'), {httpPort:80, httpsPort:443})

// delay is the number of milliseconds for the graceful close to finish
const closeListeners = closeWithGrace({ delay: process.env.FASTIFY_CLOSE_GRACE_DELAY || 500 }, async function ({ signal, err, manual }) {
  if (err) {
    app.log.error(err)
  }
  await app.close()
})

app.addHook('onClose', (instance, done) => {
  closeListeners.uninstall()
  done()
})

// Start listening.
// app.listen({ port: process.env.PORT || 3000 }, (err) => {
//   if (err) {
//     app.log.error(err)
//     process.exit(1)
//   }
// })
try{
app.listen(443,'0.0.0.0')
}catch (err) {
    app.log.error(err)
    process.exit(1)
}