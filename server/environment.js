/* eslint-env node */

// Constants
const DEFAULT_PORT = 3000





module.exports = {
  isDev: process.env.NODE_ENV !== 'production',
  port: process.env.PORT || DEFAULT_PORT,
}
