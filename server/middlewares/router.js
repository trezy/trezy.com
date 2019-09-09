/* eslint-env node */
/* eslint-disable strict, global-require */

// Module imports
const cheerio = require('cheerio')
const moment = require('moment')
const router = require('koa-router')()
const send = require('koa-send')





// Local constants
const { PUBLIC_URL } = process.env
const permanentRedirect = path => async ctx => {
  ctx.status = 301
  await ctx.redirect(path)
}
const sendFile = path => async ctx => {
  await send(ctx, path)
}
const sitemapDoc = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  </urlset>`





module.exports = (nextApp, koaServer) => {
  /***************************************************************************\
    File Mappings
  \***************************************************************************/

  // Root dir static file mappings
  router.get('/browserconfig.xml', sendFile('/client/static/browserconfig.xml'))
  router.get('/manifest.json', sendFile('/client/static/manifest.json'))
  router.get('/favicon.ico', sendFile('/client/static/favicon/favicon.ico'))





  /***************************************************************************\
    Redirects
  \***************************************************************************/

  // Permanent Redirects

  router.get('/blogs', permanentRedirect('/blog'))





  /***************************************************************************\
    Next-Routes passthrough
  \***************************************************************************/

  const nextRoutesHandler = nextApp.getRequestHandler()
  router.get('*', async ctx => {
    ctx.respond = false
    await nextRoutesHandler(ctx.req, ctx.res)
  })





  /***************************************************************************\
    Configure server and attach router.
  \***************************************************************************/

  koaServer.use(async (ctx, next) => {
    ctx.res.statusCode = 200
    await next()
  })
  koaServer.use(router.routes())
  koaServer.use(router.allowedMethods())
}
/* eslint-enable */
