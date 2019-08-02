/* eslint-env node */

// Module imports
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const glob = require('glob')
const path = require('path')
const crypto = require('crypto')
const webpack = require('webpack')
const withCSS = require('@zeit/next-css')
const withSass = require('@zeit/next-sass')





// Import variables from .env file.
require('dotenv').config()





// Component constants
const {
  ANALYZE,
  CIRCLECI,
  CIRCLE_BRANCH,
  CIRCLE_BUILD_NUM,
  CIRCLE_SHA1,
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_DATABASE_URL,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
  TMDB_API_KEY,
} = process.env
const DEFAULT_PORT = 3000
const COMMIT_HASH_LENGTH = 10
const DEV_BUILD_ID_LENGTH = 16





module.exports = withSass(withCSS({
  generateBuildId: () => (
    CIRCLECI
      ? CIRCLE_SHA1.toLowerCase()
      : `DEV_${crypto.randomBytes(DEV_BUILD_ID_LENGTH).toString('hex').toLowerCase()}`
  ),

  publicRuntimeConfig: {
    apis: {
      firebase: {
        apiKey: FIREBASE_API_KEY,
        authDomain: FIREBASE_AUTH_DOMAIN,
        databaseURL: FIREBASE_DATABASE_URL,
        projectId: FIREBASE_PROJECT_ID,
        storageBucket: FIREBASE_STORAGE_BUCKET,
        messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
        appId: FIREBASE_APP_ID,
      },

      tmdb: {
        apiKey: TMDB_API_KEY,
        url: 'https://api.themoviedb.org/3',
      },
    },
  },

  webpack: (config, data) => {
    if (ANALYZE) {
      config.plugins.push(new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        analyzerPort: 8888,
        openAnalyzer: true,
      }))
    }

    config.plugins.push(new webpack.DefinePlugin({
      $IS_DEVELOPMENT: JSON.stringify(data.dev),
      $IS_STAGING: JSON.stringify(['develop', 'beta'].includes(CIRCLE_BRANCH)),
      $BUILD_BRANCH: JSON.stringify(CIRCLE_BRANCH || 'develop'),
      $BUILD_COMMIT: JSON.stringify((CIRCLE_SHA1 && CIRCLE_SHA1.slice(0, COMMIT_HASH_LENGTH)) || CIRCLE_BRANCH || 'develop'),
      $BUILD_COMMIT_HASH: JSON.stringify(CIRCLE_SHA1),
      // $BUILD_COMMIT_RANGE: JSON.stringify(TRAVIS_COMMIT_RANGE),
      $BUILD_DATE: JSON.stringify((new Date()).toISOString()),
      $BUILD_ID: JSON.stringify(CIRCLE_BUILD_NUM),
      $NEXT_BUILD_ID: JSON.stringify(data.buildId),
      $NODE_VERSION: JSON.stringify(process.version),
    }))

    config.module.rules.push({
      exclude: /node_modules/,
      test: /\.svg$/,
      loader: 'raw-loader',
    })

    config.module.rules.unshift({
      enforce: 'pre',
      exclude: /node_modules/u,
      loader: 'eslint-loader',
      test: /\.js$/u,
    })

    return config
  },

  sassLoaderOptions: {
    includePaths: ['styles', 'node_modules']
      .map((dir) => path.join(__dirname, dir))
      .map((dir) => glob.sync(dir))
      .reduce((acc, dir) => acc.concat(dir), []),
  },
}))
