/* eslint-env node */

// Module imports
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')





module.exports = {
  target: 'serverless',

  env: {
    buildDate: (new Date()).toISOString(),
    nodeVersion: process.version,
  },

  webpack (config) {
    config.module.rules.push({
      exclude: /node_modules/,
      test: /\.svg$/,
      loader: '@svgr/webpack',
    })

    config.module.rules.unshift({
      enforce: 'pre',
      exclude: /node_modules/u,
      loader: 'eslint-loader',
      test: /\.js$/u,
    })

    config.plugins.push(new CopyWebpackPlugin([
      {
        flatten: true,
        from: path.resolve('node_modules', 'prismjs', 'components', '*.min.js'),
        to: path.resolve('public', 'prism-grammars'),
      },
    ]))

    return config
  },
}
