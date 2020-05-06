/* eslint-disable global-require */
module.exports = {
  plugins: [
    require('postcss-easy-import')({ prefix: '_' }), // keep this first
    require('postcss-preset-env')({ /* ...options */ }), // so imports are auto-prefixed too
  ],
}
