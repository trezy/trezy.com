// Module imports
const router = require('koa-router')()
const send = require('koa-send')





// Component imports
const routes = require('../../client/routes')





const permanentRedirect = (path) => async (ctx) => {
  ctx.status = 301
  await ctx.redirect(path)
}

const sendFile = (path) => async (ctx) => {
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
  router.get('*', async (ctx) => {
    await nextRoutesHandler(ctx.req, ctx.res)
    ctx.respond = false
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
