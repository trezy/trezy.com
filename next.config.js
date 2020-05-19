/* eslint-env node */

// Module imports
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')
const webpack = require('webpack')





// Import variables from .env file.
require('dotenv').config()





// Component constants
const DEFAULT_PORT = 3000





module.exports = {
  // target: 'serverless',

  env: {
    firebaseAPIKey: process.env.FIREBASE_API_KEY,
    firebaseAppID: process.env.FIREBASE_APP_ID,
    firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
    firebaseDatabaseURL: process.env.FIREBASE_DATABASE_URL,
    firebaseMessagingSenderID: process.env.FIREBASE_MESSAGING_SENDER_ID,
    firebaseProjectID: process.env.FIREBASE_PROJECT_ID,
    firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,

    tMDBAPIKey: process.env.TMDB_API_KEY,
    tMDBAPIURL: 'https://api.themoviedb.org/3',

    buildDate: (new Date()).toISOString(),
    nodeVersion: process.version,
  },

  webpack: config => {
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
