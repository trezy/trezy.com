// Style imports
/* eslint-disable import/no-unassigned-import */
import '../scss/reset.scss'
import '../scss/lib.scss'
import '../scss/app.scss'
/* eslint-enable */





// Module imports
import {
  config as faConfig,
  library as faLibrary,
} from '@fortawesome/fontawesome-svg-core'
import { createFirestoreInstance } from 'redux-firestore'
import { ReactReduxFirebaseProvider } from 'react-redux-firebase'
import { Provider } from 'react-redux'
import LocalForage from 'localforage'
import NextApp from 'next/app'
import NextHead from 'next/head'
import NProgress from 'nprogress'
import React from 'react'
import Router from 'next/router'
import withRedux from 'next-redux-wrapper'





// Local imports
import { initStore } from '../store'
import * as fasIcons from '../helpers/fasIconLibrary'
import * as fabIcons from '../helpers/fabIconLibrary'
import * as farIcons from '../helpers/farIconLibrary'
import Banner from '../components/Banner'
import firebase from '../helpers/firebase'





// Configure and populate FontAwesome library
faConfig.autoAddCss = false
faLibrary.add(fasIcons)
faLibrary.add(fabIcons)
faLibrary.add(farIcons)

// Setup NProgress
NProgress.configure({ showSpinner: false })
Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeError', () => NProgress.done())
Router.events.on('routeChangeComplete', () => NProgress.done())





@withRedux(initStore)
class App extends NextApp {
  constructor (props) {
    super(props)

    LocalForage.config({
      name: 'Trezy.com',
      storeName: 'webStore',
    })
  }

  render () {
    const {
      Component,
      isServer,
      store,
    } = this.props
    const rrfProps = {
      firebase,
      config: {
        enableClaims: true,
        presence: 'presence',
        sessions: 'sessions',
        useFirestoreForProfile: true,
        userProfile: 'users',
      },
      createFirestoreInstance,
      dispatch: store.dispatch,
    }

    const pageProps = Object.entries(this.props.pageProps).reduce((accumulator, [key, value]) => {
      const blocklist = [
        'res',
        'req',
      ]

      if (!blocklist.includes(key)) {
        accumulator[key] = value
      }

      return accumulator
    }, {})

    return (
      <Provider store={store}>
        <ReactReduxFirebaseProvider {...rrfProps}>
          <div role="application">
            <NextHead>
              <meta name="viewport" content="initial-scale=1.0, viewport-fit=cover, width=device-width" />

              <link
                href="https://fonts.googleapis.com/css?family=Source+Code+Pro&amp;display=swap"
                rel="stylesheet" />
            </NextHead>

            <Banner isServer={isServer} />

            <Component {...pageProps} />
          </div>
        </ReactReduxFirebaseProvider>
      </Provider>
    )
  }
}





export default App
