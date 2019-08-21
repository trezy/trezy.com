/* eslint-env node */
/* eslint-disable strict, global-require */

// Module imports
const router = require('koa-router')()
const send = require('koa-send')





// Local imports
const routes = require('../../client/routes')





// Local constants
const permanentRedirect = path => async ctx => {
  ctx.status = 301
  await ctx.redirect(path)
}
const sendFile = path => async ctx => {
  await send(ctx, path)
}





module.exports = (nextApp, koaServer) => {
  /***************************************************************************\
    File Mappings
  \***************************************************************************/

  // Root dir static file mappings
  router.get('/browserconfig.xml', sendFile('/client/static/browserconfig.xml'))
  router.get('/sitemap.xml', sendFile('/client/static/sitemap.xml'))
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

  const nextRoutesHandler = routes.getRequestHandler(nextApp)
  router.get(/^\/(?!robots\.txt).*/gui, async (ctx) => {
    ctx.respond = false
    await nextRoutesHandler(ctx.req, ctx.res)
  })





  /***************************************************************************\
    robots.txt
  \***************************************************************************/

  router.get('/robots.txt', ctx => {
    const robotsTxt = new Set

    robotsTxt.add('User-agent: *')
    robotsTxt.add('Disallow: /')
    robotsTxt.add('Allow: /static')

    routes.routes.forEach(({ hidden, pattern }) => {
      if (!hidden) {
        const parsedPattern = pattern.replace(/:\w*/gui, '').replace(/\/+/gui, '/').replace(/\/$/u, '')

        robotsTxt.add(`Allow: ${parsedPattern}`)
      }
    })

    ctx.response.body = Array.from(robotsTxt).join('\n')
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
