/* eslint-env node */
/* eslint-disable strict, global-require */

// Module imports
const cheerio = require('cheerio')
const moment = require('moment')
const router = require('koa-router')()
const send = require('koa-send')





// Local imports
const routes = require('../../client/routes')





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
    robots.txt
  \***************************************************************************/

  router.get('/robots.txt', ctx => {
    const robotsTxt = new Set
    const routePatternCache = []

    robotsTxt.add('User-agent: *')
    robotsTxt.add('Disallow: /')
    robotsTxt.add('Allow: /_next')

    routes.routes.forEach(({ hidden, pattern }) => {
      let parsedPattern = pattern.replace(/:\w*/gui, '').replace(/\/+/gui, '/').replace(/\/$/u, '')

      if (!hidden && !routePatternCache.includes(parsedPattern)) {
        try {
          parsedPattern = route.toPath()
        } catch (error) {}

        robotsTxt.add(`Allow: ${parsedPattern}`)

        routePatternCache.push(parsedPattern)
      }
    })

    ctx.response.body = Array.from(robotsTxt).join('\n')
  })

  router.get('/sitemap.xml', ctx => {
    ctx.response.body = `<?xml version="1.0" encoding="UTF-8"?>
      <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <sitemap>
          <loc>${PUBLIC_URL}/sitemap-pages.xml</loc>
          <lastmod>${moment().toISOString()}</lastmod>
        </sitemap>

        <sitemap>
          <loc>${PUBLIC_URL}/sitemap-articles.xml</loc>
          <lastmod>${moment().toISOString()}</lastmod>
        </sitemap>
      </sitemapindex>
    `
    ctx.type = 'application/xml; charset=utf-8'
  })

  router.get('/sitemap-articles.xml', async ctx => {
    const sitemap = cheerio.load(sitemapDoc, { xml: { xmlMode: true } })
    const firebaseApp = require('../helpers/firebase')()
    const snapshot = await firebaseApp.database().ref('/articles').once('value')

    Object.values(snapshot.val()).forEach(article => {
      const {
        id,
        updatedAt,
      } = article

      sitemap('urlset').append(`
        <url>
          <loc>${PUBLIC_URL}/articles/${id}</loc>
          <lastmod>${moment(updatedAt)}</lastmod>
          <changefreq>monthly</changefreq>
          <priority>1</priority>
        </url>
      `)
    })

    ctx.response.body = sitemap.xml()
    ctx.type = 'application/xml; charset=utf-8'
  })

  router.get('/sitemap-pages.xml', ctx => {
    const sitemap = cheerio.load(sitemapDoc, { xml: { xmlMode: true } })
    const routePatternCache = []

    routes.routes.forEach(route => {
      const {
        changeFrequency,
        hidden,
        pattern,
        priority,
      } = route
      let parsedPattern = pattern.replace(/:\w*/gui, '').replace(/\/+/gui, '/').replace(/\/$/u, '')

      if (!hidden && !routePatternCache.includes(parsedPattern)) {
        try {
          parsedPattern = route.toPath()
        } catch (error) {}

        sitemap('urlset').append(`
          <url>
            <loc>${PUBLIC_URL}${parsedPattern}</loc>
            <lastmod>${moment().toISOString()}</lastmod>
            <changefreq>${changeFrequency}</changefreq>
            <priority>${priority}</priority>
          </url>
        `)

        routePatternCache.push(parsedPattern)
      }
    })

    ctx.response.body = sitemap.xml()
    ctx.type = 'application/xml; charset=utf-8'
  })





  /***************************************************************************\
    Next-Routes passthrough
  \***************************************************************************/

  const nextRoutesHandler = routes.getRequestHandler(nextApp)
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
