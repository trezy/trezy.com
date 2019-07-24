/* eslint-env node */

// Module imports
const buildCSP = require('content-security-policy-builder')
const uuidv4 = require('uuid/v4')





// Constants
const headerKeys = [
  'Content-Security-Policy',
  'X-Content-Security-Policy',
  'X-WebKit-CSP',
]

const domainWhitelist = [
  // Firebase
  'https://trezy-core.firebaseapp.com',

  // Google APIs
  'https://fonts.googleapis.com',
  'https://securetoken.googleapis.com',
  'https://www.googleapis.com',
  'https://googleapis.com',
]





module.exports = isDev => async (ctx, next) => {
  const nonce = uuidv4()

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
      fontSrc: ["'self'", 'fonts.gstatic.com'],
    },
  })

  headerKeys.forEach((key) => {
    ctx.response.set(key, policyString)
  })

  await next()
}
