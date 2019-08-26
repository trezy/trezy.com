/* eslint-env node */

// Module imports
const buildCSP = require('content-security-policy-builder')
const uuid = require('uuid/v4')





// Constants
const headerKeys = [
  'Content-Security-Policy',
  'X-Content-Security-Policy',
  'X-WebKit-CSP',
]

const domainWhitelist = [
  // Trezy.com
  'https://trezy.com',
  'https://*.trezy.com',


  // Firebase
  'https://trezy-core.firebaseapp.com',
  'https://*.firebaseio.com',
  'wss://*.firebaseio.com',

  // Google APIs
  'https://fonts.googleapis.com',
  'https://securetoken.googleapis.com',
  'https://www.googleapis.com',
  'https://googleapis.com',

  // TMDb
  'https://api.themoviedb.org',
  'https://image.tmdb.org',
]





module.exports = isDev => async (ctx, next) => {
  const nonce = uuid()

  ctx.res.nonce = nonce /* eslint-disable-line no-param-reassign */

  const policyString = buildCSP({
    directives: {
      defaultSrc: ["'self'", ...domainWhitelist],
      connectSrc: [
        "'self'",
        ...domainWhitelist,
        ...(isDev ? ['webpack://*'] : []),
      ],
      baseUri: ["'none'"],
      scriptSrc: [
        "'self'",
        `'nonce-${nonce}'`,
        "'strict-dynamic'",
        ...(isDev ? ["'unsafe-eval'"] : []),
      ],
      styleSrc: ["'self'", "'unsafe-inline'", ...domainWhitelist],
      imgSrc: ["'self'", ...domainWhitelist],
      mediaSrc: ["'self'"],
      objectSrc: ["'self'"],
      fontSrc: ["'self'", 'fonts.gstatic.com', 'data:'],
    },
  })

  headerKeys.forEach(key => {
    ctx.response.set(key, policyString)
  })

  await next()
}
